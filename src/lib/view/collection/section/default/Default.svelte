<script lang="ts">
	import type { Refs } from '$lib/components/Document.svelte';
	import type { Section } from '$lib/model/collection';
	import type { ContentHeading, ContentParagraph } from '$lib/model/content';
	import type { Document } from '$lib/model/document';
	import { float } from '$lib/view/utils/float.svelte';
	import { registry } from '$lib/viewRegistry.svelte';
	import { getContext, onMount, type Component } from 'svelte';
	import DefaultControl from './control/DefaultControl.svelte';
	import { splitParagraph, splitSection, handleHeadingLevelIncrease } from '$lib/actions/collection.svelte';

	type Props = {
		node: Section;
		refs: Refs;
		onUnmount: () => void;
		overRides: { heading: boolean };
		addSection: (newSection: Section) => void;
		findParentSection: (level: number) => Section | null;
		onSectionMoved: () => void;
	};
	type ViewState = { state: 'expanded' | 'summary' | 'collapsed' };
	let {
		node = $bindable<Section>(),
		refs,
		onUnmount,
		overRides = { heading: true },
		addSection,
		findParentSection,
		onSectionMoved
	}: Props = $props();

	let document = getContext('document') as Document;

	let { activeView, view } = $derived(node);
	let HeadingRenderer = $derived(
		registry[node.heading.activeView as keyof typeof registry] as unknown as Component<{
			node: ContentHeading;
			refs: Refs;
			onUnmount: () => void;
			onLevelIncrease: () => boolean;
		}>
	);
	let ChildrenRenderers = $derived(
		node.children.map((child) => ({
			Renderer: registry[child.activeView as keyof typeof registry] as Component<{
				node: typeof child;
				refs: Refs;
				onUnmount: () => void;
				onSplit: (newBlocks: [string, string]) => void;
				onConvertToHeading: (paragraphId: string) => void;
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

    $effect(() => {
        console.log("detected change in children of section: ", node.children);
    });


	onMount(() => {
		if (containerElement && controlElement) {
			containerElement.style.paddingLeft = `${controlElement.clientWidth}px`;

			// Determine which element to use as reference for the floating control
			const referenceElement = overRides?.heading ? headingElement : contentElement;
			// Use 'left' for heading, 'left-start' for content
			const placement = overRides?.heading ? 'left' : 'left-start';

			if (referenceElement) {
				return float(
					referenceElement as HTMLElement,
					controlElement as HTMLElement,
					placement,
					false
				)();
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

<div class="container flex flex-col gap-7" bind:this={containerElement}>
	{#if overRides && overRides.heading}
		{#key node.heading.id}
			<div bind:this={headingElement}>
				<HeadingRenderer 
					bind:node={node.heading} 
					{refs} 
					{onUnmount}
					onLevelIncrease={() => {
                        console.log("onLevelIncrease in section");
                        return handleHeadingLevelIncrease(node, findParentSection, onSectionMoved)}} 
				/>
			</div>
		{/key}
	{/if}

	<div bind:this={contentElement} class="flex flex-col gap-7">
		{#if (node.view[viewStateIndex] as ViewState).state === 'expanded'}
			<!-- should work without the key, but not working -->
			{#each ChildrenRenderers as { Renderer }, i (node.children[i].last_modified + node.children[i].id)}
            <div class={node.children[i].type === 'section-container' ? 'mt-5' : ''}>
				<Renderer
					bind:node={node.children[i]}
					onSplit={(newBlocks) => {
						console.log('newBlocks');
						console.log(newBlocks);
						splitParagraph(node, 'children', newBlocks, document, i);
					}}
					onConvertToHeading={(paragraphId) => {
						splitSection(node, paragraphId, addSection);
					}}
					{refs}
					{onUnmount}
				/>
            </div>
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
