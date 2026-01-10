import axios from 'axios';

// On pointe vers votre Backend Spring Boot
const API_URL = 'http://localhost:8080/api';

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