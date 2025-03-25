<script lang="ts">
	import type { Refs } from '$lib/components/Document.svelte';
	import { type Section, type SectionContainer } from '$lib/model/collection';
	import { registry } from '$lib/viewRegistry.svelte';
	import type { Component } from 'svelte';
	import { addSectionToContainer } from '$lib/actions/collection.svelte';

	let {
		node,
		refs,
		onUnmount
	}: {
		node: SectionContainer;
		refs: Refs;
		onUnmount: () => void;
	} = $props();
	let { children } = $derived(node);

	let ChildrenRenderers = $derived(
		children.map((child) => ({
			Renderer: registry[child.activeView as keyof typeof registry] as Component<{
				node: Section;
				refs: Refs;
				onUnmount: () => void;
				addSection: (section: Section) => void;
				findParentSection: (level: number) => Section | null;
				onSectionMoved: () => void;
			}>
		}))
	);
</script>

<div class="flex flex-col gap-12">
	{console.log('children renderers length in section container: ', ChildrenRenderers.length)}
	{#each ChildrenRenderers as { Renderer }, index}
			<Renderer
				node={node.children[index]}
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
					// Remove the section from the container
					node.children.splice(index, 1);
					node.last_modified = new Date().toISOString();
				}}
			/>
	{/each}
</div>
