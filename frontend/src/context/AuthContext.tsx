import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
    user: any;
    login: (userData: any, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: () => { },
    logout: () => { }
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('shopkart_user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) { }
        }
    }, []);

    const login = (userData: any, token: string) => {
        setUser(userData);
        localStorage.setItem('shopkart_user', JSON.stringify(userData));
        localStorage.setItem('shopkart_token', token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('shopkart_user');
        localStorage.removeItem('shopkart_token');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
