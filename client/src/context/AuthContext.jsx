import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
           try {
               // Verify token validity with backend
               const { data } = await api.get('/auth/me');
               setUser({...JSON.parse(storedUser), ...data}); 
           } catch (error) {
               console.error("Token invalid", error);
               localStorage.removeItem('user');
               setUser(null);
           }
        }
        setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      return data;
    } catch (error) {
       console.error("Login failed", error.response?.data?.message || error.message);
       throw error;
    }
  };

  const register = async (userData) => {
     try {
       const { data } = await api.post('/auth/register', userData);

       if (data && data.token) {
           localStorage.setItem('user', JSON.stringify(data));
           setUser(data);
       }
       return data;
     } catch (error) {
       console.error("Registration failed", error.response?.data?.message || error.message);
       throw error;
     }
  }

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
