import React from "react";
import {WebMidi, Output} from "webmidi";
import {Loader} from "../components/lib.tsx";
import {useViewStore} from "../app/viewStore.ts";
import {Loop} from "../types/types";
import MallePlayer from "./malle-player.ts";

enum MalleMode {
    Raspi = "Default", // not really implemented at all
    WebMidi = "WebMidi" // experimental, but under development first (as POC)
}

enum PortState {
    Disconnected = "disconnected",
    Connected = "connected"
}

enum Connection {
    Closed = "closed",
    Pending = "pending",
    Open = "open",
}

enum EventType {
    Closed = "closed",
    Opened = "opened"
}

enum PlayState {
    Stopped = "Stopped",
    Playing = "Playing",
    Paused = "Paused",
    Error = "Error"
}

type MalleState = {
    mode: MalleMode,
    connectedOutputs: Output[], // when implementing Default/Raspi mode, make things easier by adhering to the same Output type as defined by WebMidi
    allOutputIds: string[],
    currentLoop: Loop,
    playState: PlayState,
    initialized: boolean,
};

let webMidi: typeof WebMidi | undefined;

interface MalleInterface {
    togglePlay: () => void,
    stop: () => void,
    listAllOutputs: () => Output[],
    getOutput: (id: string) => Output | undefined,
}

type MalleSetState = React.Dispatch<React.SetStateAction<MalleState>>;

type MalleDerivedValues = {
    isPlaying: boolean,
    isDisconnected: boolean,
};

type MalleContextType = MalleState & MalleDerivedValues & MalleInterface & {
    playbackBeat: number | null,

};

const defaultState = (): MalleState => ({
    mode: MalleMode.WebMidi,
    connectedOutputs: [],
    allOutputIds: [],
    currentLoop: {
        beats: 16,
        bpb: 4, // beats per bar, is that required?
        bpm: 120,
    },
    playState: PlayState.Stopped,
    initialized: false,
});

const defaultContext = (): MalleContextType => ({
    ...defaultState(),
    isDisconnected: true,
    isPlaying: false,
    // <-- explicitly define the derived defaults, they are not a function of whole defaultState()
    playbackBeat: null,
    togglePlay: () => {},
    stop: () => {},
    listAllOutputs: () => [],
    getOutput: () => undefined,
});

const MalleContext = React.createContext<MalleContextType>(defaultContext());

const mallePlayer = new MallePlayer();

const MalleProvider = ({children}: {children: React.ReactNode}) => {
    const [state, setState] = React.useState<MalleState>(defaultState());
    const [playbackBeat, setPlaybackBeat] = React.useState<number | null>(null);
    const setConnectionOverlayOpen = useViewStore(state => state.setConnectionOverlayOpen);

    React.useEffect(() => {
        if (state.initialized) {
            return;
        }
        initMode(state)
            .then(wm => {
                setState(state => ({
                    ...state,
                    connectedOutputs: filterConnected(wm.outputs),
                    allOutputIds: wm.outputs.map(o => o.id),
                    initialized: true,
                }));
                addEventListeners(wm.outputs, setState);
            });
        return () => {
            // setState(defaultState());
        }
    }, [state]);

    const isPlaying = React.useMemo(() =>
            state.playState === PlayState.Playing,
        [state.playState]
    );

    const isDisconnected = React.useMemo(() =>
            state.connectedOutputs.length === 0
        , [state.connectedOutputs]);

    const methods = {
        togglePlay: () => {
            if (!isPlaying) {
                mallePlayer.start(state.currentLoop, (beat) => {
                    setPlaybackBeat(beat);
                });
            } else {
                mallePlayer.pause();
            }
            setState(state => ({
                ...state,
                playState: state.playState === PlayState.Playing
                    ? PlayState.Paused
                    : PlayState.Playing,
            }));
        },
        stop: () => {
            mallePlayer.reset();
            setPlaybackBeat(null);
            if (state.mode === MalleMode.WebMidi && webMidi) {
                webMidi.outputs.forEach(output => {
                    output.sendAllSoundOff();
                })
            }
        },
        listAllOutputs: () =>
            state.mode === MalleMode.WebMidi && webMidi
                ? webMidi.outputs
                : [], // TODO: nothing implemented otherwise
        getOutput: (id: string) =>
            state.mode === MalleMode.WebMidi && webMidi
                ? webMidi.getOutputById(id)
                : undefined
    };

    React.useEffect(() => {
        let stillMounted = true;
        const timeout = setTimeout(() => {
            if (isDisconnected && stillMounted) {
                setConnectionOverlayOpen(true);
            }
        }, 2000);
        return () => {
            stillMounted = false;
            clearTimeout(timeout);
        }
    }, [isDisconnected, setConnectionOverlayOpen]);

    return (
        <MalleContext.Provider
            value={{
                ...state,
                ...methods,
                playbackBeat,
                isPlaying,
                isDisconnected,
            }}
            children = {children}
        />
    );
};

export default MalleProvider;

export const useMalleContext = () => React.useContext(MalleContext);

const filterConnected = (outputs: Output[]): Output[] =>
    outputs.filter(isConnected);

const initMode = async (state: MalleState): Promise<typeof WebMidi> => {
    if (state.mode === MalleMode.WebMidi) {
        return initWebMidiMode()
    } else {
        throw Error("Mode not yet implemented: " + state.mode);
    }
}

const initWebMidiMode = async (): Promise<typeof WebMidi> => {
    if (webMidi) {
        return webMidi;
    }

    webMidi = await WebMidi.enable(); // might {sysex: true} if needed

    console.log("WebMIDI init", webMidi);
    if (!webMidi) {
        throw Error("Could not init WebMidi (enable() returned undefined)");
    }
    await Promise.all(webMidi.outputs.map(output => {
        // unclear why we start with connected outputs
        // cf. https://github.com/djipco/webmidi/discussions/394
        output.sendAllSoundOff();
        // output.close();
    }));

    return webMidi;
};

export const IfMalleInitialized = ({children}: {children: React.ReactNode}) => {
    const {initialized} = useMalleContext();

    if (!initialized) {
        return <Loader/>;
    }

    return children;
};

const addEventListeners = (outputs: Output[], setState: MalleSetState) => {
    // TODO: this only applies to WebMidi yet.

    const updateConnectedOutputs = () =>
        setState(state => ({
            ...state,
            connectedOutputs: filterConnected(outputs)
        }));

    for (const output of outputs) {
        output.addListener(Output.ANY_EVENT, event => {
            console.log("WebMidi event", event, "on output", output.id);
        });
        output.addListener(EventType.Closed, updateConnectedOutputs);
        output.addListener(EventType.Opened, updateConnectedOutputs);
    }
};

export const isConnected = (output: Output) => {
    // TODO: only holds for WebMidi outputs for now
    // cf. https://github.com/djipco/webmidi/discussions/395
    return output.connection === Connection.Open && output.state === PortState.Connected;
};
