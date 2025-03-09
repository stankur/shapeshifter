<script lang="ts">
	import type { Refs } from '$lib/Document.svelte';
	import type { Section } from '$lib/model/collection';
	import type { ContentHeading } from '$lib/model/content';
	import { registerRef } from '$lib/view/utils/registerRef.svelte';
	import { registry } from '$lib/viewRegistry.svelte';
	import { type Component } from 'svelte';

	let { node, refs, onUnmount }: { node: Section; refs: Refs; onUnmount: () => void } = $props();
	let { heading, children, summary, activeView, view } = $derived(node);
	let HeadingRenderer = $derived(
		registry[heading.activeView as keyof typeof registry] as unknown as Component<{
			node: ContentHeading;
			refs: Refs;
			onUnmount: () => void;
		}>
	);
	let ChildrenRenderers = $derived(
		children.map((child) => ({
			child,
			Renderer: registry[child.activeView as keyof typeof registry] as Component<{
				node: typeof child;
				refs: Refs;
				onUnmount: () => void;
			}>
		}))
	);
	let SummaryRenderers = $derived(
		summary.map((child) => ({
			child,
			Renderer: registry[child.activeView as keyof typeof registry] as Component<{
				node: typeof child;
				refs: Refs;
				onUnmount: () => void;
			}>
		}))
	);

	let state = $derived(
		(view.find((v) => v.type === activeView) as { state: 'expanded' | 'summary' | 'collapsed' })
			.state
	);

	let getSectionId = (child: Section) => {
		return `${child.id}-${node.activeView}-section`;
	};


</script>
<!-- data-flip-id={getSectionId(node)} use:registerRef={{
		id: getSectionId(node),
		refs,
		animateOptions: {
			animateAbsolute: false,
			animateNested: true
		}
	}} -->
<div class="flex flex-col" >
	<HeadingRenderer node={heading} {refs} {onUnmount} />
	{#if state === 'expanded'}
		{#each ChildrenRenderers as { child, Renderer }}
			<Renderer node={child} {refs} {onUnmount} />
		{/each}
	{:else if state === 'summary'}
		{#each SummaryRenderers as { child, Renderer }}
			<Renderer node={child} {refs} {onUnmount} />
		{/each}
	{/if}
</div>
