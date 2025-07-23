import { createContext, useContext, useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import api from '../utils/axios'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const res = await api.get(`/user/${decoded.id}`);
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user", err);
        setUser(null);
      } finally {
        setLoading(false); 
      }
    };

    checkUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password }, { withCredentials: true });
    const token = res.data.accessToken;
    localStorage.setItem('token', token);

    const decoded = jwtDecode(token);
    const userRes = await api.get(`/user/${decoded.id}`);
    setUser(userRes.data);
  };
  const getToken = () => {
    return localStorage.getItem('token');
  } 

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login,getToken, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
