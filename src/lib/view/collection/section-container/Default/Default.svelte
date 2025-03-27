<script lang="ts">
	import type { Refs } from '$lib/components/Document.svelte';
	import { type Section, type SectionContainer } from '$lib/model/collection';
	import { registry } from '$lib/viewRegistry.svelte';
	import { onMount, tick, type Component } from 'svelte';
	import { addSectionToContainer } from '$lib/actions/collection/section-container.svelte';

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
	let sectionsToRemove = $state<string[]>([]);
	let shouldRemoveSections = $derived(sectionsToRemove.length > 0);

	let ChildrenRenderers = $derived(
		children.map((child) => ({
			Renderer: registry[child.activeView as keyof typeof registry] as Component<{
				node: Section;
				refs: Refs;
				onUnmount: () => void;
				addSection: (section: Section) => void;
				findParentSection: (level: number) => Section | null;
				onSectionMoved: (sectionId: string) => void;
			}>
		}))
	);
	onMount(() => {
		console.log('mounted');
	});

	$effect(() => {
		console.log('in effect for: ', node.id, sectionsToRemove);
		if (shouldRemoveSections) {
			console.log('sections to remove: ', sectionsToRemove);
			node.children = node.children.filter((child) => !sectionsToRemove.includes(child.id));
			sectionsToRemove = [];
		}
	});

	$inspect(node.id, sectionsToRemove, node.children.map((child) => child.id), shouldRemoveSections);


</script>

<div class="flex flex-col gap-12">
	{#each ChildrenRenderers as { Renderer }, index (node.children[index].id)}
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
			onSectionMoved={(sectionId) => {
				// node.last_modified = new Date().toISOString();
				sectionsToRemove.push(sectionId);
				console.log('sucked section removed from container');
			}}
		/>
	{/each}
</div>
