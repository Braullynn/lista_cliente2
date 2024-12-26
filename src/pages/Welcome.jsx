import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { initializeDatabase } from '@/lib/database';

const Welcome = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: ''
  });

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

  const handleAddClient = async () => {
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
        title: "Cliente adicionado com sucesso!",
        description: "O novo cliente foi cadastrado.",
      });
      setIsAddingClient(false);
      setNewClient({ name: '', email: '', phone: '' });
      fetchClients();
    }
  };

  const handleEditClient = async (id, updatedData) => {
    const { error } = await supabase
      .from('clients')
      .update(updatedData)
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao editar cliente",
        description: error.message,
      });
    } else {
      toast({
        title: "Cliente atualizado com sucesso!",
        description: "As informações foram atualizadas.",
      });
      fetchClients();
    }
  };

  const handleDeleteClient = async (id) => {
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
        title: "Cliente removido com sucesso!",
        description: "O cliente foi removido do sistema.",
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
            <Input
              placeholder="Buscar por nome, número ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
              icon={<Search className="w-4 h-4" />}
            />
            <Dialog open={isAddingClient} onOpenChange={setIsAddingClient}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" /> Adicionar Cliente
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Cliente</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Input
                    placeholder="Nome"
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  />
                  <Input
                    placeholder="Email"
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  />
                  <Input
                    placeholder="Telefone"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  />
                  <Button onClick={handleAddClient} className="w-full">
                    Adicionar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-card rounded-lg shadow">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">ID</th>
                  <th className="text-left p-4">Nome</th>
                  <th className="text-left p-4">Email</th>
                  <th className="text-left p-4">Telefone</th>
                  <th className="text-right p-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.id} className="border-b last:border-0">
                    <td className="p-4">{client.id}</td>
                    <td className="p-4">{client.name}</td>
                    <td className="p-4">{client.email}</td>
                    <td className="p-4">{client.phone}</td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClient(client.id, client)}
                        className="mr-2"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClient(client.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;