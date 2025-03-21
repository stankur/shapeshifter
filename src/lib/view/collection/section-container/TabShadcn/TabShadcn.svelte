<script lang="ts">
	import { sectionContainer, type Section } from '$lib/model/collection';
	import type { ContentHeading } from '$lib/model/content';
	import { registry } from '$lib/viewRegistry.svelte';
	import type { Component } from 'svelte';
	import type { z } from 'zod';
	import type { Refs } from '$lib/components/Document.svelte';
	import { getContext } from 'svelte';
	import type { Document } from '$lib/model/document';
	import Controls from './Controls.svelte';
	// Import ShadCN Tabs components
	import { Tabs, TabsList, TabsTrigger, TabsContent } from '$lib/components/ui/tabs';

	const document = getContext('document') as Document;

	type SectionContainer = z.infer<typeof sectionContainer>;
	type ViewState = { state: { gap: number; activeIndex: number } };

	type Props = {
		node: SectionContainer;
		refs: Refs;
		onUnmount: () => void;
	};

	let { node = $bindable(), refs, onUnmount }: Props = $props();
	let { view, activeView } = $derived(node);

	let viewStateIndex = $derived(view.findIndex((v) => v.type === activeView));

	let ChildrenRenderers = $derived(
		node.children.map((child, index) => ({
			child,
			index,
			HeadingRenderer: registry[
				child.heading.activeView as keyof typeof registry
			] as unknown as Component<{
				node: ContentHeading;
				refs: Refs;
				additionalFlipId?: string;
				onUnmount: () => void;
			}>
		}))
	);

	// Get the active index from the view state
	let activeIndex = $derived((node.view[viewStateIndex] as ViewState).state.activeIndex || 0);
	
	// Prepare renderer for the active section
	let ActiveSectionRenderer = $derived(
		registry[node.children[activeIndex].activeView as keyof typeof registry] as Component<{
			node: Section;
			refs: Refs;
			onUnmount: () => void;
			overRides?: { heading: boolean };
		}>
	);

	// Function to change the active section
	function setActiveSection(index: number) {
		onUnmount();
		// Update the activeIndex in the state
		(node.view[viewStateIndex] as ViewState).state.activeIndex = index;
	}
	
	// State for hover controls
	let isTabsHovered = $state(false);

	function showTabsControls() {
		isTabsHovered = true;
	}

	function hideTabsControls() {
		isTabsHovered = false;
	}
</script>

<div 
	class="container flex w-full flex-col"
	onmouseenter={showTabsControls}
	onmouseleave={hideTabsControls}
>
	{#if document.state.mode === 'customize'}
		<Controls {node} {onUnmount} {isTabsHovered} />
	{/if}

	<!-- ShadCN Tabs -->
	<Tabs value="tab-{activeIndex}" class="w-full">
		<TabsList>
			{#each ChildrenRenderers as { child, index, HeadingRenderer }}
				<TabsTrigger 
					value="tab-{index}" 
					on:click={() => setActiveSection(index)}
				>
					<div class="cursor-pointer whitespace-nowrap">
						<HeadingRenderer
							node={child.heading}
							additionalFlipId={'tab-item-' + index}
							{refs}
							{onUnmount}
						/>
					</div>
				</TabsTrigger>
			{/each}
		</TabsList>
		
		<!-- Content -->
		<TabsContent value="tab-{activeIndex}">
			<div class="pt-5">
				<ActiveSectionRenderer
					node={node.children[activeIndex]}
					overRides={{ heading: false }}
					{refs}
					{onUnmount}
				/>
			</div>
		</TabsContent>
	</Tabs>
</div>
