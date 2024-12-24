import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Por favor, insira um email válido");
    }
    
    // Não permitir emails de exemplo/teste
    const blockedDomains = ['example.com', 'test.com'];
    const domain = email.split('@')[1];
    if (blockedDomains.includes(domain)) {
      throw new Error("Por favor, use um email válido. Emails de exemplo não são permitidos.");
    }
  };

  const login = async (email, password) => {
    try {
      validateEmail(email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Login realizado com sucesso!",
        description: "Você será redirecionado para a página inicial.",
      });

      navigate('/welcome');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: error.message,
      });
    }
  };

  const register = async (email, password) => {
    try {
      validateEmail(email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Verifique seu email para confirmar o cadastro.",
      });
    } catch (error) {
      let errorMessage = error.message;
      
      // Melhor tratamento para erros específicos
      if (error.message.includes('email_address_invalid')) {
        errorMessage = "O email fornecido é inválido. Por favor, use um email válido.";
      }
      
      toast({
        variant: "destructive",
        title: "Erro ao fazer cadastro",
        description: errorMessage,
      });
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};