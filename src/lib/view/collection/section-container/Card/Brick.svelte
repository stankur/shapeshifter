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

	type SectionContainer = z.infer<typeof sectionContainer>;
	type SectionContainerViewState = z.infer<typeof sectionContainerCardViewState>;

	// Define component types with navigation props
	type HeadingComponentProps = {
		path: (string | number)[];
		refs: Refs;
		onUnmount: () => void;
		updateParent?: () => void;
		getNextEditable?: NavigationHandler;
		getPrevEditable?: NavigationHandler;
		overrides?: {
			class?: string;
		};
		onClickReadMode?: () => void;
		documentNode?: Document;
	};

	type ContentComponentProps = {
		path: (string | number)[];
		refs: Refs;
		onUnmount: () => void;
		overrides?: {
			class?: string;
		};
		updateParent?: () => void;
		onSplit?: (blocks: [string, string]) => void;
		getNextEditable?: NavigationHandler;
		getPrevEditable?: NavigationHandler;
		documentNode?: Document;
	};

	let {
		path,
		refs,
		onUnmount,
		onHeadingClick
	}: {
		path: (string | number)[];
		refs: Refs;
		onUnmount: () => void;
		onHeadingClick?: (section: Section) => void;
	} = $props();

	const node = documentManipulator.getByPath(path) as SectionContainer;
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

	let gap = $derived(
		(view.find((v) => v.type === activeView) as { state: SectionContainerViewState }).state.gap
	);

	// Minimum width for cards
	const minCardWidth = 250;
</script>

<div class="card-container" style:--gap={`${gap}px`} style:--min-card-width={`${minCardWidth}px`}>
	{#each SectionRenderers as { child, sectionIndex, HeadingRenderer, SummaryRenderers }}
		<div class="card flex flex-row gap-6 border-1 border-gray-400 p-5">
			{#if child.image}
				<img
					class="w-24 h-24 xl:w-32 xl:h-32"
					src={child.image}
					alt="Section cover"
					use:bindToRefs={`${child.id}-image`}
				/>
			{:else if someHasImage}
				<div class="w-24 h-24 xl:w-32 xl:h-32" />
			{/if}
			<div class="flex flex-col gap-2 xl:gap-2">
				<HeadingRenderer
					path={[...path, 'children', sectionIndex, 'heading']}
					{refs}
					{onUnmount}
					{...createHeadingNavProps(child, node, sectionIndex, document)}
					overrides={{
						class: 'prose-h1:text-xl'
					}}
					onClickReadMode={() => {
						// toggle the state in the default view, not change it to the default view. Change the state in the default view.
						const defaultView = node.children[sectionIndex].view.find(
							(v) => v.type === 'collection/section/default'
						);
						if (defaultView) {
							document.state.animateNextChange = true;
							onUnmount();
							defaultView.state = defaultView.state === 'expanded' ? 'summary' : 'expanded';
						}
						if (onHeadingClick) {
							onHeadingClick(child);
						}
					}}
				/>
				<div>
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
		</div>
	{/each}

	{#if document.state.mode !== 'read'}
		<Chip
			onclick={() => {
				onUnmount();
				addSection(node, node.children[0].heading.level);
			}}
			label="Add Section"
		/>
	{/if}
</div>

<style lang="postcss">
	.card-container {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--gap);
	}

	@media (min-width: 1280px) {
		.card-container {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
