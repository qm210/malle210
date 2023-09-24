import type {NoteKey, Scale} from "../notes";
import {enumKeys} from "./utils";
import {BaseNote, ScaleMode} from "../notes";

export const baseNotes = enumKeys(BaseNote);

export const scaleNotes = {
    [ScaleMode.Minor]: [0, 2, 3, 5, 7, 8, 10, 12],
    [ScaleMode.Major]: [0, 2, 4, 5, 7, 9, 11, 12],
};

export const availableScales = Object.keys(scaleNotes);


const parseNote = (noteNumber: number) => {
    // C4 = note 60 -> C1 = note 24
    const octave = Math.floor(noteNumber / 12) - 1;
    const noteAboveC = noteNumber % 12;
    return {octave, noteAboveC};
};

export const noteFeatures = (noteNumber: number, scale?: Scale): NoteKey => {
    const {octave, noteAboveC} = parseNote(noteNumber);
    const baseNote = baseNotes.indexOf(scale?.baseNote ?? BaseNote.C);
    const relativeNote = (baseNote + noteAboveC) % 12;
    const noteOnScale = scale ? scaleNotes[scale.mode]?.includes(relativeNote) : undefined;
    return {
        number: noteNumber,
        name: baseNotes[relativeNote] + octave,
        isBaseNote: relativeNote === baseNote,
        isBlack: baseNotes[relativeNote].includes('#'),
        noteOnScale,
    };
};
