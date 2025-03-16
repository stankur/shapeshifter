<script lang="ts">
	import { onMount } from 'svelte';
	import { float } from '$lib/view/utils/float.svelte';

	let {
		node,
		onUnmount,
		isCardHovered
	}: {
		node: any;
		onUnmount: () => void;
		isCardHovered: boolean;
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

	function switchToDefault() {
		onUnmount();
		node.activeView = 'collection/section-container/default';
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
