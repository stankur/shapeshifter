<script lang="ts">
	import type { Refs } from '$lib/components/Document.svelte';
	import type { Section, SectionContainer } from '$lib/model/collection';
	import type { ContentHeading, ContentParagraph } from '$lib/model/content';
	import type { Document } from '$lib/model/document';
	import { float } from '$lib/view/utils/float.svelte';
	import { registry } from '$lib/viewRegistry.svelte';
	import { getContext, onMount, type Component } from 'svelte';
	import {
		handleHeadingLevelIncrease,
		handleHeadingLevelDecrease,
		splitParagraph,
		splitSection,
		handleEnterInHeading,
		joinWithPreviousParagraph
	} from '$lib/actions/collection/section.svelte';
	import Write from '$lib/view/collection/section-container/Write.svelte';
	import type { DocumentManipulator } from '$lib/documentManipulator.svelte';
	import SummaryContainer from './SummaryContainer.svelte';

	type Props = {
		path: (string | number)[];
		refs: Refs;
		onUnmount: () => void;
		overrides?: { heading?: boolean; accommodateControls?: boolean };
		addSection?: (newSection: Section) => void;
		findPrecedingSection?: (level: number) => Section | null;
		findParentSection?: () => Section | null;
		findParentSectionContainer?: () => SectionContainer | null;
		removeSectionFromContainer?: () => void;
	};
	let {
		path,
		refs,
		onUnmount,
		overrides = {},
		addSection = () => {},
		findPrecedingSection = () => null,
		findParentSection = () => null,
		findParentSectionContainer = () => null,
		removeSectionFromContainer = () => {}
	}: Props = $props();

    const writerContext = getContext('writerContext') as {showSummary: boolean};
	const defaultOverRides = { heading: true, accommodateControls: false };
	overrides = { ...defaultOverRides, ...overrides };

	let document = getContext('document') as Document;
	const documentManipulator = getContext('documentManipulator') as DocumentManipulator;
	const node = documentManipulator.getByPath(path) as Section;

	let HeadingRenderer = $derived(
		registry[node.heading.activeView as keyof typeof registry] as unknown as Component<{
			path: (string | number)[];
			refs: Refs;
			onUnmount: () => void;
			onLevelIncrease: () => boolean;
			onLevelDecrease: () => boolean;
			onEnterAtEnd: () => boolean;
		}>
	);
	let ChildrenRenderers = $derived(
		node.children.map((child) => ({
			Renderer: registry[child.activeView as keyof typeof registry] as Component<{
				path: (string | number)[];
				refs: Refs;
				onUnmount: () => void;
				onSplit: (newBlocks: [string, string]) => void;
				onJoinWithPrevious?: () => boolean;
				onConvertToHeading?: (paragraphId: string) => void;
			}>
		}))
	);
	let SummaryRenderers = $derived(
		node.summary.map((child) => ({
			Renderer: registry[child.activeView as keyof typeof registry] as Component<{
				path: (string | number)[];
				refs: Refs;
				onUnmount: () => void;
				onSplit: (newBlocks: [string, string]) => void;
				onJoinWithPrevious?: () => boolean;
			}>
		}))
	);
</script>

<div class="container flex flex-col gap-7">
	{#if (overrides.heading !== undefined && overrides.heading) || defaultOverRides.heading}
		{#key node.heading.id}
			<HeadingRenderer
				path={[...path, 'heading']}
				{refs}
				{onUnmount}
				onLevelIncrease={() => {
					console.log('onLevelIncrease in section');
					return handleHeadingLevelIncrease(node, findPrecedingSection, removeSectionFromContainer);
				}}
				onLevelDecrease={() => {
					console.log('onLevelDecrease in section');
					return handleHeadingLevelDecrease(
						node, 
						findParentSectionContainer, 
						findParentSection, 
						removeSectionFromContainer,
						() => {
							// Find the grandparent section container
							// This is the container that contains the parent section
							const parentSection = findParentSection();
							if (!parentSection) return null;
							
							// Get the path to the parent section's container
							// This would be the grandparent container for the current section
							const parentSectionContainer = findParentSectionContainer();
							if (!parentSectionContainer) return null;
							
							// Find the container that contains the parent section container
							// This is done by looking at the parent section's parent
							// We assume every section is in a container
							return documentManipulator.getByPath([...path.slice(0, -6)]) as SectionContainer;
						}
					);
				}}
				onEnterAtEnd={() => {
					console.log('onEnterAtEnd in section');
					return handleEnterInHeading(node, document);
				}}
			/>
		{/key}
	{/if}

	<div class="flex flex-col gap-7">
		{#if writerContext.showSummary}
			<SummaryContainer>
				{#each SummaryRenderers as { Renderer }, i (node.summary[i].last_modified + node.summary[i].id)}
					{console.log(i)}
					{console.log((node.summary[i] as ContentParagraph).content)}
					<Renderer
						path={[...path, 'summary', i]}
						{refs}
						onSplit={(newBlocks) => {
							splitParagraph(node, 'summary', newBlocks, document, i);
						}}
						onJoinWithPrevious={() => {
							if (i === 0) return false; // First paragraph can't join with previous
							
							// Get the previous block ID
							const prevId = node.summary[i-1].id;
							
							// Join with previous paragraph
							return joinWithPreviousParagraph(
								node,
								'summary',
								i,
								document,
								prevId
							);
						}}
						{onUnmount}
					/>
				{/each}
			</SummaryContainer>
		{/if}
		<div>
			{#each ChildrenRenderers as { Renderer }, i (node.children[i].last_modified + node.children[i].id)}
				{#if node.children[i].type === 'section-container'}
					<div class="mt-5">
						<Write path={[...path, 'children', i]} {refs} {onUnmount} />
					</div>
				{:else}
					<Renderer
						path={[...path, 'children', i]}
						onSplit={(newBlocks) => {
							console.log('newBlocks');
							console.log(newBlocks);
							splitParagraph(node, 'children', newBlocks, document, i);
						}}
						onJoinWithPrevious={() => {
							if (i === 0) return false; // First paragraph can't join with previous
							
							// Get the previous block ID
							const prevId = node.children[i-1].id;
							if (!prevId) return false;
							
							// Join with previous paragraph
							return joinWithPreviousParagraph(
								node,
								'children',
								i,
								document,
								prevId
							);
						}}
						onConvertToHeading={(paragraphId) => {
							splitSection(node, paragraphId, document, addSection);
						}}
						{refs}
						{onUnmount}
					/>
				{/if}
			{/each}
		</div>
	</div>
</div>
