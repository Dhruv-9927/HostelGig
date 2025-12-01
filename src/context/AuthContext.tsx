import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types';
import api from '../lib/api';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password?: string) => Promise<void>;
    signup: (email: string, password?: string, name?: string) => Promise<void>;
    setRole: (role: UserRole) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user from backend on boot
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const { data } = await api.get('/auth/me');
                    setUser(data.user);
                } catch (error) {
                    console.error('Auth check failed', error);
                    localStorage.removeItem('token');
                }
            }
            setIsLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email: string, password?: string) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            setUser(data.user);
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        }
    };

    const signup = async (email: string, password?: string, name?: string) => {
        try {
            const { data } = await api.post('/auth/signup', { email, password, name });
            localStorage.setItem('token', data.token);
            setUser(data.user);
        } catch (error) {
            console.error('Signup failed', error);
            throw error;
        }
    };

    const setRole = (role: UserRole) => {
        if (user) {
            // In a real app, we'd update this on the backend too
            const updatedUser = { ...user, role };
            setUser(updatedUser);
            // Optional: Call API to update role
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, setRole, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
