import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react'; // <--- CORRECTION ICI (Import séparé pour le type)
import { authService } from '../services/authService';

// On définit à quoi ressemble notre contexte
interface AuthContextType {
  user: any | null;
  role: string | null;
  isAuthenticated: boolean;
  login: (userData: any, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);

  // Au chargement de la page (F5), on vérifie si on est déjà connecté
  useEffect(() => {
    const storedUser = authService.getCurrentUser();
    const storedRole = authService.getRole();
    
    if (storedUser || storedRole === 'ADMIN') {
      setUser(storedUser);
      setRole(storedRole);
    }
  }, []);

  const login = (userData: any, newRole: string) => {
    setUser(userData);
    setRole(newRole);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      role, 
      isAuthenticated: !!role, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};