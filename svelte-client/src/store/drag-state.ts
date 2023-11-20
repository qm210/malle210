import {derived, get, writable} from "svelte/store";
import type {Note} from "../notes";
import type {Point} from "../utils/types";

export enum DragType {
    None,
    NoteMove,
    NoteResize,
}

const zero = (): Point => ({
    x: 0,
    y: 0
});

const fromClient = (event: MouseEvent): Point => ({
    x: event.clientX,
    y: event.clientY
});

const initialDragState = () => ({
    isDragging: false,
    start: zero(),
    offset: zero(),
    type: DragType.None,
    payload: null,
    transformPayload: undefined,
    originalPayload: null,
    startedAt: 0,
});

type DragPayload = Note | null;

export type DragState = {
    isDragging: boolean,
    start: Point,
    offset: Point,
    type: DragType,
    payload: DragPayload,
    transformPayload: undefined | ((payload: DragPayload, offset: Point) => DragPayload),
    startedAt: number,
    onDrop?: () => void,
    onJustClick?: () => void,
};

export const dragState = writable<DragState>(initialDragState());

export const dragHandlers = {
    drag: (event: MouseEvent) => {
        dragState.update((state: DragState) => {
            if (!state.isDragging) {
                return state;
            }
            const offset = {
                x: event.clientX - state.start.x,
                y: event.clientY - state.start.y,
            };
            return {
                ...state,
                offset,
            };
        })
    },
    endDrag: () => {
        const state = get(dragState);
        if (!state.isDragging) {
            return;
        }
        if (state.onDrop) {
            state.onDrop();
        }
        dragState.set(initialDragState());
    },
    startNoteDrag: (note: Note, type?: DragType, transformPayload?: (payload: DragPayload, offset: Point) => DragPayload) => (event: MouseEvent) => {
        // TODO: NO! don't use the resizers (is shitty for mobile)
        // -> implement as pinch gesture (how??) and also with Shift or someting, or right click
        // also: long click -> menu
        type ??= DragType.NoteMove;
        dragState.set({
            isDragging: true,
            start: fromClient(event),
            offset: zero(),
            payload: note,
            startedAt: Date.now(),
            transformPayload,
            type,
        });
    },
};

export const draggedNote = derived(
    dragState,
    (state) => {
        if (!state.isDragging) {
            return null;
        }
        if (![DragType.NoteMove, DragType.NoteResize].includes(state.type)) {
            return null;
        }
        const note = typeof state.transformPayload === "function"
            ? state.transformPayload(state.payload, state.offset)
            : state.payload;
        return note as Note;
    }
);
