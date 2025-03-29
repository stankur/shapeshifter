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
	import type { DocumentManipulator } from '$lib/documentManipulator.svelte';

	const document = getContext('document') as Document;
	const documentManipulator = getContext('documentManipulator') as DocumentManipulator;

	let {
		path,
		refs,
		onUnmount
	}: {
		path: (string | number)[];
		refs: Refs;
		onUnmount: () => void;
	} = $props();
	
	const node = documentManipulator.getByPath(path) as z.infer<typeof sectionContainer>;
	let { children, view, activeView } = $derived(node);

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
	<Controls {directions} path={path} {onUnmount} {isTableHovered}/>
{/if}
<div
	class="container flex flex-wrap"
	style="flex-direction: {currentDirection.type}; {currentDirection.type === 'row'
		? `--perRow: ${currentDirection.perRow || 1};`
		: `--gap: ${currentDirection.gap || 0}px;`}"
	onmouseenter={showTableControls}
	onmouseleave={hideTableControls}
>
	{#each ChildrenRenderers as { child, childIndex, HeadingRenderer, SummaryRenderers }}
		<div
			class="item flex flex-col"
			style:--interGenerationGap={`${currentDirection.interGenerationGap}px`}
		>
			<div
				class={['toc-parent flex', currentDirection.innerDirection === 'column' ? 'flex-col' : '']}
				style:--innerGap={`${currentDirection.innerGap}px`}
			>
				<HeadingRenderer path={[...path, 'children', childIndex, 'heading']} {refs} {onUnmount} />
				<div class="flex flex-col">
					{#each SummaryRenderers as { summaryChild, summaryIndex, Renderer }}
						<Renderer path={[...path, 'children', childIndex, 'summary', summaryIndex]} {refs} {onUnmount} />
					{/each}
				</div>
			</div>
			{#if child.children.length === 1 && child.children[0].type === 'section-container' && directions.length}
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

	.toc-parent {
		gap: var(--innerGap);
	}

	.item {
		flex: 0 0 calc(100% / var(--perRow));
		display: flex;
		gap: var(--interGenerationGap);
	}
</style>
