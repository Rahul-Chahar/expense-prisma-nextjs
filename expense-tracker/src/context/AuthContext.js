'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      checkPremiumStatus(token);
      setUser({ token });
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error logging in');
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
        setUser({ token: data.token });
        await checkPremiumStatus(data.token);
        return { success: true };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await fetch('http://localhost:8080/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error signing up');
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsPremium(false);
  };

  const checkPremiumStatus = async (token) => {
    try {
      const response = await fetch('http://localhost:8080/api/premium/status', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to check premium status');
      }

      const data = await response.json();
      setIsPremium(data.isPremium);
      return data.isPremium;
    } catch (error) {
      console.error('Error checking premium status:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isPremium, login, signup, logout, checkPremiumStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
