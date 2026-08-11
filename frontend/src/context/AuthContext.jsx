import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem('cloudguard_token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
        } catch (err) {
          console.error("Session expired or invalid token:", err);
          localStorage.removeItem('cloudguard_token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchMe();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('cloudguard_token', res.data.access_token);
    setUser({
      id: res.data.user_id,
      email: res.data.email,
      full_name: res.data.full_name,
      role: res.data.role
    });
    return res.data;
  };

  const register = async (email, password, full_name, role = "VIEWER") => {
    const res = await api.post('/auth/register', { email, password, full_name, role });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('cloudguard_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
