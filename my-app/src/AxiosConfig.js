// AxiosConfig.js

import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://127.0.0.1:8000';

// Ajouter l'intercepteur pour gérer les erreurs de réponse Axios
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        console.error('Erreur Axios :', error);
        return Promise.reject(error);
    }
);

export default axios;

