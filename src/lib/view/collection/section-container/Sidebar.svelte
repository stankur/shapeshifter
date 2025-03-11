<script lang="ts">
	import { sectionContainer, type Section } from '$lib/model/collection';
	import type { ContentHeading } from '$lib/model/content';
	import { registry } from '$lib/viewRegistry.svelte';
	import type { Component } from 'svelte';
	import type { z } from 'zod';
	import type { Refs } from '$lib/Document.svelte';

	type SectionContainer = z.infer<typeof sectionContainer>;

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
				node: ContentHeading;
				refs: Refs;
				additionalFlipId?: string;
				onUnmount: () => void;
			}>,
			SummaryRenderers: child.summary.map((summaryChild) => ({
				summaryChild,
				Renderer: registry[summaryChild.activeView as keyof typeof registry] as Component<{
					node: typeof summaryChild;
					refs: Refs;
					additionalFlipId?: string;
					onUnmount: () => void;
				}>
			}))
		}))
	);

	// Prepare renderer for the active section
	let ActiveSectionRenderer = $derived(
		registry[children[sidebarState.activeIndex].activeView as keyof typeof registry] as Component<{
			node: Section;
			refs: Refs;
			onUnmount: () => void;
		}>
	);

	// Function to change the active section
	function setActiveSection(index: number) {
		onUnmount();
		// Update the activeIndex in the state
		sidebarState.activeIndex = index;
	}
</script>

{#key children[sidebarState.activeIndex].id}
	<div class="container">
		<!-- Sidebar -->
		<div class="sidebar" style:width="{sidebarState.percentageWidth}%">
			{#each ChildrenRenderers as { child, index, HeadingRenderer, SummaryRenderers }}
				<div
					class="sidebar-item"
					on:click={() => setActiveSection(index)}
				>
					<div class="heading">
						<HeadingRenderer
							node={child.heading}
							additionalFlipId={'sidebar-item-' + index}
							{refs}
							{onUnmount}
						/>
					</div>

					{#if SummaryRenderers.length > 0}
						<div class="summary">
							{#each SummaryRenderers as { summaryChild, Renderer }}
								<Renderer
									node={summaryChild}
									additionalFlipId={'sidebar-item-' + index}
									{refs}
									{onUnmount}
								/>
							{/each}
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Content -->
		<div class="content grow basis-0 p-2">
			<ActiveSectionRenderer node={children[sidebarState.activeIndex]} {refs} {onUnmount} />
		</div>
	</div>
{/key}

<style>
	.container {
		display: flex;
		width: 100%;
	}

	.sidebar {
		border-right: 1px solid black;
	}

	.sidebar-item {
		border-bottom: 1px solid black;
		padding: 8px;
		cursor: pointer;
	}

	.summary {
		margin-top: 4px;
	}
</style>
