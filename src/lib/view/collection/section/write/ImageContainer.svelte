<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import type { DocumentManipulator } from '$lib/documentManipulator.svelte';
	import type { Section } from '$lib/model/collection';
	import { extractSummaryMarkdown } from '$lib/extract/section';

	let isGenerating = $state(false);
	let progress = $state(0);
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

	const section = documentManipulator.getByPath(path) as Section;

	onMount(() => {
		console.log('ImageContainer mounted');
	});

	/**
	 * Generate a cover image for the section by calling the API with SSE
	 */
	async function generateImage(e: Event) {
		e.stopImmediatePropagation();
		isGenerating = true;
		progress = 0;
		errorMessage = null;

		try {
			// Extract the summary content as markdown
			const markdown = extractSummaryMarkdown(section);
			
			// Create the request body
			const requestBody = JSON.stringify({ markdown });
			
			// Create a unique URL to prevent caching
			const url = `/api/generate-cover-image?t=${Date.now()}`;
			
			// Create the fetch request
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: requestBody
			});
			
			if (!response.ok) {
				throw new Error(`Failed to generate cover image: ${response.statusText}`);
			}
			
			// Create a reader for the stream
			const reader = response.body?.getReader();
			if (!reader) {
				throw new Error('Failed to create stream reader');
			}
			
			// Process the stream
			const decoder = new TextDecoder();
			let buffer = '';
			
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				
				// Decode the chunk and add it to the buffer
				buffer += decoder.decode(value, { stream: true });
				
				// Process complete events in the buffer
				let eventEnd = buffer.indexOf('\n\n');
				while (eventEnd !== -1) {
					const eventData = buffer.substring(0, eventEnd);
					buffer = buffer.substring(eventEnd + 2);
					
					// Parse the event
					const eventLines = eventData.split('\n');
					let eventType = '';
					let eventContent = '';
					
					for (const line of eventLines) {
						if (line.startsWith('event: ')) {
							eventType = line.substring(7);
						} else if (line.startsWith('data: ')) {
							eventContent = line.substring(6);
						}
					}
					
					// Handle the event
					if (eventType && eventContent) {
						try {
							const data = JSON.parse(eventContent);
							
							if (eventType === 'progress') {
								progress = data.progress;
							} else if (eventType === 'complete') {
								progress = 100;
								section.image = data.imageUrl;
								section.last_modified = new Date().toISOString();
								console.log('Set cover image:', section.image);
								isGenerating = false;
							} else if (eventType === 'error') {
								errorMessage = data.error || 'Failed to generate image';
								isGenerating = false;
							}
						} catch (err) {
							console.error('Error parsing event data:', err);
						}
					}
					
					eventEnd = buffer.indexOf('\n\n');
				}
			}
		} catch (err) {
			const error = err as Error;
			console.error('Error generating image:', error);
			errorMessage = error.message || 'Failed to generate image';
			isGenerating = false;
		}
	}
</script>

<div class="border border-gray-300">
	<div
		class="flex cursor-pointer items-center justify-between bg-gray-300 p-1 text-xs text-white"
		onclick={toggleExpanded}
	>
		<span class="flex items-center">
			<span class="inline-block w-4 text-center">{isExpanded ? '-' : '+'}</span>
			<span class="select-none">Cover Image</span>
		</span>
		<button
			class="rounded bg-blue-500 px-2 py-0.5 text-xs text-white select-none hover:bg-blue-600"
			onclick={generateImage}
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
			
			{#if isGenerating}
				<div class="mb-2">
					<div class="h-2 w-full bg-gray-200 rounded-full">
						<div class="h-full bg-blue-500 rounded-full" style="width: {progress}%"></div>
					</div>
					<p class="text-xs text-center mt-1">{progress}%</p>
				</div>
			{/if}

			{#if section.image}
				<div class="flex h-[200px] items-center justify-center overflow-hidden">
					<img
						src={section.image}
						alt="Section cover"
						class="max-h-full max-w-full object-contain"
					/>
				</div>
			{:else}
				<div class="flex h-[200px] items-center justify-center bg-gray-100 text-gray-400">
					No image set
				</div>
			{/if}
		</div>
	{/if}
</div>
