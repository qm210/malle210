import styled from "@emotion/styled";
import {IfMalleInitialized, useMalleContext} from "../infrastructure/malle-context.tsx";
import React from "react";


const ConnectionOverlay = () => {
    const malleState = useMalleContext();

    if (malleState.connected) {
        return null;
    }

    console.log("MS", malleState, malleState.getOutputs());

    return (
        <Overlay>
            <ConnectionOverlayFrame>
                <IfMalleInitialized>
                    <div>
                        Blablu
                    </div>
                    <ul>
                        {
                            malleState.getOutputs().map(output =>
                                <li>
                                    <span>
                                        {output.name}: {output.state}
                                    </span>
                                    <button>
                                        Open
                                    </button>
                                </li>
                            )
                        }
                    </ul>
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
  
  & li {
    border: 1px solid gold;
    padding: 0.5rem;
  }
`;
