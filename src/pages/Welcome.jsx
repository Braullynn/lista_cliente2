import React from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';

const Welcome = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 p-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Bem-vindo!</h1>
        <p className="text-lg text-gray-600">
          {user?.email}
        </p>
        <Button onClick={logout}>
          Sair
        </Button>
      </div>
    </div>
  );
};

export default Welcome;