import api from './api';

export const diplomaService = {
  // Créer (inchangé)
  certifyDiploma: async (diplomaData: any) => {
    const response = await api.post('/diplomas', diplomaData);
    return response.data;
  },

  // Récupérer la liste (Nouveau)
  getAllDiplomas: async () => {
    const response = await api.get('/diplomas');
    return response.data;
  },

  // URL pour télécharger (pour l'utiliser dans un lien href)
  getDownloadUrl: (id: number) => {
    // Adapter le port si votre backend n'est pas sur 8080
    return `http://localhost:8080/api/diplomas/download/${id}`;
  },
  // 1. VÉRIFICATION PAR UPLOAD (Hash)
  verifyPdf: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    // Header spécifique pour l'upload de fichier
    const response = await api.post('/verification/verify', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // 2. VÉRIFICATION PAR ID (QR Code)
  verifyById: async (id: string) => {
    const response = await api.get(`/verification/${id}`);
    return response.data;
  },
  // 3. RÉVOQUER UN DIPLÔME (Bouton Rouge)
  // Appelle: POST http://localhost:8080/api/diplomas/revoke/{cne}
  revokeDiploma: async (cne: string) => {
    const response = await api.post(`/diplomas/revoke/${cne}`);
    return response.data;
  },

  // 4. RÉACTIVER UN DIPLÔME (Bouton Vert)
  // Appelle: POST http://localhost:8080/api/diplomas/reactivate/{cne}
  reactivateDiploma: async (cne: string) => {
    const response = await api.post(`/diplomas/reactivate/${cne}`);
    return response.data;
  },
  // 5. VÉRIFICATION PAR CNE (Pour le QR Code)
  verifyByCne: async (cne: string) => {
    // Appel GET http://localhost:8080/api/verification/cne/{cne}
    const response = await api.get(`/verification/cne/${cne}`);
    return response.data;
  },
  // 6. RÉCUPÉRER LES DIPLÔMES DE L'ÉTUDIANT CONNECTÉ
  getMyDiplomas: async (studentId: number) => {
    // Appel GET http://localhost:8080/api/diplomas/student/{id}
    const response = await api.get(`/diplomas/student/${studentId}`);
    return response.data;
  },
};