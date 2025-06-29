'use client';

import { useUser } from '@/context/UserContext';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Dashboard() {
  const { user, logout } = useUser();

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={logout}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
          >
            Logout
          </button>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Welcome, {user?.firstName} {user?.lastName}!
          </h2>
          <p className="text-gray-600">You are now logged in to your account.</p>
        </div>
      
        {/* Add your dashboard content here */}
      </div>
    </div>
    </ProtectedRoute>
  );
}