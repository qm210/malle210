export type Note = {
    on: number,
    off: number
};

export type Pattern = {
    notes: Note[],
    steps: number,
};

export type Track = {
    name: string,
    channel: number,
    id: string,
    pattern: Pattern | null,
};

export type Loop = {
    bpm: number, // beats per minute
    bpb: number, // bars per beat
    beats: number
};

export type Size = {
    width: number,
    height: number
};
