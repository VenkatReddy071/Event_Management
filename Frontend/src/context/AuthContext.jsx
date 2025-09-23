import React from 'react';
import { useState, useEffect, createContext, useCallback, useContext } from 'react';
import axios from "axios";
import { useNotification } from './NotificationContext';

const AuthContext = createContext({
    userProfile: null,
    isAuthenticated: false,
    loading: true,
    logout: () => {},
    fetchProfile: () => {}
});

export default function AuthContextProvider({ children }) {
    const { showNotification } = useNotification();
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const url = `${import.meta.env.VITE_SERVER_URL}/api`;

    const logout = useCallback(() => {
        localStorage.removeItem("userToken");
        setUserProfile(null);
        showNotification("You have been logged out.");
    }, [ showNotification]);

    const fetchProfile = useCallback(async () => {
        const token = localStorage.getItem("userToken");
        if (!token) {
            setUserProfile(null);
            setLoading(false);
        }

        try {
            const response = await axios.get(`${url}/profile`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 201) {
                console.log(response.data);
                setUserProfile(response.data);
            } else {
                logout();
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                logout();
            } else {
                showNotification(error.response?.data?.msg);
            }
        } finally {
            setLoading(false);
        }
    }, [url, showNotification, logout]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const value = {
        userProfile,
        isAuthenticated: !!userProfile,
        loading,
        logout,
        fetchProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);