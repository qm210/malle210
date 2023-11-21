import styled from "@emotion/styled";
import {IfMalleInitialized, isConnected, useMalleContext} from "../infrastructure/malle-context.tsx";
import React from "react";
import {useViewStore} from "../app/viewStore.ts";
import {counted} from "../utils/stringUtils.ts";
import {Output} from "webmidi";


const ConnectionOverlay = () => {
    const malle = useMalleContext();
    const isOpen = useViewStore(state => state.connectionOverlayOpen);
    const setConnectionOverlayOpen = useViewStore(state => state.setConnectionOverlayOpen);

    if (!isOpen) {
        return null;
    }

    return (
        <Overlay onClick={() => setConnectionOverlayOpen(false)}>
            <ConnectionOverlayFrame onClick={event => {event.stopPropagation()}}>
                <IfMalleInitialized>
                    <div>
                        {counted(malle.allOutputIds, "outputs found")}
                    </div>
                    <ul style={{flex: 1}}>
                        {
                            malle.listAllOutputs().map(output =>
                                <OutputListEntry
                                    output={output}
                                    key={output.id}
                                />
                            )
                        }
                    </ul>
                    <div style={{opacity: 0.5}}>
                        Tap outside this frame to close window.
                    </div>
                </IfMalleInitialized>
            </ConnectionOverlayFrame>
        </Overlay>
    )
};

export default ConnectionOverlay;

const OVERLAY_Z_INDEX = 10;

const Overlay = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${OVERLAY_Z_INDEX};
  background-color: #000d;
  overflow: hidden;
`;

const ConnectionOverlayFrame = styled.div`
  box-sizing: border-box;
  background-color: black;
  border: 2px solid white;
  border-radius: 0.5rem;
  width: 80vw;
  height: 70vh;
  margin: 15vh auto;
  padding: 2rem;
  color: gold;
  
  display: flex;
  flex-direction: column;
  
  & ul {
    list-style: none;
    padding: 0;
  }
  
  & li {
    border: 1px solid gold;
    display: flex;
    align-items: stretch;
    justify-content: stretch;

    & > div:first-of-type {
      padding: 1rem;
      flex: 1;
    }
    
    & > button:last-of-type {
      flex-basis: 20vw;
      align-self: flex-end;
      border: none;
      padding: 1rem;
      
      &:active {
        opacity: 0.75;
      }
    }
  }
`;

const OutputListEntry = ({output}: {output: Output}) => {
    const connected = isConnected(output);

    const toggle = () => {
        if (connected) {
            output.close();
        } else {
            output.open();
        }
    };

    return (
        <li>
            <div
                style = {{backgroundColor: !connected ? "darkred" : "darkgreen"}}
            >
                {output.name}:{" "}
                <b style={{color: connected ? "#4f4" : undefined}}>
                    {output.state} & {output.connection}
                </b>
            </div>
            <button
                style = {{backgroundColor: "transparent"}}
                onClick = {toggle}
            >
                {
                    connected ? "Close" : "Open"
                }
            </button>
        </li>
    );
};
