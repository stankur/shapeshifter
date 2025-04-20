<script lang="ts">
	import type { Refs } from '$lib/components/Document.svelte';
	import type { Section, SectionContainer } from '$lib/model/collection';
	import type { ContentHeading, ContentParagraph } from '$lib/model/content';
	import type { Document } from '$lib/model/document';
	import { float } from '$lib/view/utils/float.svelte';
	import { registry } from '$lib/viewRegistry.svelte';
	import { getContext, onMount, type Component } from 'svelte';
	import DefaultControl from './control/DefaultControl.svelte';
	import {
		handleHeadingLevelIncrease,
		handleHeadingLevelDecrease,
		splitParagraph,
		splitSection,
		handleEnterInHeading
	} from '$lib/actions/collection/section.svelte';
	import type { DocumentManipulator } from '$lib/documentManipulator.svelte';

	type Props = {
		path: (string | number)[];
		refs: Refs;
		onUnmount: (elementToPin?: string | null) => void;
		overrides?: { heading?: boolean; accommodateControls?: boolean };
		addSection: (newSection: Section) => void;
		findPrecedingSection: (level: number) => Section | null;
		findParentSection: () => Section | null;
		findParentSectionContainer: () => SectionContainer | null;
		removeSectionFromContainer: () => void;
		onHeadingClick?: (section: Section) => void;
	};
	type ViewState = { 
		state: { 
			state: 'expanded' | 'summary',
			variation: 'default' | 'summary-always'
		} 
	};
	let {
		path,
		refs,
		onUnmount,
		overrides = {},
		addSection,
		findPrecedingSection,
		findParentSection,
		findParentSectionContainer,
		removeSectionFromContainer,
		onHeadingClick
	}: Props = $props();

	const defaultOverRides = { heading: true, accommodateControls: false };
	let mergedOverrides = $derived(Object.assign({}, defaultOverRides, overrides));
	$inspect(`mergedOverrides:`, mergedOverrides);
	let document = getContext('document') as Document;
	const documentManipulator = getContext('documentManipulator') as DocumentManipulator;
	const node = documentManipulator.getByPath(path) as Section;

	let { activeView, view } = node;
	let HeadingRenderer = $derived(
		registry[node.heading.activeView as keyof typeof registry] as unknown as Component<{
			path: (string | number)[];
			refs: Refs;
			onClickReadMode: () => void;
			onUnmount: () => void;
			onLevelIncrease: () => boolean;
			onLevelDecrease: () => boolean;
			onEnterAtEnd: () => boolean;
		}>
	);
	let ChildrenRenderers = $derived(
		node.children.map((child) => ({
			Renderer: registry[child.activeView as keyof typeof registry] as Component<{
				path: (string | number)[];
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
				path: (string | number)[];
				refs: Refs;
				overrides?: { class?: string };
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

	onMount(() => {
		if (containerElement && controlElement) {
			if (mergedOverrides.accommodateControls) {
				console.log('for section', node.id, ' with title ', node.heading.content);
				console.log(
					'accommodateControls is true, setting paddingLeft to',
					controlElement.clientWidth
				);
				containerElement.style.paddingLeft = `${controlElement.clientWidth}px`;
			} else {
				console.log('for section', node.id, ' with title ', node.heading.content);
				console.log('accommodateControls is false, setting paddingLeft to 0px');
				containerElement.style.paddingLeft = '0px';
			}

			// Determine which element to use as reference for the floating control
			const referenceElement = mergedOverrides?.heading ? headingElement : contentElement;
			// Use 'left' for heading, 'left-start' for content
			const placement = mergedOverrides?.heading ? 'left' : 'left-start';

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

	$effect(() => {
		if (containerElement && controlElement) {
			if (mergedOverrides.accommodateControls) {
				containerElement.style.paddingLeft = `${controlElement.clientWidth}px`;
			} else {
				containerElement.style.paddingLeft = '0px';
			}
		}
	});
</script>

{#if document.state.mode === 'customize'}
	<DefaultControl
		bind:controlElement={controlElement as HTMLDivElement}
		viewState={node.view[viewStateIndex] as ViewState}
		{onUnmount}
	/>
{/if}

<div class="container flex flex-col gap-7" bind:this={containerElement}>
	{#if mergedOverrides && mergedOverrides.heading}
		{#key node.heading.id}
			<div bind:this={headingElement}>
				<HeadingRenderer
					onClickReadMode={() => {
						// Pass the heading ID to onUnmount before changing state
						onUnmount(node.heading.id);
						document.state.animateNextChange = false;

						if (onHeadingClick) {
							onHeadingClick(node);
                            return
						}

						if ((node.view[viewStateIndex] as ViewState).state.state === 'expanded') {
							(node.view[viewStateIndex] as ViewState).state.state = 'summary';
							return;
						}
						(node.view[viewStateIndex] as ViewState).state.state = 'expanded';
					}}
					path={[...path, 'heading']}
					{refs}
					{onUnmount}
					onLevelIncrease={() => {
						console.log('onLevelIncrease in section');
						return handleHeadingLevelIncrease(
							node,
							findPrecedingSection,
							removeSectionFromContainer
						);
					}}
					onLevelDecrease={() => {
						console.log('onLevelDecrease in section');
						return handleHeadingLevelDecrease(
							node,
							findParentSectionContainer,
							findParentSection,
							removeSectionFromContainer,
							() => {
								// Find the grandparent section container
								// This is the container that contains the parent section
								const parentSection = findParentSection();
								if (!parentSection) return null;

								// Get the path to the parent section's container
								// This would be the grandparent container for the current section
								const parentSectionContainer = findParentSectionContainer();
								if (!parentSectionContainer) return null;

								// Find the container that contains the parent section container
								// This is done by looking at the parent section's parent
								// We assume every section is in a container
								return documentManipulator.getByPath([...path.slice(0, -6)]) as SectionContainer;
							}
						);
					}}
					onEnterAtEnd={() => {
						console.log('onEnterAtEnd in section');
						return handleEnterInHeading(node, document);
					}}
				/>
			</div>
		{/key}
	{/if}

	<div bind:this={contentElement} class="flex flex-col gap-7">
		{#if (node.view[viewStateIndex] as ViewState).state.state === 'expanded'}
			{#if (node.view[viewStateIndex] as ViewState).state.variation === 'summary-always' && SummaryRenderers.length > 0}
				<!-- Show summary first when variation is summary-always -->
					{#each SummaryRenderers as { Renderer }, i (node.summary[i].last_modified + node.summary[i].id)}
						<Renderer
							path={[...path, 'summary', i]}
							{refs}
							overrides={{ class: 'prose-p:text-gray-500' }}
							onSplit={(newBlocks) => {
								splitParagraph(node, 'summary', newBlocks, document, i);
							}}
							{onUnmount}
						/>
					{/each}
			{/if}
			
			{console.log('children renderers length in section: ', ChildrenRenderers.length)}
			<!-- should work without the key, but not working -->
			{#each ChildrenRenderers as { Renderer }, i (node.children[i].last_modified + node.children[i].id)}
				<div class={node.children[i].type === 'section-container' ? 'mt-5' : ''}>
					<Renderer
						path={[...path, 'children', i]}
						onSplit={(newBlocks) => {
							console.log('newBlocks');
							console.log(newBlocks);
							splitParagraph(node, 'children', newBlocks, document, i);
						}}
						onConvertToHeading={(paragraphId) => {
							splitSection(node, paragraphId, document, addSection);
						}}
						{refs}
						{onUnmount}
					/>
				</div>
			{/each}
		{:else if (node.view[viewStateIndex] as ViewState).state.state === 'summary'}
			{#each SummaryRenderers as { Renderer }, i (node.summary[i].last_modified + node.summary[i].id)}
				{console.log(i)}
				{console.log((node.summary[i] as ContentParagraph).content)}
				<Renderer
					path={[...path, 'summary', i]}
					{refs}
					overrides={{ class: 'prose-p:text-gray-500' }}
					onSplit={(newBlocks) => {
						splitParagraph(node, 'summary', newBlocks, document, i);
					}}
					{onUnmount}
				/>
			{/each}
		{/if}
	</div>
</div>
