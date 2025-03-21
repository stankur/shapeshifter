<!-- TitleInput.svelte -->
<script lang="ts">
	import type { Document } from '$lib/model/document';
	import slugify from 'slugify';

	let { document }: { document: Document } = $props();

	function generateSlug(title: string): string {
		return slugify(title, { lower: true, strict: true, trim: true });
	}

	function handleTitleChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const newTitle = input.value.trim();
		
		if (!newTitle) return;
		
		// Update local state only
		document.title = newTitle;
		document.slug = generateSlug(newTitle);
	}
</script>

<div class="flex items-center gap-2">
	<input
		type="text"
		placeholder="Document title"
		value={document.title}
		class="rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
		onchange={handleTitleChange}
	/>
</div>
