<script lang="ts">
	import {
		sectionContainer,
		sectionContainerCardViewState,
		type Section
	} from '$lib/model/collection';
	import type { ContentHeading } from '$lib/model/content';
	import { registry } from '$lib/viewRegistry.svelte';
	import type { Component } from 'svelte';
	import type { z } from 'zod';
	import type { Refs } from '$lib/Document.svelte';
	import { getContext } from 'svelte';
	import type { Document } from '$lib/model/document';
	import Controls from './Controls.svelte';
	import { addSection } from '$lib/actions/collection.svelte';

	const document = getContext('document') as Document;

	type SectionContainer = z.infer<typeof sectionContainer>;
	type SectionContainerViewState = z.infer<typeof sectionContainerCardViewState>;

	let {
		node,
		refs,
		onUnmount
	}: {
		node: SectionContainer;
		refs: Refs;
		onUnmount: () => void;
	} = $props();
	let { children, view, activeView } = $derived(node);

	let ChildrenRenderers = $derived(
		children.map((child) => ({
			child,
			HeadingRenderer: registry[
				child.heading.activeView as keyof typeof registry
			] as unknown as Component<{
				node: ContentHeading;
				refs: Refs;
			}>,
			SummaryRenderers: child.summary.map((summaryChild) => ({
				summaryChild,
				Renderer: registry[summaryChild.activeView as keyof typeof registry] as Component<{
					node: typeof summaryChild;
					refs: Record<
						string,
						{ element: HTMLElement; animateAbsolute: boolean; animateNested: boolean }
					>;
					onUnmount: () => void;
				}>
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
		<Controls {node} {onUnmount} {isCardHovered} />
	{/if}

	<div class="container flex flex-wrap" style:--perRow={perRow} style:--gap={`${gap}px`}>
		{#each ChildrenRenderers as { child, HeadingRenderer, SummaryRenderers }}
			<div class="card border-1 border-black p-5">
				<HeadingRenderer node={child.heading} {refs} />
				{#each SummaryRenderers as { summaryChild, Renderer }}
					<Renderer node={summaryChild} {refs} {onUnmount} />
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
