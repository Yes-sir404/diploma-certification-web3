import api from './api';

// Définition des types (TypeScript nous aide à ne pas faire d'erreurs)
export interface LoginRequest {
  cne: string;
  password: string;
}

export interface AdminLoginRequest {
  walletAddress: string;
}

export const authService = {
  // 1. Connexion Étudiant (CNE + Password)
  loginStudent: async (credentials: LoginRequest) => {
    // Appelle Spring Boot: POST /api/auth/login
    const response = await api.post('/auth/login', credentials);
    
    // Si ça marche, on sauvegarde l'utilisateur dans le navigateur
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('role', 'STUDENT');
    }
    return response.data;
  },

  // 2. Connexion Admin (Wallet MetaMask)
  loginAdmin: async (walletAddress: string) => {
    // Appelle Spring Boot: POST /api/auth/admin-login
    const response = await api.post('/auth/admin-login', { walletAddress });
    
    // Si ça marche, on sauvegarde le token simule
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', 'ADMIN');
    }
    return response.data;
  },

  // 3. Déconnexion (On vide la mémoire)
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    // On recharge la page pour remettre à zéro l'état
    window.location.href = '/login';
  },

  // 4. Vérifier qui est connecté
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  getRole: () => {
    return localStorage.getItem('role');
  }
};