<script lang="ts">
    import {notes} from "../../store/piano-roll-store";
    import {draggedNote, dragState} from "../../store/drag-state";
    import {dragHandlers} from "../../store/drag-state.js";
    import {getPianoRollContext} from "../../lib/contexts";
    import type {Note} from "../../notes";

    const {
        keyHeight,
        toRoll,
    } = getPianoRollContext();

    $: visibleNotes = $notes.map(toRoll).filter(note => {
            if ($dragState.isDragging) {
                const draggedNote = $dragState.payload as Note;
                return draggedNote?.uuid !== note?.note.uuid;
            }
            // TODO. check boundaries
            return true;
        });

    $: dragRect = toRoll($draggedNote);

    $: console.log("DR", dragRect, $draggedNote);
    
    const deleteNote = () => {
        // TODO: no - implement long touch.
        // console.log("delete it!", $notes);
    };

</script>

<g>
    {#each visibleNotes as noteRect (noteRect.note.uuid)}
        <g transform="translate(0 {noteRect.y})">
            <rect
                    class="note"
                    x="{noteRect.on}"
                    width="{noteRect.width}"
                    height="{keyHeight}"
                    rx="3"
                    on:mousedown|self={dragHandlers.startNoteDrag(noteRect.note)}
                    on:mouseleave|stopPropagation
                    on:contextmenu|preventDefault={deleteNote}
            />
            <!--
                <rect
                        class="note-resizer"
                        x="{noteRect.off - 8}"
                        width="8"
                        height="{keyHeight}"
                        on:mousedown|self={dragHandlers.startNoteDrag(noteRect.note, DragType.NoteMove)}
                        on:mouseup={dragHandlers.endDrag}
                        on:mouseleave|stopPropagation
                        on:contextmenu|stopPropagation|preventDefault
                />
            -->
        </g>
    {/each}
    {#if dragRect}
        <rect
            class="note dragged"
            x="{dragRect.on}"
            width="{dragRect.width}"
            y="{dragRect.y}"
            height="{keyHeight}"
            rx="3"
            on:mouseup={dragHandlers.endDrag}
            on:contextmenu|preventDefault
        />
    {/if}
</g>

<style>
    .note {
        fill: yellowgreen;
        cursor: move;
        stroke-width: 3px;
        stroke-opacity: 0.5;
        stroke: none;
    }

    .note.dragged {
        fill: whitesmoke;
        stroke: yellowgreen;
    }

/*
    .note.selected {
        fill: whitesmoke;
        stroke: darkred;
    }

    .note-resizer {
        fill: none;
        cursor: ew-resize;
    }
*/
</style>
