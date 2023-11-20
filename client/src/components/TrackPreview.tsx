import React from "react";
import {Track} from "../types/types";
import styled from "@emotion/styled";


type TrackPreviewProps = {
    track: Track,
};

const TrackPreview = ({track}: TrackPreviewProps) => {
    return (
        <TrackPreviewFrame>
            <div>
                {track.name}
            </div>
            <div>
                blablu...
            </div>
        </TrackPreviewFrame>
    );
};

export default TrackPreview;


const TrackPreviewFrame = styled.div`
  box-sizing: border-box;
  border: 2px solid darkblue;
  display: flex;
  flex-direction: row;

  & > div {
    padding: 2rem;
  }
  
  & > div:first-of-type {
    border-right: 2px dashed darkblue;
    width: 8vw;
  }
  
  & > div:last-of-type {
    flex: 1;
  }
`;
