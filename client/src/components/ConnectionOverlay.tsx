import styled from "@emotion/styled";
import {useMalleContext} from "../infrastructure/malle-context.tsx";


const ConnectionOverlay = () => {
    const malleState = useMalleContext();

    if (malleState.connected) {
        return null;
    }

    console.log("MS", malleState, malleState.getOutputs());

    return (
        <Overlay>
            <ConnectionOverlayFrame>
                <div>
                    Blablu
                </div>
                <button>
                    Löl
                </button>
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
  
  display: flex;
  flex-direction: column;
`;
