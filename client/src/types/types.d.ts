export type Note = {
    on: number,
    off: number
};

export type Pattern = {
    notes: Note[],
    steps: number,
};
