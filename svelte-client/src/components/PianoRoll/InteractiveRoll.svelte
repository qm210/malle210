<script lang="ts">
    import {changeNote, createNote, notes} from "../../store/piano-roll-store";
    import {dragHandlers, draggedNote, dragState} from "../../store/drag-state";
    import {MOUSE_BUTTON} from "../../lib/constants";
    import {getPianoRollContext} from "../../lib/contexts";

    export let hoveredKey;

    const {
        rollWidth,
        rollHeight,
        keyWidth,
        currentNoteLength,
        getRelativeCoordinates,
        getEventCoordinates,
        withOffsetTransformed,
    } = getPianoRollContext();

    const onMouseDown = (event) => {
        if (event.button !== MOUSE_BUTTON.LEFT) {
            return;
        }
        const {beat, key} = getEventCoordinates(event);
        createNote(beat, key, currentNoteLength);
    };

    const onMouseLeave = () => {
        hoveredKey = null;
        dragHandlers.endDrag();
    };

    const onMouseUp = () => {
        if ($dragState.payload) {
            console.log("drop", $dragState);
            const coords = getRelativeCoordinates($dragState.offset);
            changeNote($dragState.payload.uuid, coords);
        }
        dragHandlers.endDrag();
    };

    const onMouseMove = (event) => {
        const {key} = getEventCoordinates(event);
        hoveredKey = key;
        if ($dragState.isDragging) {
            if (event.buttons === 0) {
                dragHandlers.endDrag();
            } else {
                dragHandlers.drag(event);
            }
        }
    };

    const deleteAllNotes = () => {
        notes.set([]);
    };

</script>

<g
        transform={`translate(${keyWidth} 0)`}
        on:mousemove={onMouseMove}
        on:mouseleave={onMouseLeave}
        on:contextmenu|preventDefault={deleteAllNotes}
        on:mouseup={onMouseUp}
>
    <rect
            class="piano-roll"
            width="{rollWidth}"
            height="{rollHeight}"
            on:mousedown|self|stopPropagation={onMouseDown}
    />
    <slot/>
</g>

<style>
    .piano-roll {
        cursor: crosshair;
        pointer-events: all;
        fill: none;
    }
</style>