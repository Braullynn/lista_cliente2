import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from "@/hooks/use-toast";
import { Plus, Search } from 'lucide-react';
import ClientsTable from '@/components/ClientsTable';
import ClientForm from '@/components/ClientForm';
import { initializeDatabase } from '@/lib/database';
import { Client, NewClient } from '@/types/client';

const Welcome = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  useEffect(() => {
    initializeDatabase();
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar clientes",
        description: error.message,
      });
    } else {
      setClients(data || []);
    }
  };

  const handleAddClient = async (newClient: NewClient) => {
    const { data, error } = await supabase
      .from('clients')
      .insert([newClient])
      .select();

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar cliente",
        description: error.message,
      });
    } else {
      toast({
        variant: "success",
        title: "Sucesso!",
        description: "Cliente adicionado com sucesso!",
      });
      fetchClients();
    }
  };

  const handleEditClient = async (updatedClient: NewClient) => {
    if (!editingClient?.id) return;

    const { error } = await supabase
      .from('clients')
      .update(updatedClient)
      .eq('id', editingClient.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao editar cliente",
        description: error.message,
      });
    } else {
      toast({
        variant: "success",
        title: "Sucesso!",
        description: "Cliente atualizado com sucesso!",
      });
      setEditingClient(null);
      fetchClients();
    }
  };

  const handleDeleteClient = async (id: number) => {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao deletar cliente",
        description: error.message,
      });
    } else {
      toast({
        variant: "success",
        title: "Sucesso!",
        description: "Cliente removido com sucesso!",
      });
      fetchClients();
    }
  };

  const filteredClients = clients.filter(client => {
    const searchLower = searchTerm.toLowerCase();
    return (
      client.id?.toString().includes(searchTerm) ||
      client.name?.toLowerCase().includes(searchLower) ||
      client.email?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Catálogo de Clientes</h1>
          <Button onClick={logout} variant="outline">
            Sair
          </Button>
        </div>

        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, número ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setIsAddingClient(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" /> Adicionar Cliente
            </Button>
          </div>

          <div className="bg-card rounded-lg shadow">
            <ClientsTable
              clients={filteredClients}
              onEdit={setEditingClient}
              onDelete={handleDeleteClient}
            />
          </div>
        </div>
      </div>

      <ClientForm
        open={isAddingClient}
        onOpenChange={setIsAddingClient}
        onSubmit={handleAddClient}
        title="Adicionar Novo Cliente"
      />

      <ClientForm
        open={!!editingClient}
        onOpenChange={(open) => !open && setEditingClient(null)}
        onSubmit={handleEditClient}
        initialData={editingClient || undefined}
        title="Editar Cliente"
      />
    </div>
  );
};

export default Welcome;