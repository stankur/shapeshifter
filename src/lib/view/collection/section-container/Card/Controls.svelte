<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import { float, calculateZIndex } from '$lib/view/utils/float.svelte';
	import type { DocumentManipulator } from '$lib/documentManipulator.svelte';
	import type { SectionContainer } from '$lib/model/collection';
	import { sectionContainerCardViewState } from '$lib/model/collection';
	import type { z } from 'zod';

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
	
	type CardViewState = z.infer<typeof sectionContainerCardViewState>;
	
	// Get the current view state
	const activeView = node.activeView;
	const currentView = node.view.find((v) => v.type === activeView);
	const hasCardState = currentView && 'state' in currentView && currentView.state;
	const viewState = hasCardState ? currentView.state as CardViewState : null;

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
	
	function changeVariation(event: Event) {
		const select = event.target as HTMLSelectElement;
		const newVariation = select.value as 'default' | 'brick';
		
		onUnmount();
		// Update the variation in the state
		const viewToUpdate = node.view.find((v) => v.type === activeView);
		if (viewToUpdate && 'state' in viewToUpdate && viewToUpdate.state) {
			(viewToUpdate.state as CardViewState).variation = newVariation;
		}
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
	<div class="flex flex-col gap-2">
		<button class="rounded-md bg-blue-500 p-2 text-white" onclick={switchToDefault}>
			default
		</button>
		
		<div class="flex flex-col">
			<label for="variation-select" class="text-sm text-gray-700">Layout:</label>
			<select 
				value={viewState?.variation ?? 'default'}
				onchange={changeVariation}
			>
				<option value="default">Default</option>
				<option value="brick">Brick</option>
			</select>
		</div>
	</div>
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
