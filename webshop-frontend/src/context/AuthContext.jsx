import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

function readStoredUser() {
    try {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    } catch {
        localStorage.removeItem('user');
        return null;
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(readStoredUser);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
            setUser(null);
        }
        setLoading(false);
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await API.post('/auth/login', { email, password });
            const authToken = response.data.token || response.data.accessToken;
            const refreshToken = response.data.refreshToken;
            const userObject = response.data.user || {
                id: response.data.id,
                name: response.data.name,
                email: response.data.email || email,
                role: response.data.role,
            };
            setToken(authToken);
            setUser(userObject);
            localStorage.setItem('user', JSON.stringify(userObject));
            if (refreshToken) {
                localStorage.setItem('refreshToken', refreshToken);
            }
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Prijava nije uspjela. Provjerite podatke.',
            };
        }
    };

    const register = async (userData) => {
        try {
            await API.post('/auth/register', userData);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registracija nije uspjela.',
            };
        }
    };

    const logout = () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            API.post('/auth/logout', { refreshToken }).catch(() => {});
        }
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);