<script lang="ts">
	import { onMount } from 'svelte';
	import type { z } from 'zod';
	import type { sectionContainer } from '$lib/model/collection';
	import { float } from '$lib/view/utils/float.svelte';

	let {
		node,
		onUnmount,
		directions,
		isTableHovered
	}: {
		node: z.infer<typeof sectionContainer>;
		onUnmount: () => void;
		directions: {
			type: string;
			perRow?: number;
			gap?: number;
			interGenerationGap: number;
			innerGap: number;
			innerDirection: string;
		}[];
		isTableHovered: boolean;
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
		return float(referenceElement, floatingElement)();
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	bind:this={floatingElement}
	onmouseenter={showControls}
	onmouseleave={hideControls}
	class={[
		'floating-controls flex flex-col bg-white p-2',
		isHovered || isTableHovered ? 'visible' : 'invisible'
	]}
>
	<button
		class="rounded-md bg-blue-500 p-2 text-white"
		onclick={() => {
			console.log('clicked');
			onUnmount();
			node.activeView = 'collection/section-container/card';
		}}
	>
		card
	</button>
	<button
		class="rounded-md bg-blue-500 p-2 text-white"
		onclick={() => {
			console.log('clicked');
			onUnmount();
			node.activeView = 'collection/section-container/sidebar';
		}}
	>
		sidebar
	</button>
	<button
		class="rounded-md bg-blue-500 p-2 text-white"
		onclick={() => {
			console.log('clicked');
			onUnmount();
			node.activeView = 'collection/section-container/tabs';
		}}
	>
		tabs
	</button>
	<button
		class="rounded-md bg-blue-500 p-2 text-white"
		onclick={() => {
			console.log('clicked');
			onUnmount();
			node.activeView = 'collection/section-container/tab-shadcn';
		}}
	>
		shadcn tabs
	</button>
	{#each directions as _, index}
		<select
			bind:value={directions[index].type}
			onchange={(event) => {
				console.log('bro I cahneged for: ', index);
				directions[index].type = (event.target as HTMLSelectElement).value;
			}}
		>
			<option value="column">Column</option>
			<option value="row">Row</option>
		</select>

		<input
			type="range"
			min="0"
			max="72"
			bind:value={directions[index].gap}
			onchange={(event) => {
				directions[index].gap = parseInt((event.target as HTMLInputElement).value);
			}}
		/>
		<input
			type="range"
			min="0"
			max="72"
			bind:value={directions[index].interGenerationGap}
			onchange={(event) => {
				directions[index].interGenerationGap = parseInt((event.target as HTMLInputElement).value);
			}}
		/>
		<input
			type="range"
			min="0"
			max="72"
			bind:value={directions[index].innerGap}
			onchange={(event) => {
				directions[index].innerGap = parseInt((event.target as HTMLInputElement).value);
			}}
		/>
		{#if directions[index].type === 'row'}
			<input type="range" min="1" max="4" bind:value={directions[index].perRow} />
		{/if}
	{/each}
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
