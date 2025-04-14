<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import type { DocumentManipulator } from '$lib/documentManipulator.svelte';
	import type { Section } from '$lib/model/collection';
	import type { ContentParagraph } from '$lib/model/content';
	import { createSummaryParagraph } from '$lib/actions/content/summary.svelte';
	import { extractMarkdownSection } from '$lib/extract/section';

	let isGenerating = $state(false);
	let generationProgress = $state('');
	let errorMessage = $state<string | null>(null);
	let isExpanded = $state(true);

	function toggleExpanded() {
		isExpanded = !isExpanded;
	}

	const documentManipulator = getContext('documentManipulator') as DocumentManipulator;

	let { 
        // path to the section
        path 
    } = $props();

	onMount(() => {
		console.log('SummaryContainer mounted');
	});

	/**
	 * Generate a summary using the streaming API endpoint
	 */
	async function generateSummary() {
		isGenerating = true;
		generationProgress = '';
		errorMessage = null;

		try {
			const section = documentManipulator.getByPath(path) as Section;
			
			// Extract markdown content from the section
			const markdownContent = extractMarkdownSection(section);
			
			const response = await fetch('/api/generate-summary', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ content: markdownContent })
			});

			if (!response.ok) {
				throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
			}

			// Ensure we have a summary paragraph to update
			
			if (section.summary.length === 0) {
				section.summary.push(createSummaryParagraph());
			}

			if (!response.body) {
				throw new Error('No response body');
			}
			// Process the streaming response
			const reader = response.body.getReader();
			const decoder = new TextDecoder();

			while (true) {
				const { done, value } = await reader.read();
				
				if (done) {
					break;
				}

				const chunk = decoder.decode(value);
                (section.summary[0] as ContentParagraph).content += chunk;
				
			}
		} catch (err) {
			const error = err as Error;
			console.error('Error generating summary:', error);
			errorMessage = error.message || 'Failed to generate summary';
		} finally {
			isGenerating = false;
		}
	}
</script>

<div class="border border-gray-300">
	<div class="p-1 text-xs bg-gray-300 text-white flex justify-between items-center cursor-pointer" onclick={toggleExpanded}>
		<span class="flex items-center">
			<span class="inline-block w-4 text-center">{isExpanded ? '-' : '+'}</span>
			<span class="select-none">Summary</span>
		</span>
		<button
			class="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-0.5 rounded select-none"
			onclick={generateSummary}
			disabled={isGenerating}
		>
			{isGenerating ? 'Generating...' : 'Generate'}
		</button>
	</div>
	{#if isExpanded}
	<div class="p-2 text-sm text-gray-500">
		{#if errorMessage}
			<p class="text-red-500">{errorMessage}</p>
		{/if}
		<slot></slot>
	</div>
	{/if}
</div>
