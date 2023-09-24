import { writable } from "svelte/store";
import {BaseNote, ScaleMode} from "./notes";
import type {Scale} from "./notes";

export const notes = writable([]);

export const currentScale = writable<Scale>({
    mode: ScaleMode.Minor,
    baseNote: BaseNote.C,
    active: true,
});
