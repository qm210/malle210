import React from "react";
import {Output, WebMidi} from "webmidi";

enum MalleMode {
    Raspi = "Default", // not really implemented at all
    WebMidi = "WebMidi" // experimental, but under development first (as POC)
};

type MalleState = {
    device: string | null,
    connected: boolean,
    mode: MalleMode,
    _webMidi: typeof WebMidi | undefined
};

interface MalleInterface {
    getOutputs: () => Output[], // when implementing Default/Raspi mode, make things easier by adhering to the same Output type as defined by WebMidi
}

type MalleSetState = React.Dispatch<React.SetStateAction<MalleState>>;

type MalleContextType = MalleState & MalleInterface;

const defaultContext = (): MalleContextType => ({
    device: null,
    connected: false,
    mode: MalleMode.WebMidi,
    _webMidi: undefined,
    getOutputs: () => [],
});

const MalleContext = React.createContext<MalleContextType>(defaultContext());

const MalleProvider = ({children}: {children: React.ReactNode}) => {
    const [state, setState] = React.useState<MalleState>(defaultContext());

    React.useEffect(() => {
        if (state.mode === MalleMode.WebMidi) {
            initWebMidiMode(state, setState);
            return () => {
                // closeWebMidi();
            }
        } else if (state.mode === MalleMode.Raspi) {
            initRapsiMode(state, setState);
        } else {
            throw Error("Invalid Malle Mode: " + state.mode)
        }
    }, [state]);

    const methods = React.useMemo(() =>
        defineInterfaceMethods(state, setState)
    , [state]);

    return (
        <MalleContext.Provider value={{...state, ...methods}}>
            {children}
        </MalleContext.Provider>
    );
};

export default MalleProvider;

export const useMalleContext = () => React.useContext(MalleContext);

const initWebMidiMode = (state: MalleState, setState: MalleSetState) => {
    if (state._webMidi) {
        return;
    }

    WebMidi
        .enable() // might {sysex: true} if needed
        .then((init: typeof WebMidi) => {
            console.log("WebMIDI init", init);
            if (!init) {
                throw Error("Could not init WebMidi (enable() returned undefined)");
            }
            setState(s => ({
                ...s,
                _webMidi: init
            }))
        });
};

const initRapsiMode = (state: MalleState, setState: MalleSetState) => {
    throw Error("Nothing implemented yet for the Raspi MalleMode. I know...");
};

const defineInterfaceMethods = (state: MalleState, setState: MalleSetState): MalleInterface => {
    if (state.mode === MalleMode.WebMidi) {
        return defineWebMidiInterfaceMethods(state, setState);
    }
    throw Error("defineInterfaceMethods not implemented fro mode: " + state.mode);
};

const defineWebMidiInterfaceMethods = (state: MalleState, setState: MalleSetState): MalleInterface => {
    const wm = state._webMidi;
    if (!wm) {
        return {
            getOutputs: defaultContext().getOutputs
        };
    }
    return {
        getOutputs: () => wm.outputs
    };
};
