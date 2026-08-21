import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, getMeApi, togglePremiumApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('crop_guardian_token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await getMeApi();
          if (res.data.success) {
            setUser(res.data.user);
          }
        } catch (err) {
          console.warn('Session expired or invalid token:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await loginApi({ email, password });
    if (res.data && res.data.success) {
      localStorage.setItem('crop_guardian_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data.user;
    }
    throw new Error(res.data?.message || 'Login failed.');
  };

  const register = async (data) => {
    const res = await registerApi(data);
    if (res.data && res.data.success) {
      localStorage.setItem('crop_guardian_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data.user;
    }
    throw new Error(res.data?.message || 'Registration failed.');
  };

  const logout = () => {
    localStorage.removeItem('crop_guardian_token');
    setToken('');
    setUser(null);
  };

  const togglePremium = async () => {
    const res = await togglePremiumApi();
    if (res.data.success && user) {
      setUser({ ...user, isPremium: res.data.isPremium });
    }
    return res.data;
  };

  const quickLoginAs = async (role) => {
    if (role === 'farmer') {
      return await login('farmer@cropguardian.ai', 'password123');
    } else if (role === 'specialist') {
      return await login('specialist@cropguardian.ai', 'password123');
    } else if (role === 'admin') {
      return await login('admin@cropguardian.ai', 'adminpassword123');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        togglePremium,
        quickLoginAs,
        isAuthenticated: !!user,
        isFarmer: user?.role === 'farmer',
        isSpecialist: user?.role === 'specialist',
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
