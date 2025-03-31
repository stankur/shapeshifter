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
	import { saveDocument, getUserProfile } from '$lib/services/supabase/supabase';
	import { createDocumentState } from '$lib/services/documentState.svelte.js';
	import UsernameInput from '$lib/components/UsernameInput.svelte';
	import TitleInput from '$lib/components/TitleInput.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import GoogleIcon from '$lib/components/GoogleIcon.svelte';
	import { page } from '$app/state';

	const supabase = page.data.supabase;

	let { data } = $props();
	// Use the shared document state management
	const {
		state: documentState,
		getIsAuthenticated,
		initializeSession,
		onPublish: handlePublish,
		onSignIn,
		onSignOut
	} = createDocumentState(supabase, data.session);

	// Initialize session on mount
	initializeSession();

	let node = $state(nested as DocumentType);

	// Wrapper for publish to pass the document
	function onPublish() {
		handlePublish(node);
	}
</script>

<div class="mb-4 flex justify-end gap-2">
	{#if getIsAuthenticated() && documentState.session}
		<div class="mr-2 flex items-center gap-4">
			<UsernameInput session={documentState.session} supabase={supabase} />
			<TitleInput document={node} />
			<button class="text-sm text-gray-600 underline hover:text-gray-800" onclick={onSignOut}>
				Sign out
			</button>
		</div>
		<button
			class="flex cursor-pointer items-center rounded-md bg-blue-500 p-2 text-white transition-colors duration-200 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
			onclick={onPublish}
			disabled={documentState.isPublishing}
		>
			{#if documentState.isPublishing}
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
			onclick={() => onSignIn()}
			disabled={documentState.isSigningIn}
		>
			{#if documentState.isSigningIn}
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

{#if documentState.publishStatus}
	<div
		class="mb-4 rounded-md p-3 {documentState.publishStatus.success
			? 'bg-green-100 text-green-800'
			: 'bg-red-100 text-red-800'}"
	>
		<p>{documentState.publishStatus.message}</p>
		{#if documentState.publishStatus.success && documentState.session?.user}
			{#await getUserProfile(supabase, documentState.session.user.id) then profile}
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
