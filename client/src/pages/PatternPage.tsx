import React from "react";
import TrackPreview from "../components/TrackPreview.tsx";
import type {Track} from "../types/types";
import styled from "@emotion/styled";
import {FullColumn} from "../components/lib.tsx";
import PatternOptions from "../components/PatternOptions.tsx";

const PatternPage = () => {

    const tracks: Track[] = [{
        name: "Bass",
        channel: 0,
        id: "track0",
    }, {
        name: "Lead",
        channel: 1,
        id: "track1"
    }];

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
