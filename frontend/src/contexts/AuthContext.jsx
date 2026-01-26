import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const result = await authService.login(email, password);
        if (result.success) {
            setUser(result.user);
        }
        return result;
    };

    const register = async (userData) => {
        const result = await authService.register(userData);
        if (result.success) {
            setUser(result.user);
        }
        return result;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const updateProfile = async (updates) => {
        const result = await authService.updateProfile(updates);
        if (result.success) {
            setUser(result.user);
        }
        return result;
    };

    const changePassword = async (currentPassword, newPassword) => {
        return await authService.changePassword(currentPassword, newPassword);
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
    };

    if (loading) {
        return null; // Or a loading spinner
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
