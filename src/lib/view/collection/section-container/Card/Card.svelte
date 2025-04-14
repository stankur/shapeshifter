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
	import { addSection } from '$lib/actions/collection/section-container.svelte';
	import { createHeadingNavProps, createSummaryNavProps } from './navigation';
	import type { NavigationHandler } from '$lib/services/navigation/types';
	import type { DocumentManipulator } from '$lib/documentManipulator.svelte';
	import Chip from '$lib/components/Chip.svelte';
	import Default from '../Default/Default.svelte';

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

	let someHasImage = $derived(children.some((child) => child.image));

	let gap = $derived(
		(view.find((v) => v.type === activeView) as { state: SectionContainerViewState }).state.gap
	);

	// Minimum width for cards
	const minCardWidth = 250;

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

		<div class="card-grid" style:--gap={`${gap}px`} style:--min-card-width={`${minCardWidth}px`}>
			{#each SectionRenderers as { child, sectionIndex, HeadingRenderer, SummaryRenderers }}
				<div class="card flex flex-col gap-6 border-1 border-gray-400 p-5">
					{#if child.image}
						<img class="aspect-square" src={child.image} alt="Section cover" />
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
				<Chip
					onclick={() => {
						onUnmount();
						addSection(node, node.children[0].heading.level);
					}}
					label="Add Section"
				/>
			{/if}
		</div>
	</div>
{/if}

<style lang="postcss">
	.card-container {
		position: relative;
	}

	.card-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(var(--min-card-width), 1fr));
		gap: var(--gap);
	}

	.card {
		min-width: var(--min-card-width);
	}
</style>
