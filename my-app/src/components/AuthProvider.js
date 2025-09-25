import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [adminName, setAdmin] = useState('');

    const login = (username, name, password) => {
        setUsername(username);
        setName(name);
        setPassword(password);
    };

    const admin = (admin) => {
        setAdmin(admin);
    };

    const logout = () => {
        setUsername('');
        setName('');
        setPassword('');
        setAdmin('');
    };

    return (
        <AuthContext.Provider value={{ username, name, password,adminName , logout, login, admin }}>
            {children}
        </AuthContext.Provider>
    );
};
