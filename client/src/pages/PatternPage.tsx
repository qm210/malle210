import React from "react";
import TrackPreview from "../components/TrackPreview.tsx";
import styled from "@emotion/styled";
import {FullColumn} from "../components/lib.tsx";
import PatternOptions from "../components/PatternOptions.tsx";
import {tracks} from "../infrastructure/malle-player.ts";

const PatternPage = () => {
    return (
        <PatternPageFrame>
            <TrackList>
                {
                    tracks.map(track =>
                        <TrackPreview
                            track={track}
                            key={track.id}
                        />
                    )
                }
            </TrackList>
            <PatternOptions/>
        </PatternPageFrame>
    );
};

export default PatternPage;

const PatternPageFrame = styled(FullColumn)`
`;

const TrackList = styled(FullColumn)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  flex: 1;
`;
