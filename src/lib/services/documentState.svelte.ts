import { getSession } from '$lib/services/supabase/supabase';
import { invalidate } from '$app/navigation';
import type { Document } from '$lib/model/document';
import { handlePublish, handleSignIn, handleSignOut } from '$lib/services/supabase/documentActions';
import type { SupabaseClient, Session } from '@supabase/supabase-js';
import { onMount } from 'svelte';

type PublishStatus = {
	success: boolean;
	message: string;
};

type State = {
	session: Session | null;
	isPublishing: boolean;
	publishStatus: PublishStatus | null;
	isSigningIn: boolean;
};

/**
 * Create shared document state and actions that can be used across multiple pages
 */
export function createDocumentState(
	supabase: SupabaseClient,
	initialSession: Session | null = null
) {
	const state = $state<State>({
		session: initialSession,
		isPublishing: false,
		publishStatus: null,
		isSigningIn: false
	});

	const isAuthenticated = $derived(!!state.session);

    const getIsAuthenticated = () => {
        return isAuthenticated;
    }

	// Initialize session on mount
	const initializeSession = () => {
		onMount(async () => {
			try {
				const currentSession = await getSession(supabase);
				if (currentSession) {
					console.log('Found session on mount:', currentSession);
					state.session = currentSession;
					invalidate('supabase:auth');
				}
			} catch (error) {
				console.error('Error checking session on mount:', error);
			}
		});
	};

	// Wrapper functions that update the local state
	const onPublish = async (document: Document) => {
		state.isPublishing = true;

		// Call the handler and get the result
		const result = await handlePublish(supabase, document, state.session?.user?.id);

		// Update reactive state with the result
		state.isPublishing = false;
        
		state.publishStatus = {
			success: result.success,
			message: result.success ? 'Document published successfully' : result.error || ''
		};

		// Handle auto-clearing of success message
		if (result.success) {
			setTimeout(() => {
				state.publishStatus = null;
			}, 3000);
		}
	};

	const onSignIn = async (redirectUrl: string = window.location.href) => {
		// Set signing in state immediately for UI feedback
		state.isSigningIn = true;

		await handleSignIn(supabase, redirectUrl);

		state.isSigningIn = false;
	};

	const onSignOut = async () => {
		// Call the handler and get the result
		const result = await handleSignOut(supabase);

		if (result.success) {
			state.session = null;
		}
	};

	return {
		state,
		getIsAuthenticated,
		// Actions
		initializeSession,
		onPublish,
		onSignIn,
		onSignOut
	};
}
