<script lang="ts">
	import Document from '$lib/components/Document.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

    const { document } = data;

	// Set the document mode to 'read'
	if (document && document.state) {
		document.state.mode = 'read';
	}
</script>

<Document node={document} />
