import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/supabase';
import type { Document } from './model/document';

// These will be replaced with actual environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

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
