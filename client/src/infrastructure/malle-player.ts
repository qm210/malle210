import {Loop, Track} from "../types/types";
import {Note as WebMidiNote, Output, OutputChannel} from "webmidi";

type NoteInfo = {
    on: number,
    off: number,
    channel: OutputChannel,
    note: WebMidiNote
};

export class MallePlayer {

    currentBeat = 0;
    updateIntervalMs = 5;
    intervalHandle: NodeJS.Timeout | undefined = undefined;
    notes: NoteInfo[] = [];

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
            this.playNotesInLast(deltaBeat);
            if (this.currentBeat > loop.beats) {
                this.currentBeat -= loop.beats;
                this.playNotesInLast(deltaBeat);
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

    updateNotes(tracks: Track[], output: Output) {
        this.notes = tracks.flatMap(track => {
            if (track.channel < 1 || track.channel > 16) {
                console.warn("Ignore track, channel must be in [1..16]", track);
                return [];
            }
            return track.pattern?.notes.map(note => ({
                    on: note.on,
                    off: note.off,
                    note: new WebMidiNote(note.note, {attack: note.vel}),
                    channel: output.channels[track.channel],
                }))
                ?? [];
        }).sort((a, b) => a.on - b.on);
        console.log("updated notes", this.notes);
    }

    getNotesIn(fromBeat: number, toBeat: number) {
        const noteOns: NoteInfo[] = [];
        const noteOffs: NoteInfo[] = [];
        for (const note of this.notes) {
            if (note.on > toBeat) {
                // TODO: if sorted...could be break here?
                continue;
            } else if (note.on >= fromBeat) {
                noteOns.push(note);
            }

            if (note.off < fromBeat) {
                continue;
            } else if (note.off <= toBeat) {
                noteOffs.push(note);
            }
        }
        return {noteOns, noteOffs};
    }

    playNotesIn(fromBeat: number, toBeat: number) {
        const notes = this.getNotesIn(fromBeat, toBeat);
        notes.noteOns.forEach(note => {
            note.channel.playNote(note.note);
        });
        notes.noteOffs.forEach(note => {
            note.channel.stopNote(note.note);
        });
    }

    playNotesInLast(deltaBeat: number) {
        this.playNotesIn(this.currentBeat - deltaBeat, this.currentBeat);
    }
}

export default MallePlayer;
