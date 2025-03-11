<script lang="ts">
	import type { Refs } from '$lib/Document.svelte';
	import type { Section } from '$lib/model/collection';
	import type { ContentHeading } from '$lib/model/content';
	import { float } from '$lib/view/utils/float.svelte';
	import { registry } from '$lib/viewRegistry.svelte';
	import { onMount, type Component } from 'svelte';
	import DefaultControl from './control/DefaultControl.svelte';

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

	let viewState = $derived(
		view.find((v) => v.type === activeView) as { state: 'expanded' | 'summary' | 'collapsed' }
	);

	let headingElement: HTMLDivElement;
	let controlElement: HTMLDivElement | null = $state(null);
    let containerElement: HTMLDivElement;

    onMount(() => {
        containerElement.style.paddingLeft = `${controlElement?.clientWidth}px`
        return float(headingElement, controlElement as HTMLElement, "left")();
    })
</script>

<DefaultControl bind:controlElement={controlElement as HTMLDivElement} viewState={viewState} onUnmount={onUnmount} />

<div class="flex flex-col container" bind:this={containerElement}>
	<div bind:this={headingElement}>
		<HeadingRenderer node={heading} {refs} {onUnmount} />
	</div>
	{#if viewState.state === 'expanded'}
		{#each ChildrenRenderers as { child, Renderer }}
			<Renderer node={child} {refs} {onUnmount} />
		{/each}
	{:else if viewState.state === 'summary'}
		{#each SummaryRenderers as { child, Renderer }}
			<Renderer node={child} {refs} {onUnmount} />
		{/each}
	{/if}
</div>
