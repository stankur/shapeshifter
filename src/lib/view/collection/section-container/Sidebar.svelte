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
	}
</script>

{#key children[sidebarState.activeIndex].id}
	<div class="flex">
		<!-- Sidebar -->
		<div class="border-r-1 border-gray-300 shrink-0" style:width="{sidebarState.percentageWidth}%">
			{#each ChildrenRenderers as { child, index, HeadingRenderer, SummaryRenderers }}
				<div class="sidebar-item first:pt-0 p-5" on:click={() => setActiveSection(index)}>
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
		<div class="content grow basis-0 p-2 pt-0" style:width="{100 - sidebarState.percentageWidth}%">
			<ActiveSectionRenderer
				overrides={{ accommodateControls: true }}
				path={[...path, 'children', sidebarState.activeIndex]}
				{refs}
				{onUnmount}
			/>
		</div>
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
