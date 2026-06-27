import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('ivas_token');
        if (token) {
            api.getMe()
                .then(data => setUser(data.user))
                .catch(() => {
                    localStorage.removeItem('ivas_token');
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const data = await api.login(email, password);
        localStorage.setItem('ivas_token', data.token);
        setUser(data.user);
        return data.user;
    };

    const register = async (name, email, password) => {
        const data = await api.register(name, email, password);
        localStorage.setItem('ivas_token', data.token);
        setUser(data.user);
        return data.user;
    };

    const logout = () => {
        localStorage.removeItem('ivas_token');
        setUser(null);
    };

    const refreshUser = async () => {
        try {
            const data = await api.getMe();
            setUser(data.user);
        } catch { /* ignore */ }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
