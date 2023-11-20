<script lang="ts">
	import {arrayWith} from "../../utils/utils";
	import {noteFeatures} from "../../utils/baseNotes.js";
	import type {NoteKey} from "../../notes";
	import {currentScale} from "../../store/piano-roll-store";
	import InteractiveRoll from "./InteractiveRoll.svelte";
	import InteractiveNotes from "./InteractiveNotes.svelte";
	import {onDestroy} from "svelte";
	import {setPianoRollContext} from "../../lib/contexts";

	let windowWidth;

	// general geometry
	const width = 1400;
	const height = 800;
	const lowerPanelHeight = 50;
	const keyWidth = 30;
	const rollWidth = width - keyWidth;
	const rollHeight = height - lowerPanelHeight;

	// width calculations
	const nBars = 8;
	const nBeatsPerBar = 4;
	const barWidth = (width - keyWidth) / nBars;
	const beatWidth = barWidth / nBeatsPerBar;
	let nQuantsPerBeat = 8;

	// height calculations
	const minVisibleKey = 36;
	const nVisibleKeys = 1 + 4 * 12;
	const keyHeight = rollHeight / nVisibleKeys;

	let scale;
	const unsubscribeScale = currentScale.subscribe(state => {
		scale = state;
	});
	onDestroy(unsubscribeScale);
	// <-- this can be shortened to scale <-> $currentScale

	const keys = arrayWith<NoteKey>(
			nVisibleKeys,
			i => noteFeatures(minVisibleKey + nVisibleKeys - i - 1, scale)
	);
	const beats = arrayWith<number>(
			nBars * nBeatsPerBar,
			i => i / nBeatsPerBar
	);

	let hoveredKey = null;
	let currentNoteLength = 0.25;

	// TODO: limit viewport for smaller widths - think mobile
	let minVisibleBeat = 0;
	let nVisibleBeats = nBars * nBeatsPerBar;

	setPianoRollContext({
		rollWidth,
		rollHeight,
		keyWidth,
		keyHeight,
		beatWidth,
		nBars,
		nBeatsPerBar,
		nQuantsPerBeat,
		currentNoteLength,
		minVisibleBeat,
		nVisibleBeats,
		minVisibleKey,
		nVisibleKeys,
	});
</script>

<svelte:window bind:innerWidth={windowWidth}/>
<div>
	<div
			class="backdrop"
			style="width: {width}px; height: {rollHeight}px"
	/>
	<svg
			xmlns="http://www.w3.org/2000/svg"
			width={width}
			height={height}
	>
		<rect
				width={width}
				height={rollHeight}
		/>
		{#each keys as key, index (key.number)}
			<g transform="translate(0, {index * keyHeight})">
				<rect
						width="{width}"
						height="{keyHeight}"
						fill-opacity={key.noteOnScale === false ? 0.1 : 1}
						stroke="var(--grid-color-weak)"
						stroke-width="2"
				/>
				<rect
						width="{keyWidth}"
						height="{keyHeight}"
						fill={key.isBlack ? "#0008": "white"}
						stroke="var(--grid-color-strong)"
				/>
				{#if hoveredKey === key.number}
					<rect
							width="{width - 2}"
							height="{keyHeight - 2}"
							x="1"
							y="1"
							fill="#8b04"
							stroke-width="0"
					/>
				{/if}
				<text
						x="5"
						y="{0.8 * keyHeight}"
						font-size="12"
						fill={key.isBlack ? "white" : "black"}
						font-weight={key.isBlack ? "normal" : "bold"}
						stroke={key.isBaseNote ? "green" : "transparent"}
				>
					{key.name}
				</text>
				{#if key.isBaseNote}
					<line
							x1="0"
							y1="{keyHeight}"
							x2="{width}"
							y2="{keyHeight}"
							stroke-width="3"
							stroke="var(--grid-color-strong)"
							stroke-opacity="0.3"
					/>
				{/if}
			</g>
		{/each}
		<g transform="translate({keyWidth}, 0)">
			{#each beats as beatNumber, index (beatNumber)}
				<rect
						x="{index * beatWidth}"
						width="{beatWidth}"
						height="{rollHeight}"
						fill="none"
						stroke="var(--grid-color-weak)"
				/>
				{#if index % nBeatsPerBar === 0}
					<line
							x1="{index * beatWidth}"
							y1="0"
							x2="{index * beatWidth}"
							y2="{rollHeight}"
							stroke="var(--grid-color-strong)"
					/>
					<text
							x="{index * beatWidth - 4}"
							y="{rollHeight + 30}"
							fill="var(--grid-color-strong)"
					>
						{index / nBeatsPerBar}
					</text>
				{/if}
			{/each}
		</g>
		<InteractiveRoll bind:hoveredKey>
			<InteractiveNotes/>
		</InteractiveRoll>
	</svg>
</div>

<style>
	div {
		width: 100%;
		height: 100%;
	}

	svg {
		--grid-color-weak: #0507;
		--grid-color-strong: #0a0;
		--bg-color: #0007;
		fill: var(--bg-color);
		pointer-events: bounding-box;
	}

	.backdrop {
		position: absolute;
		box-shadow: 2px 2px 8px #000a;
		user-select: none;
		pointer-events: none;
	}
</style>
