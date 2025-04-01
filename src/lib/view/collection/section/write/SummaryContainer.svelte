<script>
	import { onMount } from 'svelte';

	onMount(() => {
		console.log('SummaryContainer mounted');
	});
</script>

<div class="border border-gray-300">
    <div class="p-1 text-xs bg-gray-300 text-white">
        Summary
    </div>
	<div class=" p-2 text-sm text-gray-500">
		<slot></slot>
	</div>
</div>
