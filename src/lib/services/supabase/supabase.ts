import { createClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/supabase';
import type { Document } from '$lib/model/document';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
// These will be replaced with actual environment variables
const supabaseUrl: string = PUBLIC_SUPABASE_URL;
const supabaseAnonKey: string = PUBLIC_SUPABASE_ANON_KEY;

// Browser client (for client-side operations)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export async function getUserProfile(userId: string) {
	const { data, error } = await supabase
		.from('profiles')
		.select('username')
		.eq('id', userId)
		.single();

	if (error) throw error;
	return data;
}

export async function updateUsername(userId: string, username: string) {
	// First check if username is taken
	const { data: existing } = await supabase
		.from('profiles')
		.select('id')
		.eq('username', username)
		.not('id', 'eq', userId)
		.single();

	if (existing) {
		return { success: false, error: 'Username already taken' };
	}

	const { error } = await supabase
		.from('profiles')
		.upsert({ username, id: userId, updated_at: new Date().toISOString() });

	if (error) {
		return { success: false, error: error.message };
	}

	return { success: true };
}

export async function getSession() {
	const {
		data: { session }
	} = await supabase.auth.getSession();
	console.log('session in getSession: ', session);
	return session;
}

export async function saveDocument(document: Document, userId?: string) {
	try {
		let user_id: string;

		// If userId is provided, use it directly
		if (userId) {
			user_id = userId;
		} else {
			// Otherwise, try to get the current user
			const {
				data: { user }
			} = await supabase.auth.getUser();

			if (!user) {
				return { success: false, error: 'User not authenticated' };
			}

			user_id = user.id;
		}

		const { data, error } = await supabase
			.from('documents')
			.upsert({
				id: document.id,
				document: document,
				updated_at: new Date().toISOString(),
				user_id: user_id,
				slug: document.slug // Save slug in the table for easier querying
			})
			.select('id')
			.single();

		if (error) throw error;

		return { success: true, data };
	} catch (error) {
		console.error('Error saving document:', error);
		return { success: false, error };
	}
}

export async function getDocumentByUsernameAndSlug(
	username: string,
	slug: string
): Promise<{ success: boolean; document?: Document; error?: unknown }> {
	try {
		// First get the user_id from the username
		const { data: profileData, error: profileError } = await supabase
			.from('profiles')
			.select('id')
			.eq('username', username)
			.single();

		if (profileError) throw profileError;

		if (!profileData) {
			return { success: false, error: 'User not found' };
		}

		// Then get the document with the matching user_id and slug
		const { data, error } = await supabase
			.from('documents')
			.select('document')
			.eq('user_id', profileData.id)
			.eq('slug', slug)
			.single();

		if (error) throw error;

		if (!data) {
			return { success: false, error: 'Document not found' };
		}

		return { success: true, document: data.document as Document };
	} catch (error) {
		console.error('Error fetching document:', error);
		return { success: false, error };
	}
}

export async function getDocumentBySlugForCurrentUser(
	slug: string,
	userId: string
): Promise<{ success: boolean; document?: Document; error?: unknown }> {
	try {
		// Get the document with the matching user_id and slug
		const { data, error } = await supabase
			.from('documents')
			.select('document')
			.eq('user_id', userId)
			.eq('slug', slug)
			.single();

		if (error) throw error;

		if (!data) {
			return { success: false, error: 'Document not found' };
		}

		return { success: true, document: data.document as Document };
	} catch (error) {
		console.error('Error fetching document for current user:', error);
		return { success: false, error };
	}
}
