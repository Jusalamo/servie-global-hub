// Servie Supabase Client Configuration
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/integrations/supabase/types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xieazmtvtlvexadbzoni.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpZWF6bXR2dGx2ZXhhZGJ6b25pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MDg2NTYsImV4cCI6MjA2MDA4NDY1Nn0.ikz-UI5uNJ8rZFHLAvPkxRmXtUDm8TVm_HNbBqD97v0'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'servie-auth',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
})

// Export types for easy import
export type { Database } from '@/integrations/supabase/types'