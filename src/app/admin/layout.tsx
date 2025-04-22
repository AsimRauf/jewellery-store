'use client';

import { useEffect } from 'react';
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

  useEffect(() => {
    // Only redirect if we're sure about the auth state
    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else if (user.role !== 'admin') {
        toast.error('Admin access required');
        router.replace('/');
      }
    }
  }, [user, loading, router]);

  // Show loading state
  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>;
  }

  // Only render admin content if user is admin
  if (user?.role === 'admin') {
    return (
      <div className="min-h-screen bg-gray-100">
        <Sidebar />
        <div className="pl-64">
          {children}
        </div>
      </div>
    );
  }

  return null;
}