<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import { float, calculateZIndex } from '$lib/view/utils/float.svelte';
	import type { DocumentManipulator } from '$lib/documentManipulator.svelte';
	import type { SectionContainer } from '$lib/model/collection';

	let {
		path,
		onUnmount,
		isDefaultHovered
	}: {
		path: (string | number)[];
		onUnmount: () => void;
		isDefaultHovered: boolean;
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

	function switchToTabs() {
		onUnmount();
		node.activeView = 'collection/section-container/tabs';
	}

	function switchToCard() {
		onUnmount();
		node.children.forEach((child) => {
			const defaultView = child.view.find((view) => view.type === 'collection/section/default');
			if (defaultView && defaultView.state) {
				// Cast to unknown first to avoid TypeScript errors with the old structure
				const state = defaultView.state as unknown as { 
					state: 'expanded' | 'summary';
					variation: 'default' | 'summary-visible-on-expand';
				};
				state.state = 'summary';
			}
		});
		node.activeView = 'collection/section-container/card';
	}

	function switchToTableOfContents() {
		onUnmount();
		node.activeView = 'collection/section-container/table-of-contents';
	}

	function switchToSidebar() {
		onUnmount();
		node.activeView = 'collection/section-container/sidebar';
	}
	
	// Get the current variation from the first section (if any)
	function getCurrentVariation(): 'default' | 'summary-visible-on-expand' {
		if (node.children.length > 0) {
			const firstChild = node.children[0];
			const defaultView = firstChild.view.find((view) => view.type === 'collection/section/default');
			if (defaultView && defaultView.state) {
				// Cast to unknown first to avoid TypeScript errors with the old structure
				const state = defaultView.state as unknown as { 
					state: 'expanded' | 'summary';
					variation: 'default' | 'summary-visible-on-expand';
				};
				return state.variation || 'default';
			}
		}
		return 'default';
	}
	
	function updateAllSectionsVariation(event: Event) {
		const select = event.target as HTMLSelectElement;
		const variation = select.value as 'default' | 'summary-visible-on-expand';
		
		node.children.forEach((child) => {
			const defaultView = child.view.find((view) => view.type === 'collection/section/default');
			if (defaultView && defaultView.state) {
				// Cast to unknown first to avoid TypeScript errors with the old structure
				const state = defaultView.state as unknown as { 
					state: 'expanded' | 'summary';
					variation: 'default' | 'summary-visible-on-expand';
				};
				state.variation = variation;
			}
		});
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
		isHovered || isDefaultHovered ? 'visible' : 'invisible'
	]}
>
	<button class="mb-1 rounded-md bg-blue-500 p-2 text-white" onclick={switchToTabs}> tabs </button>
	<button class="mb-1 rounded-md bg-blue-500 p-2 text-white" onclick={switchToCard}> card </button>
	<button class="mb-1 rounded-md bg-blue-500 p-2 text-white" onclick={switchToTableOfContents}>
		toc
	</button>
	<button class="mb-1 rounded-md bg-blue-500 p-2 text-white" onclick={switchToSidebar}> sidebar </button>
	
	<div class="flex flex-col">
		<label for="variation-select" class="text-sm text-gray-700">Summary:</label>
		<select 
			value={getCurrentVariation()}
			onchange={updateAllSectionsVariation}
		>
			<option value="default">Default</option>
			<option value="summary-visible-on-expand">Always Show Summary</option>
		</select>
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
