import 'dotenv/config'

export const define = {
  'import.meta.env': JSON.stringify({
    VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || '',
    VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || '',
  }),
}