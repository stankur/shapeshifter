<script lang="ts">
	import { sectionContainer, type Section } from '$lib/model/collection';
	import type { ContentHeading } from '$lib/model/content';
	import { registry } from '$lib/viewRegistry.svelte';
	import type { Component } from 'svelte';
	import type { z } from 'zod';
	import type { Refs } from '$lib/Document.svelte';
	import { getContext, onMount } from 'svelte';
	import type { Document } from '$lib/model/document';

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

	// Prepare renderer for the active section
	let activeIndex = $derived((node.view[viewStateIndex] as ViewState).state.activeIndex || 0);
	let gap = $derived((node.view[viewStateIndex] as ViewState).state.gap || 0);

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

	function switchToTableOfContents() {
		onUnmount();
		node.activeView = 'collection/section-container/table-of-contents';
	}

	// Simple overflow detection
	let tabsScroll: HTMLElement;
	let hasLeftOverflow = $state(false);
	let hasRightOverflow = $state(false);

	function checkOverflow() {
		if (!tabsScroll) return;

		hasLeftOverflow = tabsScroll.scrollLeft > 0;
		hasRightOverflow =
			tabsScroll.scrollWidth > tabsScroll.clientWidth &&
			tabsScroll.scrollLeft < tabsScroll.scrollWidth - tabsScroll.clientWidth;
	}

	function handleScroll() {
		checkOverflow();
	}

	// Use Svelte's effect to ensure state changes are detected
	$effect(() => {
		if (tabsScroll) {
			checkOverflow();
		}
	});

	onMount(() => {
		if (tabsScroll) {
			tabsScroll.addEventListener('scroll', handleScroll);
			window.addEventListener('resize', checkOverflow);
		}

		return () => {
			if (tabsScroll) {
				tabsScroll.removeEventListener('scroll', handleScroll);
			}
			window.removeEventListener('resize', checkOverflow);
		};
	});
</script>

<div class="container flex w-full flex-col">
	{#if document.state.mode === 'customize'}
		<div class="controls">
			<button class="rounded-md bg-blue-500 p-2 text-white" onclick={switchToTableOfContents}>
				Switch to TOC
			</button>
		</div>
	{/if}

	<!-- Tabs navigation -->
	<div class="tabs-container">
		<div class="tabs-scroll flex overflow-x-scroll" style:gap="{gap}px" bind:this={tabsScroll}>
			{#each ChildrenRenderers as { child, index, HeadingRenderer }}
				<div
					class="cursor-pointer p-2 whitespace-nowrap {index === activeIndex
						? 'border-b-2 border-blue-500'
						: ''}"
					onclick={() => setActiveSection(index)}
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
		{#if hasLeftOverflow}
			<div class="left-shadow overflow-shadow"></div>
		{/if}
		{#if hasRightOverflow}
			<div class="right-shadow overflow-shadow"></div>
		{/if}
	</div>

	<!-- Content -->
	{#key activeIndex}
		<div>
			<ActiveSectionRenderer node={node.children[activeIndex]} overRides={{ heading: false }} {refs} {onUnmount} />
		</div>
	{/key}
</div>

<style>
	.tabs-scroll {
		scrollbar-width: none;
	}
	.tabs-scroll::-webkit-scrollbar {
		display: none;
	}
	.tabs-container {
		position: relative;
	}
	.overflow-shadow {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 80px;
		pointer-events: none;
		z-index: 1;
	}
	.left-shadow {
		left: 0;
		background: linear-gradient(to right, white, transparent);
	}
	.right-shadow {
		right: 0;
		background: linear-gradient(to left, white, transparent);
	}
</style>
