import type { LayoutLoad } from './$types';
import { supabase } from '$lib/supabase';

export const load: LayoutLoad = async ({ data, depends }) => {
  depends('supabase:auth');
  // Sync server-side session with the client
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  return {
    session,
    url: data.url,
  };
}; 
