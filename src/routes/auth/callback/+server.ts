import { redirect } from '@sveltejs/kit';

export const GET = async (event) => {
	console.log('callback');
	const {
		url,
		locals: { supabase }
	} = event;
	console.log('hello');
	const code = url.searchParams.get('code') as string;
	const next = url.searchParams.get('next') ?? '/';

	if (code) {
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		if (!error) {
			console.log('redirecting to', `/${next.slice(1)}`);
			console.log('code', code);
			throw redirect(303, '/auth/auth-code-error');
		}
	}

	// return the user to an error page with instructions
	throw redirect(303, '/');
};
