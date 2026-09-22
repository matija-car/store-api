import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Automatski dodaj JWT token u zaglavlje ako postoji u localStorage-u
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const refreshToken = localStorage.getItem('refreshToken');
        const isAuthRequest = originalRequest?.url?.startsWith('/auth/');

        if (
            error.response?.status !== 401
            || originalRequest?._retry
            || originalRequest?.url?.includes('/auth/refresh')
            || isAuthRequest
            || !refreshToken
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            const response = await API.post('/auth/refresh', { refreshToken });
            const {
                token,
                refreshToken: replacementRefreshToken,
                id,
                name,
                email,
                role,
            } = response.data;
            const user = { id, name, email, role };

            localStorage.setItem('token', token);
            if (replacementRefreshToken) {
                localStorage.setItem('refreshToken', replacementRefreshToken);
            }
            localStorage.setItem('user', JSON.stringify(user));

            originalRequest.headers.Authorization = `Bearer ${token}`;
            return API(originalRequest);
        } catch (refreshError) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.assign('/login');
            return Promise.reject(refreshError);
        }
    },
);

export default API;