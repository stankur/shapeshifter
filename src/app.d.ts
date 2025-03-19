// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { SupabaseClient, Session } from '@supabase/supabase-js';
import type { Database } from '$lib/types/supabase';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient<Database>;
			getSession: () => Promise<Session | null>;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
