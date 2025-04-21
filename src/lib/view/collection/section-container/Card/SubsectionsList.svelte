<script lang="ts">
	import type { Section, SectionContainer } from '$lib/model/collection';
	import { getContext } from 'svelte';
	import type { DocumentManipulator } from '$lib/documentManipulator.svelte';

	let {
		path,
		sectionIndex
	}: {
		path: (string | number)[];
		sectionIndex: number;
	} = $props();

	const documentManipulator = getContext('documentManipulator') as DocumentManipulator;

	// Get the section from the path
	const container = documentManipulator.getByPath(path) as SectionContainer;
	const section = container.children[sectionIndex];

  // Collect subsection titles from this specific section
  let subsectionTitles = $derived((() => {
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
  })());
</script>

{#if subsectionTitles.length > 0}
	<div class="mt-6 border-t-1 border-t-gray-300 pt-6 flex flex-wrap gap-3 gap-x-6">
		{#each subsectionTitles as title}
			<h1 class="text-xs font-semibold cursor-default text-gray-600">{title}</h1>
		{/each}
	</div>
{/if}
