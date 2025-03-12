import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getDocumentById } from '$lib/supabase';

export const load: PageLoad = async ({ params }) => {
	const { id } = params;

	const result = await getDocumentById(id);

	if (!result.success || !result.document) {
		throw error(404, {
			message: 'Document not found'
		});
	}

	return {
		document: result.document
	};
};
