<script>
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	let { data, children } = $props();
	let { session, supabase } = $derived(data);

	onMount(() => {
		// Handle auth state changes
		const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
			console.log('Auth state changed:', event, newSession);

			// Only invalidate on meaningful state changes
			if (
				event === 'SIGNED_IN' ||
				event === 'SIGNED_OUT' ||
				event === 'USER_UPDATED' ||
				(event === 'INITIAL_SESSION' && newSession) ||
				newSession?.expires_at !== session?.expires_at
			) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

{@render children()}
