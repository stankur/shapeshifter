import type { Document } from '$lib/model/document';
import { saveDocument } from '$lib/services/supabase/supabase';
import { invalidate } from '$app/navigation';
import type { SupabaseClient } from '@supabase/supabase-js';

// Handle document publishing
export async function handlePublish(
	document: Document,
	isPublishing: { value: boolean },
	publishStatus: {
		value: { success: boolean; message: string; documentId?: string } | null;
	},
	userId?: string
): Promise<void> {
	isPublishing.value = true;
	publishStatus.value = null;

	// Validate title
	if (!document.title?.trim()) {
		publishStatus.value = {
			success: false,
			message: 'Please enter a document title'
		};
		isPublishing.value = false;
		return;
	}

	try {
		const result = await saveDocument(document, userId);

		if (result.success) {
			const documentId = result.data?.id;
			publishStatus.value = {
				success: true,
				message: 'Document published successfully!',
				documentId
			};
		} else {
			publishStatus.value = {
				success: false,
				message:
					typeof result.error === 'string'
						? result.error
						: 'Failed to publish document. Please try again.'
			};
		}
	} catch (error) {
		console.error('Error publishing document:', error);
		publishStatus.value = {
			success: false,
			message: 'An unexpected error occurred. Please try again.'
		};
	} finally {
		isPublishing.value = false;

		// Clear success message after 3 seconds
		if (publishStatus.value?.success) {
			setTimeout(() => {
				publishStatus.value = null;
			}, 3000);
		}
	}
}

// Handle sign in
export async function handleSignIn(supabase: SupabaseClient, isSigningIn: { value: boolean }, redirectTo: string) {
	isSigningIn.value = true;
	try {
		await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: redirectTo
			}
		});
	} catch (error) {
		console.error('Error signing in:', error);
	} finally {
		isSigningIn.value = false;
	}
}

// Handle sign out
export async function handleSignOut(supabase: SupabaseClient, session: { value: null | object }) {
	try {
		await supabase.auth.signOut();
		session.value = null; // Directly clear the session state
		invalidate('supabase:auth');
	} catch (error) {
		console.error('Error signing out:', error);
	}
}
