import {Track} from "../types/types";

// TODO: tracks will not be a constant, this is for development.

export const defaultTracks: Track[] = [{
    name: "Bass",
    channel: 1,
    id: "track0",
    octaveShift: 0,
    jitter: {
        velocity: 0.2,
        beat: 0.03,
    },
    pattern: {
        steps: 16,
        notes: [{
            on: 0,
            length: 4 ,
            note: 20,
            velocity: 0.5,
        }, {
            on: 4,
            length: 4,
            note: 24,
            velocity: 0.6,
        }, {
            on: 6,
            length: 2,
            note: 24,
            velocity: 0.3,
        },{
            on: 7,
            length: 2,
            note: 24,
            velocity: 0.1,
        }, {
            on: 8,
            length: 3,
            note: 22,
            velocity: 0.7,
        }, {
            on: 12,
            length: 4,
            note: 20,
            velocity: 0.6,
        }, {
            on: 14,
            length: 3,
            note: 32,
            velocity: 0.55,
        }]
    },
}, {
    name: "Lead",
    channel: 1,
    id: "track1",
    octaveShift: -1,
    jitter: {
        velocity: 0.3,
        beat: 0.08,
    },
    pattern: {
        steps: 16,
        notes: [{
            on: 0,
            length: 2,
            note: 60,
            velocity: 0.4 ,
        }, {
            on: 3,
            length: 1,
            note: 58,
            velocity: 0.1 ,
        }, {
            on: 4,
            length: 1.9,
            note: 63,
            velocity: 0.3,
        }, {
            on: 6,
            length: 1.9,
            note: 63,
            velocity: 0.1,
        }, {
            on: 7,
            length: 2,
            note: 63,
            velocity: 0.05 ,
        }, {
            on: 8,
            length: 3,
            note: 62,
            velocity: 0.65,
        }, {
            on: 8,
            length: 4,
            note: 65,
            velocity: 0.2,
        }, {
            on: 11.5,
            length: 0.5,
            note: 55,
            velocity: 0.45,
        }, {
            on: 12,
            length: 0.5,
            note: 56,
            velocity: 0.35,
        }, {
            on: 12.5,
            length: 0.5,
            note: 58,
            velocity: 0.425,
        }, {
            on: 13,
            length: 0.5,
            note: 63,
            velocity: 0.425,
        }, {
            on: 13.5,
            length: 0.5,
            note: 65,
            velocity: 0.425,
        }, {
            on: 14,
            length: 0.5,
            note: 70,
            velocity: 0.5,
        }, {
            on: 14.5,
            length: 0.5,
            note: 75,
            velocity: 0.5,
        }, {
            on: 15,
            length: 0.5,
            note: 74,
            velocity: 0.5,
        }, {
            on: 15.5,
            length: 0.5,
            note: 67,
            velocity: 0.763,
        }]
    },
}];
