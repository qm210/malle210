import styled from "@emotion/styled";
import { FaPlay, FaPause } from "react-icons/fa";
import { FaStop, FaGear } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";
import {useMalleContext} from "../infrastructure/malle-context.tsx";


const ControlBar = () => {
    const {isPlaying, togglePlay, stop} = useMalleContext();
    return (
        <Bar>
            <ControlButton onClick={togglePlay}>
            {
                isPlaying ? <FaPause/> : <FaPlay/>
            }
            </ControlButton>
            <ControlButton onClick={stop}>
                <FaStop/>
            </ControlButton>
            <ControlButton disabled>
                <BsThreeDotsVertical/>
            </ControlButton>
            <ControlButton disabled>
                <FaGear/>
            </ControlButton>
        </Bar>
    );
};

export default ControlBar;


const Bar = styled.div`
  background-color: #444;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  place-items: center;
  color: white;
  font-size: 20pt;
  
  & > div {
    flex: 1;
  }
`;

const ControlButton = styled.button`
  background: none;
  border: none;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  &:active {
    background-color: #0003;
  }
  
  &:disabled {
    opacity: 0.3;
    pointer-events: none;
  }
`;
