import type { Document } from '$lib/model/document';
import { saveDocument } from '$lib/services/supabase/supabase';
import { invalidate } from '$app/navigation';
import type { SupabaseClient } from '@supabase/supabase-js';

export type Result = {
	success: boolean;
	error?: string;
};

// Handle document publishing
export async function handlePublish(
	supabase: SupabaseClient,
	document: Document,
	userId?: string
): Promise<Result> {
	// Validate title
	if (!document.title?.trim()) {
		return {
			success: false,
			error: 'Please enter a document title'
		};
	}

	try {
		console.log('handling publish with document: ', document);
		console.log('handling publish with userId: ', userId);
		const result = await saveDocument(supabase, document, userId);

		if (result.success) {
			return {
				success: true
			};
		} else {
			return {
				success: false,
				error: result.error as string
			};
		}
	} catch (error) {
		return {
			success: false,
			error: (error as Error).message || 'An unknown error occurred'
		};
	}
}

// Handle sign in
export async function handleSignIn(supabase: SupabaseClient, redirectTo: string): Promise<Result> {
	try {
		await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: redirectTo
			}
		});
	} catch (error) {
		console.error('Error signing in:', error);
		return {
			success: false,
			error: (error as Error).message
		};
	}

	return {
		success: true
	};
}

// Handle sign out
export async function handleSignOut(supabase: SupabaseClient): Promise<Result> {
	try {
		await supabase.auth.signOut();
		invalidate('supabase:auth');
	} catch (error) {
		console.error('Error signing out:', error);
		return {
			success: false,
			error: (error as Error).message
		};
	}

	return {
		success: true
	};
}
