<script lang="ts">
	import { sectionContainer, type Section } from '$lib/model/collection';
	import type { ContentHeading } from '$lib/model/content';
	import { registry } from '$lib/viewRegistry.svelte';
	import { onDestroy, type Component } from 'svelte';
	import { z } from 'zod';
	import TableOfContentsChild from './TableOfContentsChild.svelte';
	import type { Refs } from '$lib/components/Document.svelte';
	import { registerRef } from '$lib/view/utils/registerRef.svelte';
	let {
		node,
		directions,
		refs,
		onUnmount
	}: {
		node: z.infer<typeof sectionContainer>;
		directions: { type: string; perRow?: number; gap?: number, interGenerationGap?: number, innerGap?: number, innerDirection?: string }[];
		refs: Refs;
		onUnmount: () => void;
	} = $props();
	let { children } = $derived(node);

	let ChildrenRenderers = $derived(
		children.map((child) => ({
			child,
			HeadingRenderer: registry[
				child.heading.activeView as keyof typeof registry
			] as unknown as Component<{
				node: ContentHeading;
				refs: Refs;
				onUnmount: () => void;
			}>,
			SummaryRenderers: child.summary.map((summaryChild: any) => ({
				summaryChild,
				Renderer: registry[summaryChild.activeView as keyof typeof registry] as Component<{
					node: typeof summaryChild;
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

<!-- use:registerRef={{
		id: getTOCChildContainerId(node),
		refs,
		animateOptions: {
			animateAbsolute: false,
			animateNested: false
		}
	}} -->

<div
	class="container flex flex-wrap"
	style="flex-direction: {currentDirection.type}; {currentDirection.type === 'row'
		? `--perRow: ${currentDirection.perRow || 1};`
		: ''}"
	data-flip-id={getTOCChildContainerId(node)}
	style:--gap={`${currentDirection.gap || 0}px`}
>
	<!-- use:registerRef={{
				id: getTOCChildId(child),
				refs,
				animateOptions: {
					animateAbsolute: false,
					animateNested: false
				}
			}} -->

	{#each ChildrenRenderers as { child, HeadingRenderer, SummaryRenderers }}
		<div
			class="item flex-col {currentDirection.type === 'row' ? 'row-item' : 'flex'}"
			data-flip-id={getTOCChildId(child)}
			style:--interGenerationGap={`${currentDirection.interGenerationGap || 0}px`}
			style:--innerDirection={`${currentDirection.innerDirection || 'column'}`}
			style:--innerGap={`${currentDirection.innerGap || 0}px`}
		>
			<HeadingRenderer node={child.heading} {refs} {onUnmount} />
			{#each SummaryRenderers as { summaryChild, Renderer }}
				<Renderer node={summaryChild} {refs} {onUnmount} />
			{/each}
			{#if child.children.length === 1 && child.children[0].type === 'section-container' && childrenDirections.length}
				<TableOfContentsChild
					node={child.children[0]}
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
