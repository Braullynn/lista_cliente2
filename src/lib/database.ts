import { supabase } from './supabase';

export async function initializeDatabase() {
  const { data: existingTable, error: checkError } = await supabase
    .from('clients')
    .select('*')
    .limit(1);

  if (checkError && checkError.code === '42P01') {
    const { error: createError } = await supabase.rpc('create_clients_table');
    if (createError) {
      console.error('Error creating clients table:', createError);
    }
  }
}