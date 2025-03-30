<!-- UsernameInput.svelte -->
<script lang="ts">
	import { getUserProfile, updateUsername } from '$lib/services/supabase/supabase';
	import type { Session } from '@supabase/supabase-js';
	import type { SupabaseClient } from '@supabase/supabase-js';
    
	let { session, supabase } = $props<{ session: Session, supabase: SupabaseClient }>();
	let username = $state('');
	let usernameError = $state('');
	let isSavingUsername = $state(false);

	async function loadUsername() {
		if (session?.user?.id) {
			try {
				const profile = await getUserProfile(supabase, session.user.id);
				username = profile?.username || '';
			} catch (error) {
				console.error('Error loading username:', error);
			}
		}
	}

	async function handleUsernameChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const newUsername = input.value.trim();
		usernameError = '';
		
		if (!newUsername) return;
		
		isSavingUsername = true;
		try {
			const result = await updateUsername(supabase, session.user.id, newUsername);
			if (!result.success) {
				usernameError = result.error || 'Failed to update username';
			} else {
				username = newUsername;
			}
		} catch (error) {
			console.error('Error updating username:', error);
			usernameError = 'An unexpected error occurred';
		} finally {
			isSavingUsername = false;
		}
	}

	$effect(() => {
		if (session?.user?.id) {
			loadUsername();
		} else {
			username = '';
			usernameError = '';
		}
	});
</script>

<div class="flex items-center gap-2">
	<input
		type="text"
		placeholder="Set username"
		value={username}
		class="rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none {usernameError ? 'border-red-500' : ''}"
		onchange={handleUsernameChange}
		disabled={isSavingUsername}
	/>
	{#if isSavingUsername}
		<span class="text-sm text-gray-500">Saving...</span>
	{:else if usernameError}
		<span class="text-sm text-red-500">{usernameError}</span>
	{/if}
</div>
