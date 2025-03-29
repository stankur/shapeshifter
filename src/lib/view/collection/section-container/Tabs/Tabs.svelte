<script lang="ts">
	import { sectionContainer, type Section } from '$lib/model/collection';
	import type { ContentHeading } from '$lib/model/content';
	import { registry } from '$lib/viewRegistry.svelte';
	import type { Component } from 'svelte';
	import type { z } from 'zod';
	import type { Refs } from '$lib/components/Document.svelte';
	import { getContext, onMount } from 'svelte';
	import type { Document } from '$lib/model/document';
	import Controls from './Controls.svelte';
	import type { DocumentManipulator } from '$lib/documentManipulator.svelte';

	const document = getContext('document') as Document;
	const documentManipulator = getContext('documentManipulator') as DocumentManipulator;

	type SectionContainer = z.infer<typeof sectionContainer>;
	type ViewState = { state: { gap: number; activeIndex: number } };

	type Props = {
		path: (string | number)[];
		refs: Refs;
		onUnmount: () => void;
	};

	let { path, refs, onUnmount }: Props = $props();
	const node = documentManipulator.getByPath(path) as SectionContainer;
	let { view, activeView } = $derived(node);

	let viewStateIndex = $derived(view.findIndex((v) => v.type === activeView));

	let ChildrenRenderers = $derived(
		node.children.map((child, index) => ({
			index,
			HeadingRenderer: registry[
				child.heading.activeView as keyof typeof registry
			] as unknown as Component<{
				path: (string | number)[];
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
			path: (string | number)[];
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

	// Simple overflow detection
	let tabsScroll: HTMLElement;
	let hasLeftOverflow = $state(false);
	let hasRightOverflow = $state(false);
	let isTabsHovered = $state(false);

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

	function showTabsControls() {
		isTabsHovered = true;
	}

	function hideTabsControls() {
		isTabsHovered = false;
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

<div
	class="container flex w-full flex-col"
	onmouseenter={showTabsControls}
	onmouseleave={hideTabsControls}
>
	{#if document.state.mode === 'customize'}
		<Controls path={path} {onUnmount} {isTabsHovered} />
	{/if}

	<!-- Tabs navigation -->
	<div class="tabs-container">
		<div class="tabs-scroll flex overflow-x-scroll" style:gap="{gap}px" bind:this={tabsScroll}>
			{#each ChildrenRenderers as {  index, HeadingRenderer }}
				<div
					class="cursor-pointer p-5 whitespace-nowrap {index === activeIndex
						? 'border-b-2 border-black'
						: ''}"
					onclick={() => setActiveSection(index)}
				>
					<HeadingRenderer
						path={[...path, 'children', index, 'heading']}
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
		<div class="pt-5">
			<ActiveSectionRenderer
				path={[...path, 'children', activeIndex]}
				overRides={{ heading: false }}
				{refs}
				{onUnmount}
			/>
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
