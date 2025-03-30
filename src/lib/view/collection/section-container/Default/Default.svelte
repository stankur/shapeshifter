<script lang="ts">
	import type { Refs } from '$lib/components/Document.svelte';
	import { type Section, type SectionContainer } from '$lib/model/collection';
	import { registry } from '$lib/viewRegistry.svelte';
	import type { Component } from 'svelte';
	import {
		addSectionToContainer,
		removeSectionFromContainer
	} from '$lib/actions/collection/section-container.svelte';
	import { getContext } from 'svelte';
	import type { DocumentManipulator } from '$lib/documentManipulator.svelte';
	import Controls from './Controls.svelte';
	import type { Document } from '$lib/model/document';

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

	let isDefaultHovered = $state(false);

	const documentManipulator = getContext('documentManipulator') as DocumentManipulator;
	const node = documentManipulator.getByPath(path) as SectionContainer;
	let { children } = $derived(node);

	let ChildrenRenderers = $derived(
		children.map((child) => ({
			Renderer: registry[child.activeView as keyof typeof registry] as Component<{
				path: (string | number)[];
				refs: Refs;
				onUnmount: () => void;
				addSection: (section: Section) => void;
				findParentSection: (level: number) => Section | null;
				onSectionMoved: () => void;
			}>
		}))
	);
</script>

<div
	class="flex flex-col gap-12"
	onmouseenter={() => (isDefaultHovered = true)}
	onmouseleave={() => (isDefaultHovered = false)}
>
	{console.log('children renderers length in section container: ', ChildrenRenderers.length)}
	{#each ChildrenRenderers as { Renderer }, index}
		<Renderer
			path={[...path, 'children', index]}
			{refs}
			{onUnmount}
			addSection={(section) => {
				onUnmount();
				addSectionToContainer(node, section, index + 1);
			}}
			findParentSection={(level) => {
				// Look for a section before the current one with the specified level
				for (let i = index - 1; i >= 0; i--) {
					if (node.children[i].heading.level === level) {
						return node.children[i];
					}
				}

				console.log('no parent section found for level: ', level);
				return null;
			}}
			onSectionMoved={() => {
				removeSectionFromContainer(node, index);
			}}
		/>
	{/each}
</div>

{#if document.state.mode === 'customize'}
	<Controls {path} {onUnmount} {isDefaultHovered} />
{/if}
