<script lang="ts">
	import AddIcon from './ExpandIcon.svelte';
	import SummaryIcon from './SummaryIcon.svelte';
	import { getContext } from 'svelte';
	import type { Document } from '$lib/model/document';
	let {
		controlElement = $bindable(),
		viewState,
		onUnmount
	}: {
		controlElement: HTMLDivElement;
		viewState: { state: 'expanded' | 'summary' };
		onUnmount: () => void;
	} = $props();

	let document = getContext('document') as Document;
</script>

<div class="floating-controls cursor-pointer p-2" bind:this={controlElement}>
	{#if viewState.state === 'expanded'}
		<SummaryIcon
			onclick={() => {
				document.state.animateNextChange = false;
				viewState.state = 'summary';
			}}
		/>
	{:else}
		<AddIcon
			onclick={() => {
				document.state.animateNextChange = false;
				viewState.state = 'expanded';
			}}
		/>
	{/if}
</div>

<style lang="postcss">
	.floating-controls {
		position: absolute;
		width: max-content;
		top: 0;
		left: 0;
	}
</style>
