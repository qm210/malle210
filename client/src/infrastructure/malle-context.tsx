import React from "react";
import {Output, WebMidi} from "webmidi";
import {Loader} from "../components/lib.tsx";

enum MalleMode {
    Raspi = "Default", // not really implemented at all
    WebMidi = "WebMidi" // experimental, but under development first (as POC)
};

type MalleState = {
    device: string | null,
    connected: boolean,
    mode: MalleMode,
};

let webMidi: typeof WebMidi | undefined;

interface MalleInterface {
    getOutputs: () => Output[], // when implementing Default/Raspi mode, make things easier by adhering to the same Output type as defined by WebMidi
}

type MalleSetState = React.Dispatch<React.SetStateAction<MalleState>>;

type MalleContextType = MalleState & MalleInterface & {
    initialized: boolean,
};

const defaultState = (): MalleState => ({
    device: null,
    connected: false,
    mode: MalleMode.WebMidi,
});

const defaultContext = (): MalleContextType => ({
    ...defaultState(),
    getOutputs: () => [],
    initialized: false,
});

const MalleContext = React.createContext<MalleContextType>(defaultContext());

const MalleProvider = ({children}: {children: React.ReactNode}) => {
    const [state, setState] = React.useState<MalleState>(defaultState());
    const [initialized, setInitialized] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (state.mode === MalleMode.WebMidi) {
            initWebMidiMode(state, setState)
                .then(() => {
                    setInitialized(true);
                });
        } else if (state.mode === MalleMode.Raspi) {
            initRapsiMode(state, setState);
        } else {
            throw Error("Invalid Malle Mode: " + state.mode)
        }

        return () => {
            setInitialized(false);
        }
    }, [state]);

    const methods = React.useMemo(() =>
        defineInterfaceMethods(state, setState)
    , [state]);

    return (
        <MalleContext.Provider
            value={{
                ...state,
                ...methods,
                initialized
            }}
            children = {children}
        />
    );
};

export default MalleProvider;

export const useMalleContext = () => React.useContext(MalleContext);

const initWebMidiMode = async (state: MalleState, setState: MalleSetState) => {
    if (webMidi) {
        return;
    }

    webMidi = await WebMidi.enable(); // might {sysex: true} if needed

    console.log("WebMIDI init", webMidi);
    if (!webMidi) {
        throw Error("Could not init WebMidi (enable() returned undefined)");
    }
    await Promise.all(webMidi.outputs.map(output => output.close()));

    throw Error("TODO: need to set up event handlers etc for the state changes...!")

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
    if (!webMidi) {
        return {
            getOutputs: defaultContext().getOutputs
        };
    }
    return {
        getOutputs: () => webMidi!.outputs
    };
};

export const IfMalleInitialized = ({children}: {children: React.ReactNode}) => {
    const {initialized} = useMalleContext();

    if (!initialized) {
        return <Loader/>;
    }

    return children;
};
