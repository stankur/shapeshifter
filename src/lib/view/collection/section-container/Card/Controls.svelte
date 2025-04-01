<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import { float, calculateZIndex } from '$lib/view/utils/float.svelte';
	import type { DocumentManipulator } from '$lib/documentManipulator.svelte';
	import type { SectionContainer } from '$lib/model/collection';

	let {
		path,
		onUnmount,
		isCardHovered
	}: {
		path: (string | number)[];
		onUnmount: () => void;
		isCardHovered: boolean;
	} = $props();

	const documentManipulator = getContext('documentManipulator') as DocumentManipulator;
	const node = documentManipulator.getByPath(path) as SectionContainer;

	let isHovered = $state(false);

	let floatingElement: HTMLDivElement;
	let referenceElement: HTMLDivElement;

	function showControls() {
		isHovered = true;
	}

	function hideControls() {
		isHovered = false;
	}

	function switchToDefault() {
		onUnmount();
		node.activeView = 'collection/section-container/default';
	}

	onMount(() => {
		// Calculate z-index based on path length
		const zIndex = calculateZIndex(path);
		return float(referenceElement, floatingElement, 'left-start', true, zIndex)();
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	bind:this={floatingElement}
	onmouseenter={showControls}
	onmouseleave={hideControls}
	class={[
		'floating-controls flex flex-col bg-white p-2 pt-5',
		isHovered || isCardHovered ? 'visible' : 'invisible'
	]}
>
	<button class="rounded-md bg-blue-500 p-2 text-white" onclick={switchToDefault}>
		default
	</button>
</div>

<div bind:this={referenceElement} class="reference-element w-full"></div>

<style lang="postcss">
	.floating-controls {
		position: absolute;
		width: max-content;
		top: 0;
		left: 0;
	}
</style>
