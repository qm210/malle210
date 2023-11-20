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
};
