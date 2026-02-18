import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Create a Supabase client authenticated with the user's JWT from the request.
 * Returns { client, userId } or { client: null, userId: null } if not authenticated.
 */
export async function getAuthenticatedClient(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return { client: null, userId: null };
  }

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: { Authorization: `Bearer ${token}` },
    },
  });

  const { data: { user }, error } = await client.auth.getUser(token);

  if (error || !user) {
    return { client: null, userId: null };
  }

  return { client, userId: user.id };
}
