export type Note = {
    uuid: string,
    beat: number
    length: number,
    key: number,
    vel: number,
};

export type NoteOnRoll = {
    note: Note,
    on: number,
    off: number,
    width: number,
    y: number
};

export type NoteCoord = Pick<Note, 'beat' | 'key'>;

export type NoteKey = {
    number: number,
    name: string,
    isBaseNote: boolean,
    isBlack: boolean,
    noteOnScale?: boolean,
};

export enum BaseNote {
    C = "C",
    Cis = "C#",
    D = "D",
    Dis = "D#",
    E = "E",
    F = "F",
    Fis = "F#",
    G = "G",
    Gis = "G#",
    A = "A",
    Ais = "A#",
    B = "B"
}

export enum ScaleMode {
    Minor = "minor",
    Major = "major",
    // TODO: extend
}

export type Scale = {
    baseNote: BaseNote,
    mode: ScaleMode,
    active: boolean,
};
