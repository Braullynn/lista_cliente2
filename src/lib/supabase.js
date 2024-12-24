import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sevxdzxtqhtewblpnufx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNldnhkenh0cWh0ZXdibHBudWZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwMjYwMjQsImV4cCI6MjA1MDYwMjAyNH0.8xgrRInJRfpDaIcH2LNNnqxj5qKLXgyC59RCuyGO9kc'

export const supabase = createClient(supabaseUrl, supabaseKey)