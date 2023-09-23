import {create} from 'zustand';
import {Note} from "../types/types";

interface PatternState {
    notes: Note[],
    addNote: (note: Note) => void
}

const useStore = create<PatternState>()((set => ({
    notes: [],
    addNote: (note) => set(state => ({
        ...state,
        notes: [...state.notes, note],
    }))
})));
