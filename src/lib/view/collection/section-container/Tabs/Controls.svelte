<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import { float } from '$lib/view/utils/float.svelte';
	import type { DocumentManipulator } from '$lib/documentManipulator.svelte';
	import type { SectionContainer } from '$lib/model/collection';

	let {
		path,
		onUnmount,
		isTabsHovered
	}: {
		path: (string | number)[];
		onUnmount: () => void;
		isTabsHovered: boolean;
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

	function switchToTableOfContents() {
		onUnmount();
		node.activeView = 'collection/section-container/table-of-contents';
	}

	function switchToCard() {
		onUnmount();
		node.activeView = 'collection/section-container/card';
	}

	onMount(() => {
		return float(referenceElement, floatingElement)();
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	bind:this={floatingElement}
	onmouseenter={showControls}
	onmouseleave={hideControls}
	class={[
		'floating-controls flex flex-col bg-white p-2 pt-5',
		isHovered || isTabsHovered ? 'visible' : 'invisible'
	]}
>
	<button class="rounded-md bg-blue-500 p-2 text-white" onclick={switchToTableOfContents}>
		toc
	</button>
	<button class="rounded-md bg-blue-500 p-2 text-white" onclick={switchToCard}>
		card
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
