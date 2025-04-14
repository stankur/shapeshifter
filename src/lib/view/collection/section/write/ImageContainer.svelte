<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import type { DocumentManipulator } from '$lib/documentManipulator.svelte';
	import type { Section } from '$lib/model/collection';

	let isGenerating = $state(false);
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
	 * Generate an image (to be implemented later)
	 */
	async function generateImage() {
		isGenerating = true;
		errorMessage = null;

		try {
			// This functionality will be implemented later
			console.log('Generate image functionality will be implemented later');

			// For now, just simulate a delay
			await new Promise((resolve) => setTimeout(resolve, 1000));
		} catch (err) {
			const error = err as Error;
			console.error('Error generating image:', error);
			errorMessage = error.message || 'Failed to generate image';
		} finally {
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
