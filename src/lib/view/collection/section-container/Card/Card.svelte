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
	import Default from './Default.svelte';
	import Brick from './Brick.svelte';
	import type { z } from 'zod';

	let {
		path,
		refs,
		onUnmount
	}: {
		path: (string | number)[];
		refs: Refs;
		onUnmount: () => void;
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

	//** if the heading is clicked, and the section is the only expanded section in the container, animate the change. */
	function onHeadingClick(section: Section) {
		const defaultView = section.view.find((v) => v.type === 'collection/section/default');
		if (defaultView?.state === 'expanded') {
			const expandedSections = children.filter((s) => {
				const view = s.view.find((v) => v.type === 'collection/section/default');
				return view?.state === 'expanded';
			});

			if (expandedSections.length === 1 && expandedSections[0].id === section.id) {
				onUnmount();
				document.state.animateNextChange = true;
			}
		}
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
	return defaultView?.state === 'summary';
})}
	<div class="card-container" onmouseenter={showCardControls} onmouseleave={hideCardControls}>
		<Default {path} {refs} {onUnmount} {onHeadingClick} />
	</div>
{:else}
	<div class="card-container" onmouseenter={showCardControls} onmouseleave={hideCardControls}>
		{#if document.state.mode === 'customize'}
			<Controls {path} {onUnmount} {isCardHovered} />
		{/if}

		{#if variation === 'brick'}
			<Brick {path} {refs} {onUnmount} {onHeadingClick} />
		{:else}
			<Default {path} {refs} {onUnmount} {onHeadingClick} />
		{/if}
	</div>
{/if}

<style lang="postcss">
	.card-container {
		position: relative;
	}
</style>
