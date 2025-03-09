<script lang="ts">
	import Document from '$lib/Document.svelte';
	import type { Document as DocumentType } from '$lib/model/document';
	import { simpleSection, nested, untitled, card, nestedSummary, sectionContainerTOC, sectionContainerTOCCard, sidebarExample } from '$lib/model/examples';

	let node = $state(sectionContainerTOC as DocumentType);
</script>

<Document {node} />
