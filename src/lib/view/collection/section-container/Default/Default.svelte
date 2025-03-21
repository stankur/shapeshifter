<script lang="ts">
	import type { Refs } from '$lib/components/Document.svelte';
	import { type Section, type SectionContainer } from '$lib/model/collection';
	import { registry } from '$lib/viewRegistry.svelte';
	import type { Component } from 'svelte';

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
			child,
			Renderer: registry[child.activeView as keyof typeof registry] as Component<{
				node: Section;
				refs: Refs;
				onUnmount: () => void;
			}>
		}))
	);
</script>
<div class="flex flex-col gap-12">
	{#each ChildrenRenderers as { child, Renderer }}
		<Renderer node={child} {refs} {onUnmount} />
	{/each}
</div>

