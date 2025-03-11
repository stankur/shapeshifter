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
			.select();

		if (error) throw error;

		return { success: true, data };
	} catch (error) {
		console.error('Error saving document:', error);
		return { success: false, error };
	}
}
