import {Loop, Track} from "../types/types";

// TODO: tracks will not a constant, especially not here
export const tracks: Track[] = [{
    name: "Bass",
    channel: 0,
    id: "track0",
    pattern: {
        steps: 16,
        notes: [{
            on: 0,
            off: 1,
            note: 20,
            vel: 1,
        }, {
            on: 4,
            off: 6,
            note: 24,
            vel: 1,
        }, {
            on: 8,
            off: 9,
            note: 22,
            vel: 0.7,
        }, {
            on: 12,
            off: 16,
            note: 20,
            vel: 0.9,
        }, {
            on: 14,
            off: 16,
            note: 32,
            vel: 0.6,
        }]
    },
}, {
    name: "Lead",
    channel: 1,
    id: "track1",
    pattern: null,
}];

export class MallePlayer {

    currentBeat = 0;
    updateIntervalMs = 5;
    intervalHandle: NodeJS.Timeout | undefined = undefined;

    reset() {
        this.pause();
        this.currentBeat = 0;
    }

    start(loop: Loop, callback?: ((beat: number) => void)) {
        let lastTime = Date.now();
        const beatPerMs = loop.bpm / 60_000;
        this.intervalHandle = setInterval(() => {
            const nowTime = Date.now();
            const deltaBeat = (nowTime - lastTime) * beatPerMs;
            this.currentBeat += deltaBeat;
            if (this.currentBeat > loop.beats) {
                this.currentBeat -= loop.beats;
            }
            if (callback) {
                callback(this.currentBeat);
            }
            lastTime = nowTime;
        }, this.updateIntervalMs);
    }

    pause() {
        clearTimeout(this.intervalHandle);
    }

}

export default MallePlayer;
