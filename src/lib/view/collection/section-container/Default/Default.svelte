<script lang="ts">
	import type { Refs } from '$lib/components/Document.svelte';
	import { type Section, type SectionContainer } from '$lib/model/collection';
	import { registry } from '$lib/viewRegistry.svelte';
	import { onMount, tick, type Component } from 'svelte';
	import {
		addSectionToContainer,
		removeSectionFromContainer
	} from '$lib/actions/collection/section-container.svelte';

	let {
		node = $bindable<SectionContainer>(),
		refs,
		onUnmount
	}: {
		node: SectionContainer;
		refs: Refs;
		onUnmount: () => void;
	} = $props();

	$inspect(`section container children length: ${node.children.length}`);

	let ChildrenRenderers = $derived(
		node?.children.map((child) => ({
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
	$inspect(`section container children renderers length: ${ChildrenRenderers.length}`);

	onMount(() => {
		console.log('mounted');
	});
</script>

{#if node}
	<div class="flex flex-col gap-12">
		{console.log('children renderers length: ', ChildrenRenderers.length)}
		{#each ChildrenRenderers as { Renderer }, index (node.children[index].id)}
			{#key node}
				<Renderer
					bind:node={
						() => {
							console.log('supplying the node of section: ', node.children[index]?.id);
							console.log('index: ', index);

							return node.children[index];
						},
						(v) => (node.children[index] = v)
					}
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
			{/key}
		{/each}
	</div>
{/if}
