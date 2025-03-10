<script lang="ts">
	import AddIcon from './ExpandIcon.svelte';
	import SummaryIcon from './SummaryIcon.svelte';
	import CollapseIcon from './CollapseIcon.svelte';

	let {
		controlElement = $bindable(),
		viewState
	}: {
		controlElement: HTMLDivElement;
		viewState: { state: 'expanded' | 'summary' | 'collapsed' };
	} = $props();
</script>

<div class="floating-controls cursor-pointer p-2" bind:this={controlElement}>
	{#if viewState.state === 'expanded'}
		<SummaryIcon
			onclick={() => {
				viewState.state = 'summary';
			}}
		/>
	{:else if viewState.state === 'summary'}
		<CollapseIcon
			onclick={() => {
				viewState.state = 'collapsed';
			}}
		/>
	{:else}
		<AddIcon
			onclick={() => {
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
