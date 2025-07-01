'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useUser } from '@/context/UserContext';
import Link from 'next/link';
import {
  HiShoppingCart,
  HiCurrencyDollar, 
  HiUsers, 
  HiTrendingUp,
  HiClock,
  HiCheckCircle,
  HiTruck,
  HiExclamationCircle
} from "react-icons/hi";

interface DashboardStats {
  orders: {
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
    avgOrderValue: number;
  };
  recentOrders: Array<{
    _id: string;
    orderNumber: string;
    customerEmail: string;
    pricing: { total: number };
    status: string;
    createdAt: string;
  }>;
}

export default function AdminDashboard() {
  const { user } = useUser();
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dashboard stats
  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      
      // Fetch orders stats
      const ordersResponse = await fetch('/api/admin/orders?limit=5&sortBy=createdAt&sortOrder=desc', {
        credentials: 'include'
      });

      if (!ordersResponse.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const ordersData = await ordersResponse.json();
      
      setStats({
        orders: {
          total: ordersData.data.stats.totalOrders,
          pending: ordersData.data.stats.pendingOrders,
          processing: ordersData.data.stats.processingOrders,
          shipped: ordersData.data.stats.shippedOrders,
          delivered: ordersData.data.stats.deliveredOrders
        },
        revenue: {
          total: ordersData.data.stats.totalRevenue,
          thisMonth: ordersData.data.stats.totalRevenue, // You might want to calculate this separately
          avgOrderValue: ordersData.data.stats.avgOrderValue
        },
        recentOrders: ordersData.data.orders.slice(0, 5)
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardStats();
    }
  }, [user]);
  
    // Handle loading state
    if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <HiClock className="w-4 h-4 text-yellow-600" />;
      case 'processing': return <HiClock className="w-4 h-4 text-orange-600" />;
      case 'shipped': return <HiTruck className="w-4 h-4 text-purple-600" />;
      case 'delivered': return <HiCheckCircle className="w-4 h-4 text-green-600" />;
      default: return <HiExclamationCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-orange-100 text-orange-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 opacity-80">Welcome back, {user?.firstName}! Here&apos;s your store overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <HiShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
              <p className="text-3xl font-bold text-blue-600">{stats?.orders.total || 0}</p>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <HiCurrencyDollar className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700">Total Revenue</h3>
              <p className="text-3xl font-bold text-green-600">
                ${stats?.revenue.total.toLocaleString(undefined, { maximumFractionDigits: 0 }) || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <HiTrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700">Avg Order Value</h3>
              <p className="text-3xl font-bold text-purple-600">
                ${stats?.revenue.avgOrderValue.toFixed(0) || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <HiClock className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700">Pending Orders</h3>
              <p className="text-3xl font-bold text-orange-600">{stats?.orders.pending || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Status Overview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Order Status Overview</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <HiClock className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="text-gray-700">Pending</span>
              </div>
              <span className="font-semibold text-yellow-600">{stats?.orders.pending || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <HiClock className="w-5 h-5 text-orange-600 mr-2" />
                <span className="text-gray-700">Processing</span>
              </div>
              <span className="font-semibold text-orange-600">{stats?.orders.processing || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <HiTruck className="w-5 h-5 text-purple-600 mr-2" />
                <span className="text-gray-700">Shipped</span>
              </div>
              <span className="font-semibold text-purple-600">{stats?.orders.shipped || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <HiCheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-gray-700">Delivered</span>
              </div>
              <span className="font-semibold text-green-600">{stats?.orders.delivered || 0}</span>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-purple-600 hover:text-purple-700 text-sm">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {stats?.recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent orders</p>
            ) : (
              stats?.recentOrders.map((order) => (
                <div key={order._id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                  <div>
                    <div className="flex items-center">
                      {getStatusIcon(order.status)}
                      <span className="ml-2 font-medium text-gray-900">
                        #{order.orderNumber}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{order.customerEmail}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${order.pricing.total.toFixed(2)}
                    </p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/orders" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <HiShoppingCart className="w-8 h-8 text-purple-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Manage Orders</h3>
            <p className="text-sm text-gray-500">View and update order status</p>
          </Link>
          
          <Link href="/admin/gemstones" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <HiCurrencyDollar className="w-8 h-8 text-green-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Add Gemstone</h3>
            <p className="text-sm text-gray-500">Add new gemstones to inventory</p>
          </Link>
          
          <Link href="/admin/diamonds" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <HiUsers className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Add Diamond</h3>
            <p className="text-sm text-gray-500">Add new diamonds to inventory</p>
          </Link>
          
          <Link href="/admin/analytics" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <HiTrendingUp className="w-8 h-8 text-orange-600 mb-2" />
            <h3 className="font-semibold text-gray-900">View Analytics</h3>
            <p className="text-sm text-gray-500">Check sales and performance</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
