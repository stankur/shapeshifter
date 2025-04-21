<script lang="ts">
	import {
		sectionContainer,
		sectionContainerCardViewState,
		type Section
	} from '$lib/model/collection';
	import type { ContentHeading, ContentParagraph } from '$lib/model/content';
	import { registry } from '$lib/viewRegistry.svelte';
	import type { Component } from 'svelte';
	import type { z } from 'zod';
	import type { Refs } from '$lib/components/Document.svelte';
	import { getContext } from 'svelte';
	import type { Document } from '$lib/model/document';
	import { addSection } from '$lib/actions/collection/section-container.svelte';
	import { createHeadingNavProps, createSummaryNavProps } from './navigation';
	import type { NavigationHandler } from '$lib/services/navigation/types';
	import type { DocumentManipulator } from '$lib/documentManipulator.svelte';
	import Chip from '$lib/components/Chip.svelte';
	import SubsectionsList from './SubsectionsList.svelte';
	import {
		handleAddSection,
		type HeadingComponentProps,
		type ContentComponentProps,
		type SectionContainerType,
		type SectionContainerViewStateType,
		expandAllSections
	} from './cardUtils';

	// Custom action to bind an element to refs with a specific ID
	function bindToRefs(element: HTMLElement, id: string) {
		// Set the data-flip-id attribute
		element.setAttribute('data-flip-id', id);

		// Add the element to the refs object
		refs[id] = { element };

		// Return a cleanup function
		return {
			destroy() {
				// Remove the element from refs when unmounted
				delete refs[id];
			}
		};
	}

	const document = getContext('document') as Document;
	const documentManipulator = getContext('documentManipulator') as DocumentManipulator;

	let {
		path,
		refs,
		onUnmount,
		showSubsections = false,
		onToggleSubsections = () => {}
	}: {
		path: (string | number)[];
		refs: Refs;
		onUnmount: (elementToPin?: string | null) => void;
		showSubsections?: boolean;
		onToggleSubsections?: () => void;
	} = $props();

	const node = documentManipulator.getByPath(path) as SectionContainerType;
	let { children, view, activeView } = $derived(node);

	let SectionRenderers = $derived(
		children.map((child, sectionIndex) => ({
			child,
			sectionIndex,
			HeadingRenderer: registry[
				child.heading.activeView as keyof typeof registry
			] as unknown as Component<HeadingComponentProps>,
			SummaryRenderers: child.summary.map((summaryChild, summaryIndex) => ({
				summaryChild,
				summaryIndex,
				Renderer: registry[
					summaryChild.activeView as keyof typeof registry
				] as unknown as Component<ContentComponentProps>
			}))
		}))
	);

	let someHasImage = $derived(children.some((child) => child.image));

	// Get the multilevel setting from the state
	let isMultilevelEnabled = $derived(
		(() => {
			const currentView = view.find((v) => v.type === activeView);
			if (currentView && 'state' in currentView) {
				return (currentView.state as SectionContainerViewStateType).multilevel;
			}
			return false;
		})()
	);

	// Minimum width for cards
	const minCardWidth = 250;
</script>

<div class="card-container" style:--min-card-width={`${minCardWidth}px`}>
	{#each SectionRenderers as { child, sectionIndex, HeadingRenderer, SummaryRenderers }}
		<div class="card flex flex-col border-1 border-gray-400 p-5">
			<div class="flex flex-row gap-6">
				{#if child.image}
					<img
						class="h-16 w-16 md:h-24 md:w-24 xl:h-32 xl:w-32"
						src={child.image}
						alt="Section cover"
						use:bindToRefs={`${child.id}-image`}
					/>
				{:else if someHasImage}
					<div class="h-16 w-16 shrink-0 md:h-24 md:w-24 xl:h-32 xl:w-32" />
				{/if}
				<div class="flex flex-col gap-2 xl:gap-2">
					<HeadingRenderer
						path={[...path, 'children', sectionIndex, 'heading']}
						{refs}
						{onUnmount}
						{...createHeadingNavProps(child, node, sectionIndex, document)}
						overrides={{
							class: 'prose-h1:text-base md:prose-h1:text-xl'
						}}
						onClickReadMode={() => {
							// Pass the heading ID to onUnmount using a closure
							expandAllSections(node, document, () => {
								console.log('onUnmounting with id: ' + child.heading.id);
								onUnmount(child.heading.id);
							});
						}}
					/>
					<div>
						{#each SummaryRenderers as { summaryChild, summaryIndex, Renderer }}
							<Renderer
								path={[...path, 'children', sectionIndex, 'summary', summaryIndex]}
								{refs}
								{onUnmount}
								overrides={{
									class: 'prose-p:text-xs prose-p:text-gray-500'
								}}
								{...createSummaryNavProps(child, node, summaryChild.id, sectionIndex, document)}
							/>
						{/each}
					</div>
				</div>
			</div>
			
			{#if isMultilevelEnabled}
				<SubsectionsList {path} {sectionIndex} {showSubsections} onToggle={onToggleSubsections} {onUnmount} {refs} />
			{/if}
		</div>
	{/each}

	{#if document.state.mode !== 'read'}
		<Chip onclick={() => handleAddSection(node, onUnmount)} label="Add Section" />
	{/if}
</div>

<style lang="postcss">
	.card-container {
		display: grid;
		grid-template-columns: 1fr;
		gap: 16px;
	}

	@media (min-width: 1280px) {
		.card-container {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
