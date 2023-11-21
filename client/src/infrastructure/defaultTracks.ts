import {Track} from "../types/types";

// TODO: tracks will not be a constant, this is for development.

export const defaultTracks: Track[] = [{
    name: "Bass",
    channel: 1,
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
    channel: 2,
    id: "track1",
    pattern: null,
}];
