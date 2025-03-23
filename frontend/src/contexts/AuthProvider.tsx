import React, { useCallback, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { LoginCredentials, RegisterCredentials, User } from '../types/auth';
import api from '../services/api';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setLoading] = useState(true);
  const [{ user, isLoggedIn, error }, setState] = useState<{
    user?: User;
    isLoggedIn: boolean;
    error: string | undefined;
  }>({
    user: undefined,
    isLoggedIn: false,
    error: undefined,
  });
  const navigate = useNavigate();

  const checkStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setState(prev => ({ ...prev, isLoggedIn: false, user: undefined }));
        return;
      }

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await api.get<{ data: User | null }>('/auth/me');
      
      setState(prev => ({
        ...prev,
        isLoggedIn: !!response.data.data,
        user: response.data.data || undefined,
        error: undefined,
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoggedIn: false,
        user: undefined,
        error: (err as AxiosError<{ message: string }>)?.response?.data?.message || 'Something went wrong',
      }));
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    checkStatus().finally(() => setLoading(false));
  }, [checkStatus]);

  const register = useCallback(async (creds: RegisterCredentials) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', creds);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setState(prev => ({
        ...prev,
        user,
        isLoggedIn: true,
        error: undefined,
      }));
      navigate('/');
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: (err as AxiosError<{ message: string }>)?.response?.data?.message || 'Something went wrong',
      }));
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const login = useCallback(async (creds: LoginCredentials) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', creds);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setState(prev => ({
        ...prev,
        user,
        isLoggedIn: true,
        error: undefined,
      }));
      navigate('/');
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: (err as AxiosError<{ message: string }>)?.response?.data?.message || 'Something went wrong',
      }));
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(() => {
    setLoading(true);
    try {
      api.post('/auth/logout');
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      
      setState(prev => ({
        ...prev,
        user: undefined,
        isLoggedIn: false,
        error: undefined,
      }));
      navigate('/login');
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: (err as AxiosError<{ message: string }>)?.response?.data?.message || 'Something went wrong',
      }));
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        user,
        error,
        isLoading,
        isLoggedIn,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 