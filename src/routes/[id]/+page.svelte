<script lang="ts">
	import Document from '$lib/Document.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	// Set the document mode to 'read'
	if (data.document && data.document.state) {
		data.document.state.mode = 'read';
	}
</script>

<Document node={data.document} />
