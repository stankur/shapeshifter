<script lang="ts">
	import Document from '$lib/Document.svelte';
	import type { Document as DocumentType } from '$lib/model/document';
	import {
		simpleSection,
		nested,
		untitled,
		card,
		nestedSummary,
		sectionContainerTOC,
		sectionContainerTOCCard,
		sidebarExample
	} from '$lib/model/examples';
	import { saveDocument } from '$lib/supabase';

	let node = $state(sectionContainerTOC as DocumentType);
	let isPublishing = $state(false);
	let publishStatus = $state<{ success: boolean; message: string } | null>(null);

	async function handlePublish() {
		isPublishing = true;
		publishStatus = null;

		try {
			const result = await saveDocument(node);

			if (result.success) {
				publishStatus = {
					success: true,
					message: 'Document published successfully!'
				};
			} else {
				publishStatus = {
					success: false,
					message: 'Failed to publish document. Please try again.'
				};
			}
		} catch (error) {
			console.error('Error publishing document:', error);
			publishStatus = {
				success: false,
				message: 'An unexpected error occurred. Please try again.'
			};
		} finally {
			isPublishing = false;

			// Clear success message after 3 seconds
			if (publishStatus?.success) {
				setTimeout(() => {
					publishStatus = null;
				}, 3000);
			}
		}
	}
</script>

<div class="mb-4 flex justify-end">
	<button
		class="flex cursor-pointer items-center rounded-md bg-blue-500 p-2 text-white transition-colors duration-200 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
		on:click={handlePublish}
		disabled={isPublishing}
	>
		{#if isPublishing}
			<svg
				class="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
				></circle>
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				></path>
			</svg>
			Publishing...
		{:else}
			Publish
		{/if}
	</button>
</div>

{#if publishStatus}
	<div
		class="mb-4 rounded-md p-3 {publishStatus.success
			? 'bg-green-100 text-green-800'
			: 'bg-red-100 text-red-800'}"
	>
		{publishStatus.message}
	</div>
{/if}

<Document {node} />
