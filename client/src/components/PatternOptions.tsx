import styled from "@emotion/styled";
import {FullRow} from "./lib.tsx";
import { SiMidi } from "react-icons/si";
import React from "react";
import {useMalleContext} from "../infrastructure/malle-context.tsx";
import {useViewStore} from "../app/viewStore.ts";


const PatternOptions = () => {
    const {currentLoop} = useMalleContext();
    return (
        <PatternOptionsFrame>
            <div style={{flex: 1, paddingLeft: "0.5rem"}}>
                BPM: {currentLoop.bpm}
            </div>
            <MidiState/>
        </PatternOptionsFrame>
    )
};

export default PatternOptions;


const PatternOptionsFrame = styled(FullRow)`
  height: unset;
  background-color: darkgrey;
  align-items: baseline;  
`;

const MidiState = () => {
    const malle = useMalleContext();
    const setConnectionOverlayOpen = useViewStore(state => state.setConnectionOverlayOpen);

    return (
        <div
            style={{
                padding: "0 0.5rem",
                backgroundColor: malle.isDisconnected
                    ? "darkred"
                    : undefined
            }}
            onClick={() => setConnectionOverlayOpen(true)}
        >
            <SiMidi
                size={"3rem"}
                color={malle.isDisconnected
                    ? "red"
                    : "black"
                }
            />
        </div>
    );
};
