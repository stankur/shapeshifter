<script lang="ts">
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabase';

	let { children, data } = $props();

	onMount(() => {
		// Set up auth state change listener to invalidate data when auth state changes
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange(() => {
			invalidate('supabase:auth');
		});

		// Clean up subscription on unmount
		return () => {
			subscription.unsubscribe();
		};
	});
</script>

{@render children()}
