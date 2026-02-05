import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setInitializing(false);
      }
    };

    checkAuth();
  }, []);

  const signup = async (userData) => {
    setLoading(true);
    try {
      console.log('Attempting signup with email:', userData.email);
      console.log('API Endpoint:', API_ENDPOINTS.SIGNUP);
      
      const response = await fetch(API_ENDPOINTS.SIGNUP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Registration failed',
          errors: data.errors || null,
        };
      }

      // Note: Backend may require email verification, so don't auto-login
      return {
        success: true,
        message: data.message || 'Registration successful! Please check your email to verify your account.',
        data: data.data,
      };
    } catch (error) {
      console.error('Signup error:', error);
      console.error('Error message:', error.message);
      return {
        success: false,
        message: `Connection failed: ${error.message}. Make sure the backend is running on http://localhost:5000`,
      };
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      console.log('🔐 Login attempt:');
      console.log('  Email:', credentials.email);
      console.log('  API Endpoint:', API_ENDPOINTS.LOGIN);
      
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('📡 Response status:', response.status);
      const data = await response.json();
      console.log('📦 Response data:', data);

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Login failed',
        };
      }

      // Store token and user data
      if (data.data.token) {
        localStorage.setItem('token', data.data.token);
      }
      if (data.data.user) {
        // Map backend field names to frontend
        const userData = {
          id: data.data.user.id,
          email: data.data.user.email,
          full_name: data.data.user.fullName,
          role: data.data.user.role,
          phone: data.data.user.phone,
          approved: data.data.user.approved,
        };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }

      return {
        success: true,
        message: 'Login successful',
        data: data.data,
      };
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      return {
        success: false,
        message: `Connection failed: ${error.message}. Make sure the backend is running on http://localhost:5000`,
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const googleSignIn = async () => {
    try {
      // Redirect to backend OAuth endpoint
      window.location.href = API_ENDPOINTS.GOOGLE_AUTH;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const facebookSignIn = async () => {
    try {
      // Redirect to backend OAuth endpoint
      window.location.href = API_ENDPOINTS.FACEBOOK_AUTH;
    } catch (error) {
      console.error('Facebook sign-in error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    initializing,
    signup,
    login,
    logout,
    googleSignIn,
    facebookSignIn,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
