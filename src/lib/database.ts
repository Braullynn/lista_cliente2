import { supabase } from './supabase';

export async function initializeDatabase() {
  // Primeiro, verifica se a tabela já existe
  const { data: existingTable, error: checkError } = await supabase
    .from('clients')
    .select('*')
    .limit(1);

  if (checkError && checkError.code === '42P01') {
    // Se a tabela não existir, cria ela usando uma função RPC do Supabase
    const { error: createError } = await supabase.rpc('create_clients_table');
    
    if (createError) {
      console.error('Erro ao criar tabela de clientes:', createError);
    }
  }
}