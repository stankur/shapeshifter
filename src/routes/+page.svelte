<script lang="ts">
	import { browser } from '$app/environment';
	import Document from '$lib/Document.svelte';
	import type { Document as DocumentType } from '$lib/model/document';
	import {
		simpleSection,
		nested,
		untitled,
		card,
		nestedSummary,
		sectionContainerTOC,
		sectionContainerTOCCard,
		sidebarExample
	} from '$lib/model/examples';
	import { saveDocument, signInWithGoogle, signOut, getSession, supabase } from '$lib/supabase';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';

	let { data } = $props();
	let session = $state(data.session);
	let isAuthenticated = $derived(!!session);

	// Manually check for session on mount
	onMount(async () => {
		try {
			const currentSession = await getSession();
			if (currentSession) {
				console.log('Found session on mount:', currentSession);
				session = currentSession;
				invalidate('supabase:auth');
			}
		} catch (error) {
			console.error('Error checking session on mount:', error);
		}
	});

	let node = $state(sectionContainerTOC as DocumentType);
	let isPublishing = $state(false);
	let publishStatus = $state<{ success: boolean; message: string; documentId?: string } | null>(
		null
	);
	let isSigningIn = $state(false);

	async function handlePublish() {
		isPublishing = true;
		publishStatus = null;

		try {
			const result = await saveDocument(node);

			if (result.success) {
				const documentId = result.data?.id;
				publishStatus = {
					success: true,
					message: 'Document published successfully!',
					documentId
				};
			} else {
				publishStatus = {
					success: false,
					message: 'Failed to publish document. Please try again.'
				};
			}
		} catch (error) {
			console.error('Error publishing document:', error);
			publishStatus = {
				success: false,
				message: 'An unexpected error occurred. Please try again.'
			};
		} finally {
			isPublishing = false;

			// Clear success message after 3 seconds
			if (publishStatus?.success) {
				setTimeout(() => {
					publishStatus = null;
				}, 3000);
			}
		}
	}

	async function handleSignIn() {
		isSigningIn = true;
		try {
			 await signInWithGoogle();
		} catch (error) {
			console.error('Error signing in:', error);
		} finally {
			isSigningIn = false;
		}
	}

	async function handleSignOut() {
		try {
			await signOut();
			session = null; // Directly clear the session state
		} catch (error) {
			console.error('Error signing out:', error);
		}
	}
</script>

<div class="mb-4 flex justify-end gap-2">
	{#if isAuthenticated && session}
		<div class="mr-2 flex items-center">
			<span class="mr-2 text-sm text-gray-600">Signed in as {session.user.email}</span>
			<button class="text-sm text-gray-600 underline hover:text-gray-800" on:click={handleSignOut}>
				Sign out
			</button>
		</div>
		<button
			class="flex cursor-pointer items-center rounded-md bg-blue-500 p-2 text-white transition-colors duration-200 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
			on:click={handlePublish}
			disabled={isPublishing}
		>
			{#if isPublishing}
				<svg
					class="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
				Publishing...
			{:else}
				Publish
			{/if}
		</button>
	{:else}
		<button
			class="flex cursor-pointer items-center rounded-md border border-gray-300 bg-white p-2 text-gray-700 transition-colors duration-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
			on:click={handleSignIn}
			disabled={isSigningIn}
		>
			{#if isSigningIn}
				<svg
					class="mr-2 -ml-1 h-4 w-4 animate-spin text-gray-700"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
				Signing in...
			{:else}
				<svg class="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
					<path
						fill="#FFC107"
						d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
					></path>
					<path
						fill="#FF3D00"
						d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
					></path>
					<path
						fill="#4CAF50"
						d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
					></path>
					<path
						fill="#1976D2"
						d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
					></path>
				</svg>
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
		{#if publishStatus.success && publishStatus.documentId}
			<div class="mt-2">
				<a
					href="/{publishStatus.documentId}"
					class="text-blue-600 hover:underline"
					target="_blank"
					rel="noopener noreferrer"
				>
					View published document
				</a>
			</div>
		{/if}
	</div>
{/if}

<Document {node} />
