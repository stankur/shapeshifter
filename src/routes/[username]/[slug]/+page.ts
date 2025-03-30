import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getDocumentByUsernameAndSlug } from '$lib/utils/supabase';

export const load: PageLoad = async ({ params }) => {
	const { username, slug } = params;

	const result = await getDocumentByUsernameAndSlug(username, slug);

	if (!result.success || !result.document) {
		throw error(404, {
			message: 'Document not found'
		});
	}

	return {
		document: result.document
	};
};
