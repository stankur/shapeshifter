import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	// Get the session from the server
	const session = await locals.getSession();

	return {
		session,
		url: url.pathname
	};
};
