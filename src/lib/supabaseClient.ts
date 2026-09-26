import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://slqfsqfsrrjnczrfxskc.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNscWZzcWZzcnJqbmN6cmZ4c2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMjc2MTcsImV4cCI6MjA5NTcwMzYxN30.0ijDrYRRDcjDbleEIElxSruL9fMivOMESAuxJB2KwCY';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseAnonKey !== 'your_anon_key_here'
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

