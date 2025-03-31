<script lang="ts">
	import { browser } from '$app/environment';
	import Document from '$lib/components/Document.svelte';
	import type { Document as DocumentType } from '$lib/model/document';
	import {
		simpleSection,
		nested,
		untitled,
		card,
		nestedSummary,
		sectionContainerTOC,
		sectionContainerDefault,
		sectionContainerTOCCard,
		sidebarExample
	} from '$lib/model/examples';
	import { saveDocument, getSession, getUserProfile } from '$lib/services/supabase/supabase';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import UsernameInput from '$lib/components/UsernameInput.svelte';
	import TitleInput from '$lib/components/TitleInput.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import GoogleIcon from '$lib/components/GoogleIcon.svelte';
	import {
		handlePublish,
		handleSignIn,
		handleSignOut
	} from '$lib/services/supabase/documentActions';
	import { page } from '$app/state';

	const supabase = page.data.supabase;

	let { data } = $props();
	let session = $state(data.session);
	let isAuthenticated = $derived(!!session);

	// Manually check for session on mount
	onMount(async () => {
		try {
			const currentSession = await getSession(supabase);
			if (currentSession) {
				console.log('Found session on mount:', currentSession);
				session = currentSession;
				invalidate('supabase:auth');
			}
		} catch (error) {
			console.error('Error checking session on mount:', error);
		}
	});

	let node = $state(nested as DocumentType);
	let isPublishing = $state(false);
	let publishStatus = $state<{ success: boolean; message: string; documentId?: string } | null>(
		null
	);
	let isSigningIn = $state(false);

	async function onPublish() {
		const publishingState = { value: isPublishing };
		const publishStatusState = { value: publishStatus };

		await handlePublish(
			data.supabase,
			node,
			publishingState,
			publishStatusState,
			session?.user?.id
		);

		isPublishing = publishingState.value;
		publishStatus = publishStatusState.value;
	}

	async function onSignIn() {
		const signingInState = { value: isSigningIn };

		await handleSignIn(supabase, signingInState, window.location.href);

		isSigningIn = signingInState.value;
	}

	async function onSignOut() {
		const sessionState = { value: session };

		await handleSignOut(supabase, sessionState);

		session = sessionState.value;
	}
</script>

<div class="mb-4 flex justify-end gap-2">
	{#if isAuthenticated && session}
		<div class="mr-2 flex items-center gap-4">
			<UsernameInput {session} {supabase} />
			<TitleInput document={node} />
			<button class="text-sm text-gray-600 underline hover:text-gray-800" onclick={onSignOut}>
				Sign out
			</button>
		</div>
		<button
			class="flex cursor-pointer items-center rounded-md bg-blue-500 p-2 text-white transition-colors duration-200 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
			onclick={onPublish}
			disabled={isPublishing}
		>
			{#if isPublishing}
				<div class="mr-2 -ml-1">
					<LoadingSpinner size="4" color="white" />
				</div>
				Publishing...
			{:else}
				Publish
			{/if}
		</button>
	{:else}
		<button
			class="flex cursor-pointer items-center rounded-md border border-gray-300 bg-white p-2 text-gray-700 transition-colors duration-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
			onclick={onSignIn}
			disabled={isSigningIn}
		>
			{#if isSigningIn}
				<div class="mr-2 -ml-1">
					<LoadingSpinner size="4" color="gray-700" />
				</div>
				Signing in...
			{:else}
				<div class="mr-2 -ml-1">
					<GoogleIcon size="5" />
				</div>
				Sign in with Google
			{/if}
		</button>
	{/if}
</div>

{#if publishStatus}
	<div
		class="mb-4 rounded-md p-3 {publishStatus.success
			? 'bg-green-100 text-green-800'
			: 'bg-red-100 text-red-800'}"
	>
		<p>{publishStatus.message}</p>
		{#if publishStatus.success && session?.user}
			{#await getUserProfile(supabase, session.user.id) then profile}
				{#if profile?.username}
					<div class="mt-2">
						<a
							href="/{profile.username}/{node.slug}"
							class="text-blue-600 hover:underline"
							target="_blank"
							rel="noopener noreferrer"
						>
							View published document
						</a>
					</div>
				{/if}
			{/await}
		{/if}
	</div>
{/if}

<Document {node} />
