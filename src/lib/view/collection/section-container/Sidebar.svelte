<script lang="ts">
	import { sectionContainer, type Section } from '$lib/model/collection';
	import type { ContentHeading } from '$lib/model/content';
	import { registry } from '$lib/viewRegistry.svelte';
	import type { Component } from 'svelte';
	import type { z } from 'zod';
	import type { Refs } from '$lib/components/Document.svelte';
	import { getContext } from 'svelte';
	import type { DocumentManipulator } from '$lib/documentManipulator.svelte';
	import type { Document } from '$lib/model/document';
	import Chip from '$lib/components/Chip.svelte';
	import { onMount } from 'svelte';
	type SectionContainer = z.infer<typeof sectionContainer>;

	let {
		path,
		refs,
		onUnmount
	}: {
		path: (string | number)[];
		refs: Refs;
		onUnmount: () => void;
	} = $props();

	const document = getContext('document') as Document;
	const documentManipulator = getContext('documentManipulator') as DocumentManipulator;
	const node = documentManipulator.getByPath(path) as SectionContainer;
	let { children, view, activeView } = $derived(node);

	let sidebarState = $derived(
		(
			view.find((v) => v.type === activeView) as {
				state: { percentageWidth: number; activeIndex: number };
			}
		).state
	);

	let ChildrenRenderers = $derived(
		children.map((child, index) => ({
			child,
			index,
			HeadingRenderer: registry[
				child.heading.activeView as keyof typeof registry
			] as unknown as Component<{
				path: (string | number)[];
				refs: Refs;
				additionalFlipId?: string;
				onUnmount: () => void;
				overrides?: { class?: string };
			}>,
			SummaryRenderers: child.summary.map((summaryChild, summaryIndex) => ({
				summaryChild,
				summaryIndex,
				Renderer: registry[summaryChild.activeView as keyof typeof registry] as Component<{
					path: (string | number)[];
					refs: Refs;
					additionalFlipId?: string;
					onUnmount: () => void;
					overrides?: { class?: string };
				}>
			}))
		}))
	);

	// Prepare renderer for the active section
	let ActiveSectionRenderer = $derived(
		registry[children[sidebarState.activeIndex].activeView as keyof typeof registry] as Component<{
			path: (string | number)[];
			refs: Refs;
			onUnmount: () => void;
			overrides?: { heading?: boolean; accommodateControls?: boolean };
		}>
	);

	// Function to change the active section
	function setActiveSection(index: number) {
		onUnmount();
		// Update the activeIndex in the state
		document.state.animateNextChange = false;
		sidebarState.activeIndex = index;

		// On mobile, close the drawer after selecting a section
		if (isMobile) {
			isDrawerOpen = false;
		}
	}

	// Mobile drawer state
	let isDrawerOpen = $state(false);
	let isMobile = $state(false);

	// Toggle drawer
	function toggleDrawer() {
		isDrawerOpen = !isDrawerOpen;
	}

	// Check if screen is mobile size (md breakpoint = 768px)
	function checkMobileSize() {
		isMobile = window.innerWidth < 768;
	}

	onMount(() => {
		checkMobileSize();
		window.addEventListener('resize', checkMobileSize);

		return () => {
			window.removeEventListener('resize', checkMobileSize);
		};
	});

	$inspect(`acommodateControls: ${!isMobile}`);
</script>

{#key children[sidebarState.activeIndex].id}
	<div class="flex flex-col md:flex-row">
		<!-- Mobile toggle button -->
		{#if isMobile && !isDrawerOpen}
			<div class="mb-4">
				<Chip label="sidebar" onclick={toggleDrawer} />
			</div>
		{/if}

		{#if isMobile}
			<!-- Mobile View: Show either sidebar or content -->
			{#if isDrawerOpen}
				<!-- Mobile Sidebar -->
				<div class="w-full bg-white">
					<!-- Mobile close button -->
					<div class="mb-4">
						<Chip label="close" onclick={toggleDrawer} />
					</div>

					<!-- Sidebar items -->
					{#each ChildrenRenderers as { child, index, HeadingRenderer, SummaryRenderers }}
						<div class="sidebar-item p-5 first:pt-0" on:click={() => setActiveSection(index)}>
							<div class="heading">
								<HeadingRenderer
									path={[...path, 'children', index, 'heading']}
									additionalFlipId={'sidebar-item-' + index}
									{refs}
									{onUnmount}
									overrides={{ class: 'prose-h1:text-xl' }}
								/>
							</div>

							{#if SummaryRenderers.length > 0}
								<div class="summary">
									{#each SummaryRenderers as { summaryChild, summaryIndex, Renderer }}
										<Renderer
											path={[...path, 'children', index, 'summary', summaryIndex]}
											additionalFlipId={'sidebar-item-' + index}
											{refs}
											{onUnmount}
											overrides={{ class: 'prose-p:text-xs prose-p:text-gray-500' }}
										/>
									{/each}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{:else}
				<!-- Mobile Content View -->
				<div class="w-full">
					<ActiveSectionRenderer
						overrides={{ heading: true }}
						path={[...path, 'children', sidebarState.activeIndex]}
						{refs}
						{onUnmount}
					/>
				</div>
			{/if}
		{:else}
			<!-- Desktop View: Show sidebar and content side by side -->
			<!-- Sidebar -->
			<div
				class="shrink-0 border-r-1 border-gray-300"
				style:width={sidebarState.percentageWidth + '%'}
			>
				<!-- Sidebar items -->
				{#each ChildrenRenderers as { child, index, HeadingRenderer, SummaryRenderers }}
					<div class="sidebar-item p-5 first:pt-0" on:click={() => setActiveSection(index)}>
						<div class="heading">
							<HeadingRenderer
								path={[...path, 'children', index, 'heading']}
								additionalFlipId={'sidebar-item-' + index}
								{refs}
								{onUnmount}
								overrides={{ class: 'prose-h1:text-xl' }}
							/>
						</div>

						{#if SummaryRenderers.length > 0}
							<div class="summary">
								{#each SummaryRenderers as { summaryChild, summaryIndex, Renderer }}
									<Renderer
										path={[...path, 'children', index, 'summary', summaryIndex]}
										additionalFlipId={'sidebar-item-' + index}
										{refs}
										{onUnmount}
										overrides={{ class: 'prose-p:text-xs prose-p:text-gray-500' }}
									/>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</div>

			<!-- Content -->
			<div
				class="content relative grow basis-0 pt-0"
				style:width={100 - sidebarState.percentageWidth + '%'}
			>
				<ActiveSectionRenderer
					overrides={{ accommodateControls: true, heading: false }}
					path={[...path, 'children', sidebarState.activeIndex]}
					{refs}
					{onUnmount}
				/>
			</div>
		{/if}
	</div>
{/key}

<style>
	.sidebar-item {
		cursor: pointer;
	}

	.summary {
		margin-top: 4px;
	}
</style>
