<script lang="ts">
	import { sectionContainer, type Section } from '$lib/model/collection';
	import type { ContentHeading } from '$lib/model/content';
	import { registry } from '$lib/viewRegistry.svelte';
	import { onDestroy, type Component, getContext } from 'svelte';
	import { z } from 'zod';
	import TableOfContentsChild from './TableOfContentsChild.svelte';
	import type { Refs } from '$lib/components/Document.svelte';
	import type { DocumentManipulator } from '$lib/documentManipulator.svelte';
	
	let {
		path,
		directions,
		refs,
		onUnmount
	}: {
		path: (string | number)[];
		directions: { type: string; perRow?: number; gap?: number, interGenerationGap?: number, innerGap?: number, innerDirection?: string }[];
		refs: Refs;
		onUnmount: () => void;
	} = $props();
	
	const documentManipulator = getContext('documentManipulator') as DocumentManipulator;
	const node = documentManipulator.getByPath(path) as z.infer<typeof sectionContainer>;
	let { children } = $derived(node);

	let ChildrenRenderers = $derived(
		children.map((child, childIndex) => ({
			child,
			childIndex,
			HeadingRenderer: registry[
				child.heading.activeView as keyof typeof registry
			] as unknown as Component<{
				path: (string | number)[];
				refs: Refs;
				onUnmount: () => void;
			}>,
			SummaryRenderers: child.summary.map((summaryChild: any, summaryIndex: number) => ({
				summaryChild,
				summaryIndex,
				Renderer: registry[summaryChild.activeView as keyof typeof registry] as Component<{
					path: (string | number)[];
					refs: Refs;
					onUnmount: () => void;
				}>
			}))
		}))
	);

	let childrenDirections = $derived(directions.slice(1));
	let currentDirection = $derived(directions[0]);

	let getTOCChildContainerId = (child: z.infer<typeof sectionContainer>) => {
		return `${child.id}-${node.activeView}-toc-child-container`;
	};
	let getTOCChildId = (child: Section) => {
		return `${child.id}-${node.activeView}-toc-child`;
	};
</script>


<div
	class="container flex flex-wrap"
	style="flex-direction: {currentDirection.type}; {currentDirection.type === 'row'
		? `--perRow: ${currentDirection.perRow || 1};`
		: ''}"
	data-flip-id={getTOCChildContainerId(node)}
	style:--gap={`${currentDirection.gap || 0}px`}
>

	{#each ChildrenRenderers as { child, childIndex, HeadingRenderer, SummaryRenderers }}
		<div
			class="item flex-col {currentDirection.type === 'row' ? 'row-item' : 'flex'}"
			data-flip-id={getTOCChildId(child)}
			style:--interGenerationGap={`${currentDirection.interGenerationGap || 0}px`}
			style:--innerDirection={`${currentDirection.innerDirection || 'column'}`}
			style:--innerGap={`${currentDirection.innerGap || 0}px`}
		>
			<HeadingRenderer path={[...path, 'children', childIndex, 'heading']} {refs} {onUnmount} />
			{#each SummaryRenderers as { summaryChild, summaryIndex, Renderer }}
				<Renderer path={[...path, 'children', childIndex, 'summary', summaryIndex]} {refs} {onUnmount} />
			{/each}
			{#if child.children.length === 1 && child.children[0].type === 'section-container' && childrenDirections.length}
				<TableOfContentsChild
					path={[...path, 'children', childIndex, 'children', 0]}
					directions={childrenDirections}
					{refs}
					{onUnmount}
				/>
			{/if}
		</div>
	{/each}
</div>

<style lang="postcss">
	.container {
		gap: var(--gap);
	}

    .item {
        flex-direction: var(--innerDirection);
        gap: var(--innerGap);
    }
    
	.row-item {
		flex: 0 0 calc(100% / var(--perRow));
		display: flex;
	}
</style>
