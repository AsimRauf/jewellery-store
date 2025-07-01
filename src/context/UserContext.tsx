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
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
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

  // Make sure the refreshToken function is properly implemented
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
      const response = await fetch('/api/auth/check', {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      const data = await response.json();
      
      if (data.authenticated) {
        setUser(data.user);
        setError(null);
      } else if (document.cookie.includes('refreshToken=')) {
        const refreshed = await refreshToken();
        if (refreshed) {
          const retryResponse = await fetch('/api/auth/check', {
            credentials: 'include',
            headers: {
              'Cache-Control': 'no-cache'
            }
          });
          const retryData = await retryResponse.json();
          if (retryData.authenticated) {
            setUser(retryData.user);
            setError(null);
          }
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
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
      
      // Skip auth handling for /api/orders endpoint
      const url = input instanceof Request ? input.url : input.toString();
      if (url.includes('/api/orders')) {
        return response;
      }
      
      // Handle auth for other endpoints
      if (response.status === 401 && !url.includes('/api/auth/refresh')) {
        const hasRefreshToken = document.cookie.includes('refreshToken=');
        
        if (hasRefreshToken) {
          const refreshed = await refreshToken();
          
          if (refreshed) {
            const newInit = { ...init };
            if (newInit.headers) {
              newInit.headers = new Headers(newInit.headers);
            }
            return originalFetch(input, newInit);
          }
          
          if (user) {
            logout();
          }
        }
      }
      
      return response;
    };    
    return () => {
      // Restore original fetch when component unmounts
      window.fetch = originalFetch;
    };
  }, [user, logout, refreshToken]);

  // Make sure the useEffect for initial auth check is properly implemented
  useEffect(() => {
    // Only check auth once when the component mounts
    let isMounted = true;
    
    const performAuthCheck = async () => {
      if (isMounted) {
        await checkAuth();
      }
    };
    
    performAuthCheck();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array means this only runs once on mount
  
  return (
    <UserContext.Provider value={{ user, setUser, loading, login, logout, checkAuth, error }}>
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