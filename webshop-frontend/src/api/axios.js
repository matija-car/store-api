import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8080/api', // Tvoj context-path je /api
});

// Automatski dodaj JWT token u zaglavlje ako postoji u localStorage-u
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;