<script lang="ts">
	import { sectionContainer, type Section } from '$lib/model/collection';
	import type { ContentHeading } from '$lib/model/content';
	import { registry } from '$lib/viewRegistry.svelte';
	import type { Component } from 'svelte';
	import type { z } from 'zod';
	import type { Refs } from '$lib/Document.svelte';
	import { getContext } from 'svelte';
	import type { Document } from '$lib/model/document';

	const document = getContext('document') as Document;

	type SectionContainer = z.infer<typeof sectionContainer>;
	type TabsState = { gap: number; activeIndex: number };

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

	// Find the tabs view state or create a default one
	function getTabsState(): TabsState {
		const activeViewObj = view.find((v) => v.type === activeView);
		if (activeViewObj && 'state' in activeViewObj) {
			const state = activeViewObj.state as any;
			return {
				gap: state.gap !== undefined ? state.gap : 0,
				activeIndex: state.activeIndex !== undefined ? state.activeIndex : 0
			};
		}
		return { gap: 0, activeIndex: 0 };
	}

	let tabsState = $derived(getTabsState());

	let ChildrenRenderers = $derived(
		children.map((child, index) => ({
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

	// Prepare renderer for the active section
	let activeIndex = $derived(tabsState.activeIndex || 0);
	let ActiveSectionRenderer = $derived(
		registry[children[activeIndex].activeView as keyof typeof registry] as Component<{
			node: Section;
			refs: Refs;
			onUnmount: () => void;
		}>
	);

	// Function to change the active section
	function setActiveSection(index: number) {
		onUnmount();
		// Update the activeIndex in the state
		const activeViewObj = view.find((v) => v.type === activeView);
		if (activeViewObj && 'state' in activeViewObj) {
			(activeViewObj.state as any).activeIndex = index;
		}
	}

	function switchToTableOfContents() {
		onUnmount();
		node.activeView = 'collection/section-container/table-of-contents';
	}
</script>

<div class="container flex w-full flex-col">
	{#if document.state.mode === 'customize'}
		<div class="controls">
			<button class="rounded-md bg-blue-500 p-2 text-white" on:click={switchToTableOfContents}>
				Switch to TOC
			</button>
		</div>
	{/if}

	<!-- Tabs navigation -->
	<div class="tabs-nav flex overflow-x-auto" style:gap="{tabsState.gap}px">
		{#each ChildrenRenderers as { child, index, HeadingRenderer }}
			<div
				class="tab-item cursor-pointer p-2 whitespace-nowrap {index === activeIndex
					? 'border-b-2 border-blue-500'
					: ''}"
				on:click={() => setActiveSection(index)}
			>
				<HeadingRenderer
					node={child.heading}
					additionalFlipId={'tab-item-' + index}
					{refs}
					{onUnmount}
				/>
			</div>
		{/each}
	</div>

	<!-- Content -->
	<div class="content mt-4">
		<ActiveSectionRenderer node={children[activeIndex]} {refs} {onUnmount} />
	</div>
</div>

<style>
	.tabs-nav::-webkit-scrollbar {
		height: 4px;
	}

	.tabs-nav::-webkit-scrollbar-track {
		background: #f1f1f1;
	}

	.tabs-nav::-webkit-scrollbar-thumb {
		background: #888;
		border-radius: 4px;
	}

	.tabs-nav::-webkit-scrollbar-thumb:hover {
		background: #555;
	}
</style>
