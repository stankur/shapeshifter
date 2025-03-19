import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/supabase';
import type { Document } from './model/document';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
// These will be replaced with actual environment variables
const supabaseUrl: string = PUBLIC_SUPABASE_URL;
const supabaseAnonKey: string = PUBLIC_SUPABASE_ANON_KEY;

// Browser client (for client-side operations)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Authentication methods
export async function signInWithGoogle() {
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: 'google'
	});

	return { data, error };
}

export async function signOut() {
	const { error } = await supabase.auth.signOut();
	return { error };
}

export async function getCurrentUser() {
	const {
		data: { user }
	} = await supabase.auth.getUser();
	return user;
}

export async function getSession() {
	const {
		data: { session }
	} = await supabase.auth.getSession();
	return session;
}

export async function saveDocument(document: Document) {
	try {
		const { data, error } = await supabase
			.from('documents')
			.upsert({
				document: document,
				updated_at: new Date().toISOString()
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

export async function getDocumentById(
	id: string
): Promise<{ success: boolean; document?: Document; error?: unknown }> {
	try {
		const { data, error } = await supabase
			.from('documents')
			.select('document')
			.eq('id', id)
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
