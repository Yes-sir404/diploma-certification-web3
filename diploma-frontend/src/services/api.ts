import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL as string;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- INTERCEPTEUR (Le "Douanier") ---
// Avant chaque requête, on vérifie si un token ou un utilisateur est stocké
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Pour l'Admin (si JWT)

    
    // Si on a un token Admin, on l'ajoute
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;