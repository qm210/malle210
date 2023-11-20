import { writable } from "svelte/store";
import {BaseNote, ScaleMode} from "../notes";
import type {Scale, Note} from "../notes";
import {v4 as uuid} from "uuid";

export const notes = writable<Note[]>([]);

export const currentScale = writable<Scale>({
    mode: ScaleMode.Minor,
    baseNote: BaseNote.C,
    active: true,
});

export const createNote = (beat: number, key: number, length: number) =>
    notes.update(state => [
        ...state, {
            key,
            length,
            beat,
            vel: 1,
            uuid: uuid()
        }
    ]);

export const changeNote = (uuid: string, update: Partial<Note>) =>
    notes.update(state => state.map(note =>
        note.uuid === uuid
            ? { ...note, update }
            : note
    ));
