<script lang="ts">
	import {
		sectionContainer,
		sectionContainerCardViewState,
		type Section
	} from '$lib/model/collection';
	import type { ContentHeading, ContentParagraph } from '$lib/model/content';
	import { registry } from '$lib/viewRegistry.svelte';
	import type { Component } from 'svelte';
	import type { z } from 'zod';
	import type { Refs } from '$lib/components/Document.svelte';
	import { getContext } from 'svelte';
	import type { Document } from '$lib/model/document';
	import { addSection } from '$lib/actions/collection/section-container.svelte';
	import { createHeadingNavProps, createSummaryNavProps } from './navigation';
	import type { NavigationHandler } from '$lib/services/navigation/types';
	import type { DocumentManipulator } from '$lib/documentManipulator.svelte';
	import Chip from '$lib/components/Chip.svelte';
	import {
		expandAllSections,
		handleAddSection,
		type HeadingComponentProps,
		type ContentComponentProps,
		type SectionContainerType,
		type SectionContainerViewStateType
	} from './cardUtils';

	// Custom action to bind an element to refs with a specific ID
	function bindToRefs(element: HTMLElement, id: string) {
		// Set the data-flip-id attribute
		element.setAttribute('data-flip-id', id);

		// Add the element to the refs object
		refs[id] = { element };

		// Return a cleanup function
		return {
			destroy() {
				// Remove the element from refs when unmounted
				delete refs[id];
			}
		};
	}

	const document = getContext('document') as Document;
	const documentManipulator = getContext('documentManipulator') as DocumentManipulator;

	let {
		path,
		refs,
		onUnmount
	}: {
		path: (string | number)[];
		refs: Refs;
		onUnmount: (elementToPin?: string | null) => void;
	} = $props();

	const node = documentManipulator.getByPath(path) as SectionContainerType;
	let { children, view, activeView } = $derived(node);

	let SectionRenderers = $derived(
		children.map((child, sectionIndex) => ({
			child,
			sectionIndex,
			HeadingRenderer: registry[
				child.heading.activeView as keyof typeof registry
			] as unknown as Component<HeadingComponentProps>,
			SummaryRenderers: child.summary.map((summaryChild, summaryIndex) => ({
				summaryChild,
				summaryIndex,
				Renderer: registry[
					summaryChild.activeView as keyof typeof registry
				] as unknown as Component<ContentComponentProps>
			}))
		}))
	);

	let someHasImage = $derived(children.some((child) => child.image));

	// Minimum width for cards
	const minCardWidth = 250;
</script>

<div class="card-grid" style:--min-card-width={`${minCardWidth}px`}>
	{#each SectionRenderers as { child, sectionIndex, HeadingRenderer, SummaryRenderers }}
		<div class="card flex flex-col gap-6 border-1 border-gray-400 p-5">
			{#if child.image}
				<img
					class="aspect-square"
					src={child.image}
					alt="Section cover"
					use:bindToRefs={`${child.id}-image`}
				/>
			{:else if someHasImage}
				<div class="aspect-square" />
			{/if}
			<div>
				<HeadingRenderer
					path={[...path, 'children', sectionIndex, 'heading']}
					{refs}
					{onUnmount}
					{...createHeadingNavProps(child, node, sectionIndex, document)}
					overrides={{
						class: 'prose-h1:text-md md:prose-h1:text-xl'
					}}
					onClickReadMode={() => {
						// Pass the heading ID to onUnmount using a closure
						expandAllSections(node, document, () => onUnmount(child.heading.id));
					}}
				/>
				{#each SummaryRenderers as { summaryChild, summaryIndex, Renderer }}
					<Renderer
						path={[...path, 'children', sectionIndex, 'summary', summaryIndex]}
						{refs}
						{onUnmount}
						overrides={{
							class: 'prose-p:text-xs prose-p:text-gray-500'
						}}
						{...createSummaryNavProps(child, node, summaryChild.id, sectionIndex, document)}
					/>
				{/each}
			</div>
		</div>
	{/each}

	{#if document.state.mode !== 'read'}
		<Chip onclick={() => handleAddSection(node, onUnmount)} label="Add Section" />
	{/if}
</div>

<style lang="postcss">
	.card-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(var(--min-card-width), 1fr));
		gap: 16px;
	}

	.card {
		min-width: var(--min-card-width);
	}
</style>
