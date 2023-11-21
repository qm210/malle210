import React from "react";
import {Loop, Track} from "../types/types";
import styled from "@emotion/styled";
import {useMalleContext} from "../infrastructure/malle-context.tsx";
import useResizeEffect, {useRefWithSize, useSizeOf} from "../utils/useResizeEffect.ts";
import useWindowSize from "../utils/useWindowSize.ts";


type TrackPreviewProps = {
    track: Track,
};

const TrackPreview = ({track}: TrackPreviewProps) => {
    const {currentLoop} = useMalleContext();
    const {ref} = useRefWithSize<HTMLDivElement>();
    const windowSize = useWindowSize();
    const height = 0.16 * windowSize.height;
    return (
        <TrackPreviewFrame
            ref={ref}
            style={{height}}
        >
            <div>
                {track.name}
            </div>
            <TrackLoopPreview
                track={track}
                loop={currentLoop}
                height={Math.max(0, height - 4) /* border width */}
            />
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

const TrackLoopPreview = ({track, loop, height}: {track: Track, loop: Loop, height: number}) => {
    const {ref, width} = useRefWithSize<HTMLDivElement>();
    const size = {width, height};
    return (
        <div ref={ref} style={{width, height, padding: 0}}>
            <svg {...size}>
                <rect {...size} fill={"none"}/>
            </svg>
        </div>
    );
};
