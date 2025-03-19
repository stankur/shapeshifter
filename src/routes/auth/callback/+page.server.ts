// import { redirect } from '@sveltejs/kit';
// import type { PageServerLoad } from './$types';

// export const load: PageServerLoad = async ({ url, locals }) => {
// 	const code = url.searchParams.get('code');

// 	// If there's no code, redirect to home page
// 	if (!code) {
// 		throw redirect(303, '/');
// 	}

// 	// Exchange the code for a session
// 	const { error } = await locals.supabase.auth.exchangeCodeForSession(code);

// 	if (error) {
// 		console.error('Error exchanging code for session:', error);
// 	}

// 	// Redirect to home page
// 	throw redirect(303, '/');
// };
