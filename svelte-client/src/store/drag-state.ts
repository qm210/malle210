import {derived, writable} from "svelte/store";
import type {Note} from "../notes";

type Point = {
    x: number,
    y: number,
};

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
});

type DragPayload = unknown;

export type DragState = {
    isDragging: boolean,
    start: Point,
    offset: Point,
    type: DragType,
    payload: DragPayload | null,
    onDrop?: () => void,
};

export const dragState = writable<DragState>(initialDragState());

export const dragHandlers = {
    drag: (event: MouseEvent) => {
        console.log("handle drag", event);
    },
    endDrag: () => {
        dragState.set(initialDragState());
    },
    startNoteDrag: (note: Note, type?: DragType) => (event: MouseEvent) => {
        dragState.set({
            isDragging: true,
            start: fromClient(event),
            offset: zero(),
            payload: note,
            type: type ?? DragType.NoteMove
        });
    },
};

export const dragNotePayload = derived(
    dragState,
    ($dragState) => {
        if (!$dragState.isDragging) {
            return null;
        }
        if (![DragType.NoteMove, DragType.NoteResize].includes($dragState.type)) {
            return null;
        }
        return $dragState.payload as Note;
    }
);
