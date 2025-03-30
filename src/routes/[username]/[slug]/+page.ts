import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getDocumentByUsernameAndSlug } from '$lib/services/supabase/supabase';

export const load: PageLoad = async ({ params, parent }) => {
	const { username, slug } = params;
    const { supabase } = await parent();

	const result = await getDocumentByUsernameAndSlug(supabase, username, slug);

	if (!result.success || !result.document) {
		throw error(404, {
			message: 'Document not found'
		});
	}

	return {
		document: result.document
	};
};
