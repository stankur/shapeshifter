<script lang="ts">
	import type { Refs } from '$lib/components/Document.svelte';
	import type { Section } from '$lib/model/collection';
	import type { ContentHeading, ContentParagraph } from '$lib/model/content';
	import type { Document } from '$lib/model/document';
	import { float } from '$lib/view/utils/float.svelte';
	import { registry } from '$lib/viewRegistry.svelte';
	import { getContext, onMount, type Component } from 'svelte';
	import {
		handleHeadingLevelIncrease,
		splitParagraph,
		splitSection,
		handleEnterInHeading
	} from '$lib/actions/collection/section.svelte';
	import Write from '$lib/view/collection/section-container/Write.svelte';
	import type { DocumentManipulator } from '$lib/documentManipulator.svelte';
	import SummaryContainer from './SummaryContainer.svelte';

	type Props = {
		path: (string | number)[];
		refs: Refs;
		onUnmount: () => void;
		overrides?: { heading?: boolean; accommodateControls?: boolean };
		addSection?: (newSection: Section) => void;
		findParentSection?: (level: number) => Section | null;
		removeSectionFromContainer?: () => void;
	};
	let {
		path,
		refs,
		onUnmount,
		overrides = {},
		addSection = () => {},
		findParentSection = () => null,
		removeSectionFromContainer = () => {}
	}: Props = $props();

	const defaultOverRides = { heading: true, accommodateControls: false };
	overrides = { ...defaultOverRides, ...overrides };

	let document = getContext('document') as Document;
	const documentManipulator = getContext('documentManipulator') as DocumentManipulator;
	const node = documentManipulator.getByPath(path) as Section;

	let { activeView, view } = node;
	let HeadingRenderer = $derived(
		registry[node.heading.activeView as keyof typeof registry] as unknown as Component<{
			path: (string | number)[];
			refs: Refs;
			onUnmount: () => void;
			onLevelIncrease: () => boolean;
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
				onUnmount: () => void;
				onSplit: (newBlocks: [string, string]) => void;
			}>
		}))
	);
</script>

<div class="container flex flex-col gap-7">
	{#if overrides && overrides.heading}
		{#key node.heading.id}
			<HeadingRenderer
				path={[...path, 'heading']}
				{refs}
				{onUnmount}
				onLevelIncrease={() => {
					console.log('onLevelIncrease in section');
					return handleHeadingLevelIncrease(node, findParentSection, removeSectionFromContainer);
				}}
				onEnterAtEnd={() => {
					console.log('onEnterAtEnd in section');
					return handleEnterInHeading(node, document);
				}}
			/>
		{/key}
	{/if}

	<div class="flex flex-col gap-7">
		<SummaryContainer>
			{#each SummaryRenderers as { Renderer }, i (node.summary[i].last_modified + node.summary[i].id)}
				{console.log(i)}
				{console.log((node.summary[i] as ContentParagraph).content)}
				<Renderer
					path={[...path, 'summary', i]}
					{refs}
					onSplit={(newBlocks) => {
						splitParagraph(node, 'summary', newBlocks, document, i);
					}}
					{onUnmount}
				/>
			{/each}
		</SummaryContainer>
		<div>
			{#each ChildrenRenderers as { Renderer }, i (node.children[i].last_modified + node.children[i].id)}
				{#if node.children[i].type === 'section-container'}
					<div class="mt-5">
						<Write path={[...path, 'children', i]} {refs} {onUnmount} />
					</div>
				{:else}
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
				{/if}
			{/each}
		</div>
	</div>
</div>
