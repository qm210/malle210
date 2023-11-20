import styled from "@emotion/styled";
import { FaPlay } from "react-icons/fa";
import { FaStop } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaGear } from "react-icons/fa6";


const ControlBar = () => {
    const playing = false;
    return (
        <Bar>
            <ControlButton disabled={playing}>
                <FaPlay/>
            </ControlButton>
            <ControlButton disabled={!playing}>
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
  width: 100%;
  height: 100%;
  color: unset;
  font-size: unset;

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
