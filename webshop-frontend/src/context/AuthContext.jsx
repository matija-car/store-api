import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            // Opcionalno: ovdje možete povući podatke o korisniku ako imate /auth/me endpoint
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
            setToken(authToken);
            setUser(response.data.user || { email });
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
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);