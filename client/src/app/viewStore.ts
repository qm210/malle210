import {create} from "zustand";

interface ViewState {
    connectionOverlayOpen: boolean,
    setConnectionOverlayOpen: (open: boolean) => void,
}

export const useViewStore = create<ViewState>()((set => ({
    connectionOverlayOpen: false,
    setConnectionOverlayOpen: (open: boolean) => set(state => ({
        ...state,
        connectionOverlayOpen: open,
    }))
})));
