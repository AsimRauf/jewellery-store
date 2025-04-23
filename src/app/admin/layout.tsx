'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Sidebar from '@/components/admin/Sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useUser();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Verify server-side that the user is an admin
    const verifyAdminAccess = async () => {
      try {
        const response = await fetch('/api/auth/check', {
          credentials: 'include'
        });
        const data = await response.json();
        
        if (!data.authenticated || data.user?.role !== 'admin') {
          toast.error('Admin access required');
          router.replace('/login');
        } else {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error('Admin verification error:', error);
        router.replace('/login');
      }
    };

    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else if (user.role !== 'admin') {
        toast.error('Admin access required');
        router.replace('/');
      } else {
        // Double-check with server
        verifyAdminAccess();
      }
    }
  }, [user, loading, router]);

  // Show loading state
  if (loading || !isAuthorized) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>;
  }

  // Only render admin content if user is admin
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="pl-64">
        {children}
      </div>
    </div>
  );
}