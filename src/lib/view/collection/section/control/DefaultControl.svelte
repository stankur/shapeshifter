<script lang="ts">
	import AddIcon from './ExpandIcon.svelte';
	import SummaryIcon from './SummaryIcon.svelte';
	import CollapseIcon from './CollapseIcon.svelte';
	import { getContext } from 'svelte';
	import type { Document } from '$lib/model/document';
	let {
		controlElement = $bindable(),
		viewState,
		onUnmount
	}: {
		controlElement: HTMLDivElement;
		viewState: { state: 'expanded' | 'summary' | 'collapsed' };
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
	{:else if viewState.state === 'summary'}
		<CollapseIcon
			onclick={() => {
				document.state.animateNextChange = false;

				viewState.state = 'collapsed';
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
