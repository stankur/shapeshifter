<script lang="ts">
	import TableOfContentsChild from './TableOfContentsChild.svelte';
	import { sectionContainer } from '$lib/model/collection';
	import type { ContentHeading } from '$lib/model/content';
	import { registry } from '$lib/viewRegistry.svelte';
	import { type Component } from 'svelte';
	import { z } from 'zod';
	import type { Refs } from '$lib/components/Document.svelte';
	import Controls from './Controls.svelte';
	import { getContext } from 'svelte';
	import type { Document } from '$lib/model/document';

	const document = getContext('document') as Document;

	let {
		node,
		refs,
		onUnmount
	}: {
		node: z.infer<typeof sectionContainer>;
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

	let directions = $derived(
		(
			view.find((v) => v.type === activeView) as {
				state: {
					directions: {
						type: string;
						perRow?: number;
						gap?: number;
						interGenerationGap: number;
						innerGap: number;
						innerDirection: string;
					}[];
				};
			}
		).state.directions
	);
	let childrenDirections = $derived(directions.slice(1));
	let isTableHovered = $state(false);

	function showTableControls() {
		isTableHovered = true;
	}

	function hideTableControls() {
		isTableHovered = false;
	}

	// Calculate CSS properties for row layout
	let currentDirection = $derived(directions[0]);

</script>

{#if document.state.mode === 'customize'}
	<Controls {directions} {node} {onUnmount} {isTableHovered}/>
{/if}
<div
	class="container flex flex-wrap"
	style="flex-direction: {currentDirection.type}; {currentDirection.type === 'row'
		? `--perRow: ${currentDirection.perRow || 1};`
		: `--gap: ${currentDirection.gap || 0}px;`}"
	onmouseenter={showTableControls}
	onmouseleave={hideTableControls}
>
	{#each ChildrenRenderers as { child, HeadingRenderer, SummaryRenderers }}
		<div
			class="item flex flex-col"
			style:--interGenerationGap={`${currentDirection.interGenerationGap}px`}
		>
			<div
				class={['toc-parent flex', currentDirection.innerDirection === 'column' ? 'flex-col' : '']}
				style:--innerGap={`${currentDirection.innerGap}px`}
			>
				<HeadingRenderer node={child.heading} {refs} {onUnmount} />
				<div class="flex flex-col">
					{#each SummaryRenderers as { summaryChild, Renderer }}
						<Renderer node={summaryChild} {refs} {onUnmount} />
					{/each}
				</div>
			</div>
			{#if child.children.length === 1 && child.children[0].type === 'section-container' && directions.length}
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

	.toc-parent {
		gap: var(--innerGap);
	}

	.item {
		flex: 0 0 calc(100% / var(--perRow));
		display: flex;
		gap: var(--interGenerationGap);
	}
</style>
