'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@/context/UserContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchVisible, setMobileSearchVisible] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality here
    console.log('Searching for:', searchQuery);
  };

  return (
    <nav className="bg-transparent py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo on the left */}
        <div className="flex-shrink-0">
          <Link href="/">
            <div className="cursor-pointer">
              <Image 
                src="/main_logo.svg" 
                alt="Jewelry Store" 
                width={150} 
                height={50}
                className="object-contain"
              />
            </div>
          </Link>
        </div>
        
        {/* Search bar in center */}
        <div className="hidden md:block flex-grow max-w-md mx-8">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search for jewelry..."
              className="w-full py-2 pl-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 font-raleway"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit" 
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>
        
        {/* Right side icons */}
        <div className="flex items-center space-x-4">
          {/* Wishlist */}
          <Link href="/wishlist">
            <div className="cursor-pointer relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </Link>
          
          {/* User profile */}
          <div className="relative group">
            <div className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            
            {/* Dropdown menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
              {user ? (
                <>
                  <Link href="/dashboard">
                    <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-raleway">Dashboard</div>
                  </Link>
                  <Link href="/profile">
                    <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-raleway">Profile</div>
                  </Link>
                  <Link href="/orders">
                    <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-raleway">Orders</div>
                  </Link>
                  <hr className="my-1" />
                  <button 
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-raleway"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-raleway">Sign in</div>
                  </Link>
                  <Link href="/signup">
                    <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-raleway">Create account</div>
                  </Link>
                </>
              )}
            </div>
          </div>
          
          {/* Cart */}
          <Link href="/cart">
            <div className="cursor-pointer relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {/* Cart item count badge */}
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-cinzel">
                0
              </span>
            </div>
          </Link>
          
          {/* Mobile search icon - only visible on small screens */}
          <button 
            className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => setMobileSearchVisible(!mobileSearchVisible)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile search bar - toggled by the search icon */}
      {mobileSearchVisible && (
        <div className="md:hidden mt-4 px-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search for jewelry..."
              className="w-full py-2 pl-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 font-raleway"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit" 
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </nav>
  );
}