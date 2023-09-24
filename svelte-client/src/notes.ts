export type Note = {
    on: number
    length: number,
    key: number,
    vel: number,
    // id: string, // need ? probably not.
};

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
