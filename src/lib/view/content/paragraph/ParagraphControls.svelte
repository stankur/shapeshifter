<script lang="ts">
	import { onMount } from 'svelte';
	import { float, calculateZIndex } from '$lib/view/utils/float.svelte';

	let {
		onConvertToHeading,
		isParagraphHovered,
		path
	}: {
		onConvertToHeading: () => void;
		isParagraphHovered: boolean;
		path: (string | number)[];
	} = $props();

	let isHovered = $state(false);
	let floatingElement: HTMLDivElement;
	let referenceElement: HTMLDivElement;

	function showControls() {
		isHovered = true;
	}

	function hideControls() {
		isHovered = false;
	}

	onMount(() => {
		// Calculate z-index based on path length
		const zIndex = calculateZIndex(path);
		return float(referenceElement, floatingElement, 'left', true, zIndex)();
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	bind:this={floatingElement}
	onmouseenter={showControls}
	onmouseleave={hideControls}
	class={[
		'floating-controls flex items-center space-x-2 rounded bg-white/80 px-2 py-1 shadow-sm backdrop-blur-sm',
		isHovered || isParagraphHovered ? 'visible' : 'invisible'
	]}
>
	<button
		class="text-sm font-semibold text-gray-700 hover:text-blue-600"
		onclick={onConvertToHeading}
		title="Convert to heading and create new section"
	>
		H
	</button>
</div>

<div bind:this={referenceElement} class="reference-element w-full"></div>

<style lang="postcss">
	.floating-controls {
		position: absolute;
		width: max-content;
		z-index: 10;
	}
</style>
