<script lang="ts">
	import type { Refs } from '$lib/components/Document.svelte';
	import { type Section, type SectionContainer } from '$lib/model/collection';
	import { registry } from '$lib/viewRegistry.svelte';
	import type { Component } from 'svelte';
	import { addSectionToContainer } from '$lib/actions/collection.svelte';
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
	
	const documentManipulator = getContext('documentManipulator') as DocumentManipulator;
	const node = documentManipulator.getByPath(path) as SectionContainer;
	let { children } = node;

	let ChildrenRenderers = $derived(
		children.map((child) => ({
			Renderer: registry[child.activeView as keyof typeof registry] as Component<{
				path: (string | number)[];
				refs: Refs;
				onUnmount: () => void;
				addSection: (section: Section) => void;
			}>
		}))
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
		/>
	{/each}
</div>
