'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@/context/UserContext';
import { useState, useRef, useEffect } from 'react';
import { RingEnums } from '@/constants/ringEnums';

// Define the mega menu structure
const CATEGORIES = [
  {
    name: 'Engagement',
    path: '/engagement',
    subcategories: [
      { name: 'All Engagement Rings', path: '/engagement/all' },
      { name: 'Solitaire', path: '/engagement/solitaire' },
      { name: 'Halo', path: '/engagement/halo' },
      { name: 'Three Stone', path: '/engagement/three-stone' },
      { name: 'Vintage', path: '/engagement/vintage' },
      { name: 'Side Stone', path: '/engagement/side-stone' },
    ],
    styles: RingEnums.STYLES,
    metals: RingEnums.METAL_COLORS.map(color => ({
      name: color.charAt(0).toUpperCase() + color.slice(1),
      path: `/engagement/metal/${color}`
    }))
  },
  {
    name: 'Wedding',
    path: '/wedding',
    subcategories: [
      { name: 'All Wedding Rings', path: '/wedding/all' },
      { name: 'Women\'s Bands', path: '/wedding/womens' },
      { name: 'Men\'s Bands', path: '/wedding/mens' },
      { name: 'Eternity Bands', path: '/wedding/eternity' },
      { name: 'Anniversary Bands', path: '/wedding/anniversary' },
    ],
    styles: RingEnums.STYLES,
    metals: RingEnums.METAL_COLORS.map(color => ({
      name: color.charAt(0).toUpperCase() + color.slice(1),
      path: `/wedding/metal/${color}`
    }))
  },
  {
    name: 'Diamond',
    path: '/diamond',
    subcategories: []
  },
  {
    name: 'Gemstone',
    path: '/gemstone',
    subcategories: []
  },
  {
    name: 'Fine Jewellery',
    path: '/fine-jewellery',
    subcategories: []
  },
  {
    name: 'Customize',
    path: '/customize',
    subcategories: []
  }
];

