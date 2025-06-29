'use client';

import { AdminRoute } from '@/components/ProtectedRoute';
import Sidebar from '@/components/admin/Sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-100">
        <Sidebar />
        <div className="pl-64">
          {children}
        </div>
      </div>
    </AdminRoute>
  );
}