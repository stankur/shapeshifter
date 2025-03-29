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
	import Controls from './Controls.svelte';
	import { addSection } from '$lib/actions/collection.svelte';
	import {
		createHeadingNavProps,
		createSummaryNavProps
	} from './navigation';
	import type { NavigationHandler } from '$lib/services/navigation/types';
	import type { DocumentManipulator } from '$lib/documentManipulator.svelte';

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
		documentNode?: Document;
	};
	
	type ContentComponentProps = {
		path: (string | number)[]; 
		refs: Refs;
		onUnmount: () => void;
		updateParent?: () => void;
		onSplit?: (blocks: [string, string]) => void;
		getNextEditable?: NavigationHandler;
		getPrevEditable?: NavigationHandler;
		documentNode?: Document;
	};

	let {
		path,
		refs,
		onUnmount
	}: {
		path: (string | number)[];
		refs: Refs;
		onUnmount: () => void;
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

	let perRow = $derived(
		(view.find((v) => v.type === activeView) as { state: SectionContainerViewState }).state.perRow
	);
	let gap = $derived(
		(view.find((v) => v.type === activeView) as { state: SectionContainerViewState }).state.gap
	);

	let isCardHovered = $state(false);

	function showCardControls() {
		isCardHovered = true;
	}

	function hideCardControls() {
		isCardHovered = false;
	}
</script>

<div class="card-container" onmouseenter={showCardControls} onmouseleave={hideCardControls}>
	{#if document.state.mode === 'customize'}
		<Controls path={path} {onUnmount} {isCardHovered} />
	{/if}

	<div class="container flex flex-wrap" style:--perRow={perRow} style:--gap={`${gap}px`}>
		{#each SectionRenderers as { child, sectionIndex, HeadingRenderer, SummaryRenderers }}
			<div class="card border-1 border-black p-5">
				<HeadingRenderer
					path={[...path, 'children', sectionIndex, 'heading']}
					{refs}
					{onUnmount}
					{...createHeadingNavProps(child, node, sectionIndex, document)}
				/>
				{#each SummaryRenderers as { summaryChild, summaryIndex, Renderer }}
					<Renderer
						path={[...path, 'children', sectionIndex, 'summary', summaryIndex]}
						{refs}
						{onUnmount}
						{...createSummaryNavProps(child, node, summaryChild.id, sectionIndex, document)}
					/>
				{/each}
			</div>
		{/each}

		<button onclick={() => {
            onUnmount()

            addSection(node, node.children[0].heading.level)}}>Add Section</button>
	</div>
</div>

<style lang="postcss">
	.card-container {
		position: relative;
	}
	.card {
		flex: 0 0 calc((99.9% - (var(--perRow) - 1) * var(--gap)) / var(--perRow));
	}
	.container {
		gap: var(--gap);
	}
</style>
