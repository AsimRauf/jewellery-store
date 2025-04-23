'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: { email: string; password: string; isAdmin?: boolean }) => Promise<User>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  // Wrap refreshToken in useCallback to prevent recreation on every render
  const refreshToken = useCallback(async (): Promise<boolean> => {
    if (isRefreshing) return false; // Prevent multiple simultaneous refresh attempts
    
    try {
      setIsRefreshing(true);
      console.log('Attempting to refresh token...');
      
      const response = await fetch('/api/auth/refresh', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (!response.ok) {
        console.log('Token refresh failed with status:', response.status);
        throw new Error('Failed to refresh token');
      }
      
      console.log('Token refreshed successfully');
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

  // Wrap checkAuth in useCallback to prevent recreation on every render
  const checkAuth = useCallback(async () => {
    try {
      console.log('Checking authentication...');
      const response = await fetch('/api/auth/check', {
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.authenticated) {
        console.log('User authenticated:', data.user.email);
        setUser(data.user);
        setError(null);
      } else {
        console.log('Authentication check failed, attempting refresh...');
        // Try to refresh the token
        const refreshed = await refreshToken();
        
        if (refreshed) {
          // Check auth again after refresh
          const retryResponse = await fetch('/api/auth/check', {
            credentials: 'include'
          });
          
          const retryData = await retryResponse.json();
          
          if (retryData.authenticated) {
            console.log('Authentication successful after token refresh');
            setUser(retryData.user);
            setError(null);
          } else {
            console.log('Authentication failed even after token refresh');
            setUser(null);
            setError('Authentication failed');
          }
        } else {
          console.log('Token refresh failed, user not authenticated');
          setUser(null);
          setError('Authentication failed');
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }, [refreshToken]);

  const login = async (credentials: { email: string; password: string; isAdmin?: boolean }) => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };

      if (credentials.isAdmin) {
        headers['x-requested-role'] = 'admin';
      }

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setUser(data.user);
      setError(null);

      // Redirect based on role
      if (data.user.role === 'admin') {
        router.push('/admin/rings/wedding');
      } else {
        router.push('/dashboard');
      }

      return data.user;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
      throw error;
    }
  };

  // Wrap logout in useCallback to prevent recreation on every render
  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      });
    } finally {
      setUser(null);
      router.push('/login');
    }
  }, [router]);

  // Set up an interceptor for fetch requests to handle token expiration
  useEffect(() => {
    const originalFetch = window.fetch;
    
    window.fetch = async function(input, init) {
      // Make the original request
      const response = await originalFetch(input, init);
      
      // If we get a 401 (Unauthorized) and we're not already on the refresh endpoint
      if (response.status === 401 && 
          !(input instanceof Request ? input.url : input.toString()).includes('/api/auth/refresh')) {
        
        console.log('Received 401, attempting token refresh...');
        const refreshed = await refreshToken();
        
        if (refreshed) {
          // Retry the original request
          console.log('Token refreshed, retrying original request');
          return originalFetch(input, init);
        }
        
        // If refresh failed and we're authenticated, log out
        if (user) {
          console.log('Token refresh failed, logging out');
          logout();
        }
      }
      
      return response;
    };
    
    return () => {
      // Restore original fetch when component unmounts
      window.fetch = originalFetch;
    };
  }, [user, logout, refreshToken]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  return (
    <UserContext.Provider value={{ user, loading, login, logout, checkAuth, error }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};