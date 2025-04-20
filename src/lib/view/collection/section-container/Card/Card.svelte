<script lang="ts">
	import {
		sectionContainer,
		sectionContainerCardViewState,
		type Section
	} from '$lib/model/collection';
	import type { Refs } from '$lib/components/Document.svelte';
	import { getContext } from 'svelte';
	import type { Document } from '$lib/model/document';
	import Controls from './Controls.svelte';
	import type { DocumentManipulator } from '$lib/documentManipulator.svelte';
    import DefaultView from "$lib/view/collection/section-container/Default/Default.svelte"
	import Default from './Default.svelte';
	import Brick from './Brick.svelte';
	import type { z } from 'zod';
	import { collapseAllSections } from './cardUtils';

	let {
		path,
		refs,
		onUnmount
	}: {
		path: (string | number)[];
		refs: Refs;
		onUnmount: (elementToPin?: string | null) => void;
	} = $props();

	const document = getContext('document') as Document;
	const documentManipulator = getContext('documentManipulator') as DocumentManipulator;

	type SectionContainer = z.infer<typeof sectionContainer>;
	type SectionContainerViewState = z.infer<typeof sectionContainerCardViewState>;

	const node = documentManipulator.getByPath(path) as SectionContainer;
	let { children, view, activeView } = $derived(node);

	let isCardHovered = $state(false);

	function showCardControls() {
		isCardHovered = true;
	}

	function hideCardControls() {
		isCardHovered = false;
	}


	// Get the current variation from the state
	function getVariation() {
		const currentView = view.find((v) => v.type === activeView);
		if (currentView && 'state' in currentView && currentView.state) {
			return (currentView.state as SectionContainerViewState).variation ?? 'default';
		}
		return 'default';
	}
	
	let variation = $derived(getVariation());
</script>

{#if !node.children.every((child) => {
	const defaultView = child.view.find((v) => v.type === 'collection/section/default');
	return defaultView?.state?.state === 'summary';
})}
	<div class="card-container" onmouseenter={showCardControls} onmouseleave={hideCardControls}>
		<DefaultView 
			{path} 
			{refs} 
			{onUnmount} 
			onHeadingClick={(section) => {
				// When a heading is clicked in the default view that was shown from card view,
				// collapse all sections to go back to card view
				collapseAllSections(node, document, onUnmount);
			}} 
		/>
	</div>
{:else}
	<div class="card-container" onmouseenter={showCardControls} onmouseleave={hideCardControls}>
		{#if document.state.mode === 'customize'}
			<Controls {path} {onUnmount} {isCardHovered} />
		{/if}

		{#if variation === 'brick'}
			<Brick {path} {refs} {onUnmount}/>
		{:else}
			<Default {path} {refs} {onUnmount} />
		{/if}
	</div>
{/if}

<style lang="postcss">
	.card-container {
		position: relative;
	}
</style>
