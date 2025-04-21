<script lang="ts">
	import type { Section, SectionContainer } from '$lib/model/collection';
	import { getContext } from 'svelte';
	import type { DocumentManipulator } from '$lib/documentManipulator.svelte';

	let {
		path,
		sectionIndex,
		showSubsections = false,
		onToggle = () => {}
	}: {
		path: (string | number)[];
		sectionIndex: number;
		showSubsections?: boolean;
		onToggle?: () => void;
	} = $props();

	const documentManipulator = getContext('documentManipulator') as DocumentManipulator;

	// Get the section from the path
	const container = documentManipulator.getByPath(path) as SectionContainer;
	const section = container.children[sectionIndex];

	// Collect subsection titles from this specific section
	let subsectionTitles = $derived(
		(() => {
			const titles = [];

			// Look through this section's children for section containers
			for (const child of section.children) {
				if (child.type === 'section-container') {
					// For each section in the container, get the heading
					for (const containerSection of child.children) {
						if (containerSection.heading && containerSection.heading.content) {
							titles.push(containerSection.heading.content);
						}
					}
				}
			}

			return titles;
		})()
	);
</script>

{#if subsectionTitles.length > 0}
	<div class="mt-2 border-t-1 border-t-gray-300 pt-4">
		<div class="mb-2 flex justify-between cursor-pointer" on:click={onToggle}>
			<span class="select-none mr-1 text-xs font-semibold">subsections</span>
			<svg
				class="h-4 w-4 text-gray-600 transition-transform duration-200"
				class:rotate-180={showSubsections}
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<polyline points="6 9 12 15 18 9"></polyline>
			</svg>
		</div>

		{#if showSubsections}
			<div class="flex mt-6 flex-wrap gap-3 gap-x-6 pt-2 transition-all duration-200 ease-in-out">
				{#each subsectionTitles as title}
					<h1 class="cursor-default text-xs text-gray-600">{title}</h1>
				{/each}
			</div>
		{/if}
	</div>
{/if}