export default function Navbar() {
  const { user, logout } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target as Node)) {
        setIsAccountDropdownOpen(false);
      }
      
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setActiveMegaMenu(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleAccountDropdown = () => {
    setIsAccountDropdownOpen(!isAccountDropdownOpen);
  };

  const toggleMegaMenu = (categoryName: string) => {
    if (activeMegaMenu === categoryName) {
      setActiveMegaMenu(null);
    } else {
      setActiveMegaMenu(categoryName);
    }
  };

  return (
    <>
      <nav className="bg-transparent py-4 px-4 md:px-6 relative z-[50] w-full">
        <div className="w-full mx-auto flex items-center justify-between">
          {/* Hamburger Menu - Mobile Only */}
          <button 
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

          {/* Logo */}
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
          
          {/* Desktop Search */}
          <div className="hidden lg:block flex-grow max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search for jewelry..."
                className="w-full py-2 pl-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Wishlist - Desktop Only */}
            <Link href="/wishlist" className="hidden md:block">
              <div className="cursor-pointer relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </Link>
            
            {/* User profile - Desktop Only */}
            <div className="relative hidden md:block" ref={accountDropdownRef}>
              <div 
                className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={toggleAccountDropdown}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              
              {/* Dropdown menu */}
              {isAccountDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
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
                        onClick={() => {
                          logout();
                          setIsAccountDropdownOpen(false);
                        }}
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
              )}
            </div>
            
            {/* Cart - Always visible */}
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
          </div>
        </div>
      </nav>

      {/* Categories Bar - Desktop */}
      <div className="hidden lg:block border-t border-gray-200 w-full">
        <div className="w-full mx-auto px-4 md:px-6">
          <ul className="flex justify-center space-x-8">
            {CATEGORIES.map((category) => (
              <li key={category.path} className="relative">
                <button 
                  className={`py-4 px-2 inline-block text-gray-700 hover:text-amber-500 transition-colors ${activeMegaMenu === category.name ? 'text-amber-500' : ''}`}
                  onClick={() => toggleMegaMenu(category.name)}
                >
                  {category.name}
                  {category.subcategories.length > 0 && (
                    <svg 
                      className={`inline-block ml-1 h-4 w-4 transition-transform ${activeMegaMenu === category.name ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
                
                {/* Mega Menu as Popover - Positioned under each category */}
                {activeMegaMenu === category.name && category.subcategories.length > 0 && (
                  <div 
                    ref={megaMenuRef}
                    className="absolute left-0 mt-1 bg-white shadow-lg z-40 border border-gray-200 rounded-md w-[600px]"
                    style={{ maxWidth: 'calc(100vw - 2rem)' }}
                  >
                    <div className="py-6 px-6">
                      <div className="grid grid-cols-3 gap-6">
                        {/* First column - Subcategories */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4 text-gray-800">Categories</h3>
                          <ul className="space-y-2">
                            {category.subcategories.map((subcategory) => (
                              <li key={subcategory.path}>
                                <Link 
                                  href={subcategory.path}
                                  className="text-gray-600 hover:text-amber-500 transition-colors"
                                  onClick={() => setActiveMegaMenu(null)}
                                >
                                  {subcategory.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* Second column - Styles */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4 text-gray-800">Styles</h3>
                          <ul className="space-y-2">
                            {category.styles?.map((style) => (
                              <li key={style}>
                                <Link 
                                  href={`${category.path}/style/${style.toLowerCase().replace(/\s+/g, '-')}`}
                                  className="text-gray-600 hover:text-amber-500 transition-colors"
                                  onClick={() => setActiveMegaMenu(null)}
                                >
                                  {style}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {/* Third column - Metals */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4 text-gray-800">Metals</h3>
                          <ul className="space-y-2">
                            {category.metals?.map((metal) => (
                              <li key={metal.path}>
                                <Link 
                                  href={metal.path}
                                  className="text-gray-600 hover:text-amber-500 transition-colors"
                                  onClick={() => setActiveMegaMenu(null)}
                                >
                                  {metal.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`
        fixed inset-0 bg-white z-[60] transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:hidden w-[280px]
      `}>
        <div className="h-full overflow-y-auto pt-16">
          {/* User Account Section - Mobile Only */}
          <div className="p-4 border-b border-gray-200">
            {user ? (
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 mb-2">Hello, {user.firstName || 'User'}</span>
                <div className="flex flex-col space-y-2">
                  <Link href="/dashboard" className="text-gray-700 hover:text-amber-500" onClick={() => setIsMobileMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <Link href="/profile" className="text-gray-700 hover:text-amber-500" onClick={() => setIsMobileMenuOpen(false)}>
                    Profile
                  </Link>
                  <Link href="/orders" className="text-gray-700 hover:text-amber-500" onClick={() => setIsMobileMenuOpen(false)}>
                    Orders
                  </Link>
                  <Link href="/wishlist" className="text-gray-700 hover:text-amber-500" onClick={() => setIsMobileMenuOpen(false)}>
                    Wishlist
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left text-gray-700 hover:text-amber-500"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <Link 
                  href="/login" 
                  className="bg-black text-white py-2 px-4 rounded-full text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link 
                  href="/signup" 
                  className="border border-black text-black py-2 px-4 rounded-full text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Create account
                </Link>
                <Link href="/wishlist" className="flex items-center text-gray-700 hover:text-amber-500 mt-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Wishlist
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Search */}
          <div className="p-4 border-b border-gray-200">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search for jewelry..."
                className="w-full py-2 pl-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Mobile Categories with Expandable Subcategories */}
          <ul className="p-4">
            {CATEGORIES.map((category) => (
              <li key={category.path} className="border-b border-gray-100 last:border-none">
                {category.subcategories.length > 0 ? (
                  <div className="py-4">
                    <div 
                      className="flex justify-between items-center text-gray-700 hover:text-amber-500 transition-colors cursor-pointer"
                      onClick={() => toggleMegaMenu(category.name === activeMegaMenu ? '' : category.name)}
                    >
                      <span>{category.name}</span>
                      <svg 
                        className={`h-5 w-5 transition-transform ${activeMegaMenu === category.name ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    
                    {/* Expandable subcategories for mobile */}
                    {activeMegaMenu === category.name && (
                      <div className="mt-2 ml-4 space-y-2">
                        {category.subcategories.map((subcategory) => (
                          <Link 
                            key={subcategory.path}
                            href={subcategory.path}
                            className="block py-2 text-gray-600 hover:text-amber-500"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {subcategory.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link 
                    href={category.path} 
                    className="block py-4 text-gray-700 hover:text-amber-500 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-[55] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
