<script lang="ts">
	import type { Refs } from '$lib/components/Document.svelte';
	import { type Section, type SectionContainer } from '$lib/model/collection';
	import { registry } from '$lib/viewRegistry.svelte';
	import type { Component } from 'svelte';
	import SectionWrite from '$lib/view/collection/section/write/Write.svelte';
	import Write from '$lib/view/collection/section-container/Write.svelte';
	import {
		addSectionToContainer,
		removeSectionFromContainer
	} from '$lib/actions/collection/section-container.svelte';
	import { getContext } from 'svelte';
	import type { DocumentManipulator } from '$lib/documentManipulator.svelte';

	let {
		path,
		refs,
		onUnmount
	}: {
		path: (string | number)[];
		refs: Refs;
		onUnmount: () => void;
	} = $props();

	type ChildrenRenderersType = {
		Renderer: Component<{
			path: (string | number)[];
			refs: Refs;
			onUnmount: () => void;
			addSection: (section: Section) => void;
			findPrecedingSection: (level: number) => Section | null;
			findParentSection: () => Section | null;
			findParentSectionContainer: () => SectionContainer | null;
			removeSectionFromContainer: () => void;
		}>;
	};

	const documentManipulator = getContext('documentManipulator') as DocumentManipulator;
	const node = documentManipulator.getByPath(path) as SectionContainer;
	let { children } = $derived(node);

	let ChildrenRenderers = $derived(
		children.map((child, index) => {
			if (child.type === 'section') {
				return {
					Renderer: SectionWrite as ChildrenRenderersType['Renderer']
				};
			}

			if (child.type === 'section-container') {
				return {
					Renderer: Write as ChildrenRenderersType['Renderer']
				};
			}

			return {
				Renderer: registry[
					child.activeView as keyof typeof registry
				] as ChildrenRenderersType['Renderer']
			};
		})
	);
</script>

<div class="flex flex-col gap-12">
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
			findPrecedingSection={(level) => {
				// Look for a section before the current one with the specified level
				for (let i = index - 1; i >= 0; i--) {
					if (node.children[i].heading.level === level) {
						return node.children[i];
					}
				}

				console.log('no preceding section found for level: ', level);
				return null;
			}}
			findParentSection={() => {
				// Try to find the parent section in the document hierarchy
				// This would be the section that contains this section container
				// We need to go up the path to find it
				try {
					// The path is like [..., 'children', index]
					// We need to go up to [...] to find the parent section
					const parentPath = path.slice(0, -2);
					return documentManipulator.getByPath(parentPath) as Section;
				} catch (e) {
					console.log('Error finding parent section:', e);
					return null;
				}
			}}
			findParentSectionContainer={() => {
				// Return the current section container as the parent container
				return node;
			}}
			removeSectionFromContainer={() => {
				removeSectionFromContainer(node, index);
			}}
		/>
	{/each}
</div>
