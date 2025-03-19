<!-- <script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase';

	onMount(() => {
		// Handle the OAuth callback
		const handleAuthCallback = async () => {
			// The hash contains the token
			const hash = window.location.hash;

			if (hash) {
				// Exchange the code for a session
				await supabase.auth.getSession();
			}

			// Redirect back to the home page
			goto('/');
		};

		handleAuthCallback();
	});
</script>

<div class="flex h-screen w-full items-center justify-center">
	<div class="text-center">
		<h2 class="mb-2 text-xl font-semibold">Completing sign in...</h2>
		<div
			class="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
		></div>
	</div>
</div> -->
