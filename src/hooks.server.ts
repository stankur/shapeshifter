import { createServerClient } from '@supabase/ssr';
import {  type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Handle Supabase auth
const handleAuth: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
		cookies: {
			get: (key) => event.cookies.get(key),
			set: (key, value, options) => {
				event.cookies.set(key, value, {
					path: '/',
					...options
				});
			},
			remove: (key, options) => {
				event.cookies.delete(key, {
					path: '/',
					...options
				});
			}
		}
	});

	// Get the session from the server
	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		return session;
	};

    console.log('handleAuth');

	return resolve(event);
};

// Export the handle function
export const handle = sequence(handleAuth);
