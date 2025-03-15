<script lang="ts">
	import type { Refs } from '$lib/Document.svelte';
	import type { Section } from '$lib/model/collection';
	import type { ContentHeading, ContentParagraph } from '$lib/model/content';
	import type { Document } from '$lib/model/document';
	import { float } from '$lib/view/utils/float.svelte';
	import { registry } from '$lib/viewRegistry.svelte';
	import { getContext, onMount, type Component } from 'svelte';
	import DefaultControl from './control/DefaultControl.svelte';
	import { splitParagraph } from '$lib/actions/collection.svelte';

	type Props = {
		node: Section;
		refs: Refs;
		onUnmount: () => void;
		overRides: { heading: boolean };
	};
	type ViewState = { state: 'expanded' | 'summary' | 'collapsed' };
	let { node = $bindable<Section>(), refs, onUnmount, overRides = { heading: true } }: Props = $props();

	let document = getContext('document') as Document;

	let { activeView, view } = $derived(node);
	let HeadingRenderer = $derived(
		registry[node.heading.activeView as keyof typeof registry] as unknown as Component<{
			node: ContentHeading;
			refs: Refs;
			onUnmount: () => void;
		}>
	);
	let ChildrenRenderers = $derived(
		node.children.map((child) => ({
			Renderer: registry[child.activeView as keyof typeof registry] as Component<{
				node: typeof child;
				refs: Refs;
				onUnmount: () => void;
				onSplit: (newBlocks: [string, string]) => void;
			}>
		}))
	);
	let SummaryRenderers = $derived(
		node.summary.map((child) => ({
			Renderer: registry[child.activeView as keyof typeof registry] as Component<{
				node: typeof child;
				refs: Refs;
				onUnmount: () => void;
				onSplit: (newBlocks: [string, string]) => void;
			}>
		}))
	);

	let viewStateIndex = $derived(view.findIndex((v) => v.type === activeView));

	let headingElement: HTMLDivElement | null = $state(null);
	let contentElement: HTMLDivElement | null = $state(null);
	let controlElement: HTMLDivElement | null = $state(null);
	let containerElement: HTMLDivElement | null = $state(null);

	$inspect(node);
	$inspect(node.summary);
	$inspect(node.heading);

	onMount(() => {
		if (containerElement && controlElement) {
			containerElement.style.paddingLeft = `${controlElement.clientWidth}px`;

			// Determine which element to use as reference for the floating control
			const referenceElement = overRides?.heading ? headingElement : contentElement;
			// Use 'left' for heading, 'left-start' for content
			const placement = overRides?.heading ? 'left' : 'left-start';

			if (referenceElement) {
				return float(referenceElement as HTMLElement, controlElement as HTMLElement, placement)();
			}
		}
	});
</script>

<!-- as { state: 'expanded' | 'summary' | 'collapsed' } -->
<DefaultControl
	bind:controlElement={controlElement as HTMLDivElement}
	viewState={node.view[viewStateIndex] as ViewState}
	{onUnmount}
/>

<div class="container flex flex-col" bind:this={containerElement}>
	{#if overRides && overRides.heading}
		{#key node.heading.id}
			<div bind:this={headingElement}>
				<HeadingRenderer bind:node={node.heading} {refs} {onUnmount} />
			</div>
		{/key}
	{/if}

	<div bind:this={contentElement}>
		{#if (node.view[viewStateIndex] as ViewState).state === 'expanded'}
			<!-- should work without the key, but not working -->
			{#each ChildrenRenderers as { Renderer }, i (node.children[i].last_modified + node.children[i].id)}
				{console.log(i)}
				{console.log(node.children[i])}
				<Renderer
					bind:node={node.children[i]}
					onSplit={(newBlocks) => {
						console.log('newBlocks');
						console.log(newBlocks);
						splitParagraph(node, 'children', newBlocks, document, i);
					}}
					{refs}
					{onUnmount}
				/>
			{/each}
		{:else if (node.view[viewStateIndex] as ViewState).state === 'summary'}
			{#each SummaryRenderers as { Renderer }, i (node.summary[i].last_modified + node.summary[i].id)}
				{console.log(i)}
				{console.log((node.summary[i] as ContentParagraph).content)}
				<Renderer
					bind:node={node.summary[i]}
					{refs}
					onSplit={(newBlocks) => {
						splitParagraph(node, 'summary', newBlocks, document, i);
					}}
					{onUnmount}
				/>
			{/each}
		{/if}
	</div>
</div>
