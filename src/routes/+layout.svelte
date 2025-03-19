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
			if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
				console.log('Invalidating auth state due to event:', event);
				invalidate('supabase:auth');
			} else if (event === 'INITIAL_SESSION' && newSession) {
				// Only invalidate if we have a session with INITIAL_SESSION
				console.log('Invalidating auth state due to initial session with data');
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

{@render children()}
