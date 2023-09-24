<script lang="ts">
    import {notes} from "../../store/piano-roll-store";
    import {quantize} from "../../utils/utils";
    import {v4 as uuid} from "uuid";
    import {getContext} from "svelte";
    import {dragHandlers, dragState} from "../../store/drag-state";

    export let hoveredKey;

    const {
        rollWidth,
        rollHeight,
        keyWidth,
        keyHeight,
        nBars,
        nQuantsPerBeat,
        currentNoteLength,
        minVisibleKey,
        nVisibleKeys,
    } = getContext('piano-roll');

    const getCoordinates = (event) => {
        const {offsetX, offsetY} = event;
        const beat = quantize((offsetX - keyWidth) / rollWidth * nBars, 1 / nQuantsPerBeat);
        const key = Math.max(0, nVisibleKeys - 1 - Math.round(offsetY / keyHeight)) + minVisibleKey;
        return {key, beat};
    };

    const createNote = (event) => {
        const {beat, key} = getCoordinates(event);
        notes.update(state => [
            ...state, {
                key: key,
                on: beat,
                length: currentNoteLength,
                vel: 1,
                uuid: uuid()
            }
        ]);
    };

    const onMouseLeave = () => {
        hoveredKey = null;
        if ($dragState.isDragging) {
            dragHandlers.endDrag();
        }
    };

    const onMouseMove = (event) => {
        const {key} = getCoordinates(event);
        hoveredKey = key;
        if ($dragState.isDragging) {
            dragHandlers.drag(event);
        }
    };

    const deleteAllNotes = () => {
        notes.set([]);
    };

</script>

<rect
        class="piano-roll"
        x="{keyWidth}"
        width="{rollWidth}"
        height="{rollHeight}"
        on:mousedown|self={createNote}
        on:mouseleave={onMouseLeave}
        on:mousemove={onMouseMove}
        on:contextmenu|preventDefault={deleteAllNotes}
/>

<style>
    .piano-roll {
        cursor: crosshair;
        pointer-events: all;
        fill: none;
    }
</style>