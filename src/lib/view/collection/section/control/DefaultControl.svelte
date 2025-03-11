<script lang="ts">
	import AddIcon from './ExpandIcon.svelte';
	import SummaryIcon from './SummaryIcon.svelte';
	import CollapseIcon from './CollapseIcon.svelte';

	let {
		controlElement = $bindable(),
		viewState,
		onUnmount
	}: {
		controlElement: HTMLDivElement;
		viewState: { state: 'expanded' | 'summary' | 'collapsed' };
		onUnmount: () => void;
	} = $props();
</script>

<div class="floating-controls cursor-pointer p-2" bind:this={controlElement}>
	{#if viewState.state === 'expanded'}
		<SummaryIcon
			onclick={() => {
				viewState.state = 'summary';
				onUnmount();
			}}
		/>
	{:else if viewState.state === 'summary'}
		<CollapseIcon
			onclick={() => {
				viewState.state = 'collapsed';
				onUnmount();
			}}
		/>
	{:else}
		<AddIcon
			onclick={() => {
				viewState.state = 'expanded';
				onUnmount();
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
