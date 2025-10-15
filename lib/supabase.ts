import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Please check your .env file.');
}

// Create client without strict typing to avoid type conflicts
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export typed version for type-safe queries
export const supabaseTyped = createClient<Database>(supabaseUrl, supabaseAnonKey);
