import styled from "@emotion/styled";
import {FullRow} from "./lib.tsx";


const PatternOptions = () => {
    return (
        <PatternOptionsFrame>
            <div>
                BPM: ...
            </div>
        </PatternOptionsFrame>
    )
};

export default PatternOptions;


const PatternOptionsFrame = styled(FullRow)`
  padding: 1rem;
  height: unset;
  background-color: darkgrey;
`;
