import { createContext, useContext, useState, useEffect } from 'react';
import { login as authLogin, register as authRegister } from "../services/Auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setCurrentUser(JSON.parse(user));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const user = await authLogin(username, password);
            setCurrentUser(user);
            localStorage.setItem('user', JSON.stringify(user));
            return true; // Успешный вход
        } catch (error) {
            throw error;
        }
    };

    const register = async (username, email, password) => {
        try {
            const user = await authRegister(username, email, password);
            setCurrentUser(user);
            localStorage.setItem('user', JSON.stringify(user));
            return true; // Успешная регистрация
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('user');
    };

    const value = {
        currentUser,
        login,
        register,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}