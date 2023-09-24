<script lang="ts">
    import {notes} from "../../store/piano-roll-store";
    import type {Note} from "../../notes";
    import {dragNotePayload, dragState, DragType} from "../../store/drag-state";
    import {getContext} from "svelte";
    import {dragHandlers} from "../../store/drag-state.js";

    const {
        beatWidth,
        nBeatsPerBar,
        minVisibleKey,
        nVisibleKeys,
        keyHeight,
        keyWidth
    } = getContext('piano-roll');

    const toRoll = (note: Note) => {
        const w = beatWidth * nBeatsPerBar;
        const on = note.on * w;
        const off = (note.on + note.length) * w;
        return {
            ...note,
            on,
            off,
            width: off - on,
            y: (minVisibleKey + nVisibleKeys - note.key - 1) * keyHeight,
        };
    };

    $: visibleNotes = $notes.map(toRoll).filter(note => {
            if ($dragState.isDragging) {
                return $dragState.payload.uuid !== note.uuid;
            }
            // TODO. check boundaries
            return true;
        });

    $: draggedNote = (() => {
        if (!$dragNotePayload) {
            return null;
        }
        const result = toRoll($dragNotePayload);
        return result;
    })();

    const endDrag = () => {
        if (!$dragState.isDragging) {
            return;
        }
        if ($dragState.onDrop) {
            $dragState.onDrop();
        }
    };

</script>

<g transform="translate({keyWidth} 0)">
    {#each visibleNotes as note (note.uuid)}
        <g transform="translate(0 {note.y})">
            <rect
                    class="note"
                    x="{note.on}"
                    width="{note.width}"
                    height="{keyHeight}"
                    rx="3"
                    on:mousedown={dragHandlers.startNoteDrag(note)}
                    on:contextmenu|preventDefault
            />
            <rect
                    class="note-resizer"
                    x="{note.off - 8}"
                    width="8"
                    height="{keyHeight}"
                    on:mousedown={dragHandlers.startNoteDrag(note, DragType.NoteMove)}
                    on:mouseup={endDrag}
                    on:contextmenu|preventDefault
            />
        </g>
    {/each}
    {#if draggedNote}
    <rect
        class="note selected"
        x="{draggedNote.on}"
        width="{draggedNote.width}"
        y="{draggedNote.y}"
        height="{keyHeight}"
        rx="3"
        on:mouseup={endDrag}
        on:contextmenu|preventDefault
    />
    {/if}
</g>

<style>
    .note {
        fill: yellowgreen;
        cursor: move;
    }

    .note.selected {
        fill: yellow;
    }

    .note-resizer {
        fill: none;
        cursor: ew-resize;
    }
</style>
