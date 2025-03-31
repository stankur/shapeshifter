<script lang="ts">
	import Document from '$lib/components/Document.svelte';
	import type { Document as DocumentType } from '$lib/model/document';
	import {
		getUserProfile,
		getDocumentBySlugForCurrentUser
	} from '$lib/services/supabase/supabase.js';
	import { page } from '$app/state';
	import { goto, invalidate } from '$app/navigation';
	import UsernameInput from '$lib/components/UsernameInput.svelte';
	import TitleInput from '$lib/components/TitleInput.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import GoogleIcon from '$lib/components/GoogleIcon.svelte';
	import { createDocumentState } from '$lib/services/documentState.svelte.js';
	import { onMount } from 'svelte';

	let { data } = $props();
	// Use the shared document state management
	const {
		state: documentState,
		getIsAuthenticated,
		initializeSession,
		onPublish: handlePublish,
		onSignIn,
		onSignOut
	} = createDocumentState(data.supabase, data.session);

	// Initialize session on mount
	initializeSession();

	let document: DocumentType | null = $state(null);
	let loadError: { status: number; message: string } | null = $state(null);
	let slug = $state(data.slug);

	let isLoadingDocument = $state(false);

	// Get the supabase client from the layout data
	const supabase = $derived(page.data.supabase);

	// When the session changes (e.g., after onMount in layout), try to load the document
	$effect(() => {
		console.log('Effect running - session:', documentState.session);
		console.log('Effect running - isAuthenticated:', getIsAuthenticated());
		console.log('Effect running - document:', document);

		if (getIsAuthenticated() && documentState.session && !document && !isLoadingDocument) {
			loadDocument();
		}
	});

	// Function to load the document when session becomes available
	async function loadDocument() {
		console.log('Loading document for slug:', slug);

		isLoadingDocument = true;

		try {
			const result = await getDocumentBySlugForCurrentUser(
				supabase,
				slug,
				documentState.session?.user?.id as string
			);

			if (result.success && result.document) {
				document = result.document;

				// Ensure document is in write mode
				if (document && document.state) {
					document.state.mode = 'write';
				}

				loadError = null;
			} else {
				loadError = {
					status: 404,
					message: 'Document not found or you do not have permission to edit it'
				};
			}
		} catch (err) {
			console.error('Error loading document:', err);
			loadError = {
				status: 500,
				message: 'An error occurred while loading the document'
			};
		} finally {
			isLoadingDocument = false;
		}
	}

	// Wrapper for publish to pass the document
	function onPublish() {
		if (!document) return;
		handlePublish(document);
	}
</script>

<!-- Loading state -->
{#if isLoadingDocument}
	<div class="flex flex-col items-center justify-center py-12">
		<LoadingSpinner size="12" color="blue-500" />
		<p class="mt-4 text-lg text-gray-600">Loading document...</p>
	</div>
{:else if loadError}
	<!-- Error state -->
	<div class="mb-4 rounded-md bg-red-100 p-4 text-red-800">
		<h2 class="text-lg font-semibold">Error {loadError.status}</h2>
		<p>{loadError.message}</p>
		<button
			class="mt-4 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
			onclick={() => goto('/')}
		>
			Return to Home
		</button>
	</div>
{:else}
	<!-- Document editor UI -->
	<div class="mb-4 flex justify-end gap-2">
		{#if getIsAuthenticated() && documentState.session}
			<div class="mr-2 flex items-center gap-4">
				<UsernameInput session={documentState.session} supabase={supabase} />
				{#if document}
					<TitleInput {document} />
				{/if}
				<button class="text-sm text-gray-600 underline hover:text-gray-800" onclick={onSignOut}>
					Sign out
				</button>
			</div>
			<button
				class="flex cursor-pointer items-center rounded-md bg-blue-500 p-2 text-white transition-colors duration-200 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
				onclick={onPublish}
				disabled={documentState.isPublishing || !document}
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
			{#if documentState.publishStatus.success && documentState.session?.user && document}
				{#await getUserProfile(supabase, documentState.session.user.id) then profile}
					{#if profile?.username}
						<div class="mt-2">
							<a
								href="/{profile.username}/{document.slug}"
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

	{#if document}
		<Document node={document} />
	{/if}
{/if}

{#if !getIsAuthenticated()}
	<p>Please sign in to edit this document</p>
{/if}
