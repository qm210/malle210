import React from "react";
import {Loop, Pattern, Size, Track} from "../types/types";
import styled from "@emotion/styled";
import {useMalleContext} from "../infrastructure/malle-context.tsx";
import {useRefWithSize} from "../utils/useResizeEffect.ts";
import useWindowSize from "../utils/useWindowSize.ts";
import {range} from "../utils/arrayUtils.ts";
import {Group} from "../utils/svgUtils.tsx";
import {Utilities} from "webmidi";
import {notOrWithSign} from "../utils/stringUtils.ts";


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
                <div>
                    {track.name}
                </div>
                <div>
                    Channel {track.channel}
                </div>
                <div>
                    {notOrWithSign(track.octaveShift, "Octaves")}
                </div>
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
  align-items: center;

  & > div {
    padding: 2rem;
  }
  
  & > div:first-of-type {
    width: 8vw;
    white-space: nowrap;
    
    & > div:not(:first-of-type) {
      font-size: 0.8rem;
    }
  }
  
  & > div:last-of-type {
    flex: 1;
  }
`;

type LoopGeometry = Size & Loop & {
    beatWidth: number
};

const TrackLoopPreview = ({track, loop, height}: {track: Track, loop: Loop, height: number}) => {
    const {playbackBeat} = useMalleContext();
    const {ref, width} = useRefWithSize<HTMLDivElement>();
    const size = {width, height};
    const geometry: LoopGeometry = {...size, ...loop, beatWidth: width / loop.beats};

    return (
        <div ref={ref} style={{...size, padding: 0}}>
            <svg {...size}>
                <rect {...size} fill={"none"}/>
                <PatternNotes {...geometry} pattern={track.pattern}/>
                <PatternGrid {...geometry}/>
                <PlaybackLine {...geometry} currentBeat={playbackBeat}/>
            </svg>
        </div>
    );
};

const VerticalLine = (props: {beat: number, beatWidth: number, height: number, stroke?: string}) =>
    <rect
        width = {1}
        height = {props.height}
        x = {props.beat * props.beatWidth}
        fill = "none"
        stroke = {props.stroke ?? "grey"}
    />;

const PatternGrid = (props: LoopGeometry) =>
    range(props.beats).map(r =>
        <VerticalLine
            height = {props.height}
            beatWidth = {props.beatWidth}
            beat = {r}
            stroke = {r % props.bpb === 0 ? "darkblue" : "#00f4"}
            key = {r}
        />
    );

const PlaybackLine = ({currentBeat, ...props}: LoopGeometry & {currentBeat: number | null}) =>
    currentBeat === null
        ? null
        : <VerticalLine
            height = {props.height}
            beat = {currentBeat}
            beatWidth = {props.beatWidth}
            stroke = {"red"}
        />;

const PatternNotes = ({pattern, ...props}: LoopGeometry & {pattern: Pattern | null}) =>
    pattern === null
        ? null
        : pattern.notes.map((note, index) =>
            <Group
                key = {index}
                x = {note.on * props.beatWidth}
            >
                <rect
                    width = {note.length * props.beatWidth}
                    height = {props.height}
                    fill = {"#08f8"}
                    stroke = {"none"}
                />
                <text
                    x={"0.25rem"}
                    y={props.height * 0.95}
                    fill={"black"}
                    fontSize={"1rem"}>
                    {Utilities.getNoteDetails(note.note)?.identifier ?? "??"}
                </text>
            </Group>
        );
