'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@/context/UserContext';
import { useCart } from '@/context/CartContext';
import { useState, useRef, useEffect } from 'react';
import { RingEnums } from '@/constants/ringEnums';


// Add these interfaces at the top of your file
interface MenuItem {
  name: string;
  path: string;
  icon?: string;
}

interface Category {
  name: string;
  path: string;
  subcategories: MenuItem[]; // Remove optional marker
  styles?: MenuItem[];
  metals?: MenuItem[];
  featured?: MenuItem[];
  bannerImage?: string;
  bannerLink?: string;
}

interface ProductSuggestion {
  _id: string;
  name: string;
  slug: string;
  imageUrl: string;
  productType: string;
  price: number;
  salePrice?: number;
  metal?: {
    karat: string;
    color: string;
  };
}

// Define the styles array once at the top level
const RING_STYLES = [
  {
    name: 'Vintage',
    path: '/style/vintage',
    icon: '/icons/styles/vintage.svg'
  },
  {
    name: 'Nature Inspired',
    path: '/style/nature-inspired',
    icon: '/icons/styles/nature-inspired.svg'
  },
  {
    name: 'Floral',
    path: '/style/floral',
    icon: '/icons/styles/floral.svg'
  },
  {
    name: 'Classic',
    path: '/style/classic',
    icon: '/icons/styles/classic.svg'
  },
  {
    name: 'Celtic',
    path: '/style/celtic',
    icon: '/icons/styles/celtic.svg'
  },
  {
    name: 'Branch',
    path: '/style/branch',
    icon: '/icons/styles/branch.svg'
  }
];

// Define the mega menu structure with icons
const CATEGORIES: Category[] = [
  {
    name: 'Engagement',
    path: '/engagement',
    subcategories: [], // Empty array but defined
    styles: RING_STYLES.map(style => ({
      ...style,
      path: `/engagement/style-${style.name.toLowerCase().replace(/\s+/g, '-')}`
    })),
    metals: RingEnums.METAL_COLORS.map(color => {
      if (color === "Two Tone Gold") {
        return {
          name: "Two Tone Gold",
          path: `/engagement/metal-two-tone-gold`,
          icon: "/icons/metals/two-tone.svg"
        };
      }
      const baseName = color.toLowerCase().replace(' gold', '');
      return {
        name: color,
        path: `/engagement/metal-${baseName}`,
        icon: `/icons/metals/${baseName}.svg`
      };
    }),
    featured: [
      {
        name: 'Under $2500',
        path: '/engagement/price/under-2500',
        icon: '/icons/featured/under-2500.svg'
      },
      {
        name: 'Ready To Ship',
        path: '/engagement/ready-to-ship',
        icon: '/icons/featured/ready-to-ship.svg'
      },
      {
        name: 'Create Your Own',
        path: '/settings/all?start=setting',
        icon: '/icons/featured/custom.svg'
      }
    ],
    bannerImage: '/icons/banner/megamenu-banner.webp',
    bannerLink: '/settings/all?start=setting'
  },
  {
    name: 'Settings',
    path: '/settings?start=setting',
    subcategories: [
      {
        name: 'All Settings',
        path: '/settings/all?start=setting',
        icon: '/icons/settings/all-rings.svg'
      },
      {
        name: 'Solitaire',
        path: '/settings/type-solitaire?start=setting',
        icon: '/icons/settings/solitaire.svg'
      },
      {
        name: 'Halo',
        path: '/settings/type-halo?start=setting',
        icon: '/icons/settings/halo.svg'
      },
      {
        name: 'Three Stone',
        path: '/settings/type-three-stone?start=setting',
        icon: '/icons/settings/three-stone.svg'
      },
      {
        name: 'Side Stone',
        path: '/settings/type-side-stone?start=setting',
        icon: '/icons/settings/side-stone.svg'
      }
    ],
    styles: RING_STYLES.map(style => ({
      ...style,
      path: `/settings/style-${style.name.toLowerCase().replace(/\s+/g, '-')}?start=setting`
    })),
    metals: RingEnums.METAL_COLORS.map(color => {
      if (color === "Two Tone Gold") {
        return {
          name: "Two Tone Gold",
          path: `/settings/metal-two-tone-gold?start=setting`,
          icon: "/icons/metals/two-tone.svg"
        };
      }
      const baseName = color.toLowerCase().replace(' gold', '');
      return {
        name: color,
        path: `/settings/metal-${baseName}?start=setting`,
        icon: `/icons/metals/${baseName}.svg`
      };
    }),
    featured: [
      {
        name: 'Under $1500',
        path: '/settings/price/under-1500',
        icon: '/icons/featured/under-2500.svg'
      },
      {
        name: 'New Arrivals',
        path: '/settings/new-arrivals',
        icon: '/icons/featured/custom.svg'
      }
    ],
    bannerImage: '/icons/banner/megamenu-banner.webp',
    bannerLink: '/settings/all?start=setting'
  },
  {
    name: 'Wedding',
    path: '/wedding',
    subcategories: [
      {
        name: 'All Wedding Rings',
        path: '/wedding/all',
        icon: '/icons/wedding/all-rings.svg'
      },
      // Map through RingEnums.SUBCATEGORIES to create menu items
      ...RingEnums.SUBCATEGORIES.map(subcategory => {
        // Convert subcategory name to URL-friendly format
        const path = subcategory.toLowerCase().replace(/['&\s]+/g, '-');
        // Determine icon based on subcategory name
        let icon = '/icons/wedding/';
        if (subcategory.includes("Women")) {
          icon += 'womens-bands.svg';
        } else if (subcategory.includes("Men")) {
          icon += 'mens-bands.svg';
        } else if (subcategory.includes("Anniversary")) {
          icon += 'anniversary-bands.svg';
        } else if (subcategory.includes("His & Her")) {
          icon += 'matching-set.svg';
        } else {
          icon += 'all-rings.svg';
        }
        
        return {
          name: subcategory,
          path: `/wedding/${path}`,
          icon: icon
        };
      })
    ],
    styles: RING_STYLES.map(style => ({
      ...style,
      path: `/wedding/style-${style.name.toLowerCase().replace(/\s+/g, '-')}`
    })),
    metals: RingEnums.METAL_COLORS.map(color => {
      // Special case for Two Tone Gold
      if (color === "Two Tone Gold") {
        return {
          name: "Two Tone Gold",
          path: `/wedding/metal-two-tone-gold`,
          icon: "/icons/metals/two-tone.svg" // Hardcoded path
        };
      }

      // For other metals
      const baseName = color.toLowerCase().replace(' gold', '');
      const urlPath = color.toLowerCase().replace(/\s+/g, '-');

      return {
        name: color,
        path: `/wedding/metal-${urlPath}`,
        icon: `/icons/metals/${baseName}.svg`
      };
    }),
    featured: [
      {
        name: 'Under $2500',
        path: '/wedding/price/under-2500',
        icon: '/icons/featured/under-2500.svg'
      },
      {
        name: 'Ready To Ship',
        path: '/wedding/ready-to-ship',
        icon: '/icons/featured/ready-to-ship.svg'
      }
    ],
    bannerImage: '/icons/banner/megamenu-banner.webp',
    bannerLink: '/settings/all?start=setting'
  },
  {
    name: 'Diamond',
    path: '/diamond?start=diamond',
    subcategories: [
      {
        name: 'Natural Diamonds',
        path: '/diamond/natural?start=diamond',
        icon: '/icons/customize/diamond.svg'
      },
      {
        name: 'Lab Diamonds',
        path: '/diamond/lab?start=diamond',
        icon: '/icons/customize/lab-diamond.svg'
      },
      {
        name: 'Diamond Education',
        path: '/diamond/education',
        icon: '/icons/diamond/education.svg'
      }
    ],
    bannerImage: '/icons/banner/megamenu-banner.webp',
    bannerLink: '/settings/all?start=setting'
  },
  {
    name: 'Gemstone',
    path: '/gemstone',
    subcategories: [
      {
        name: 'All Gemstones',
        path: '/gemstone/all',
        icon: '/icons/gemstone/all.svg'
      },
      {
        name: 'Ruby',
        path: '/gemstone/ruby',
        icon: '/icons/gemstone/ruby.svg'
      },
      {
        name: 'Emerald',
        path: '/gemstone/emerald',
        icon: '/icons/gemstone/emerald.svg'
      },
      {
        name: 'Sapphire',
        path: '/gemstone/sapphire',
        icon: '/icons/gemstone/sapphire.svg'
      },
      {
        name: 'Natural Gemstones',
        path: '/gemstone/natural',
        icon: '/icons/gemstone/natural1.png'
      },
      {
        name: 'Lab Grown Gemstones',
        path: '/gemstone/lab',
        icon: '/icons/gemstone/lab.png'
      }
    ],
    featured: [
      {
        name: 'Under $2500',
        path: '/gemstone/price/under-2500',
        icon: '/icons/featured/under-2500.svg'
      },
      {
        name: 'Ready To Ship',
        path: '/gemstone/ready-to-ship',
        icon: '/icons/featured/ready-to-ship.svg'
      },
      {
        name: 'Start with Gemstone',
        path: '/gemstone/all?start=gemstone',
        icon: '/icons/customize/gemstone.svg'
      }
    ],
    bannerImage: '/icons/banner/megamenu-banner.webp',
    bannerLink: '/settings/all?start=setting'
  },
  {
    name: 'Fine Jewellery',
    path: '/fine-jewellery',
    subcategories: [
      {
        name: 'Necklaces',
        path: '/fine-jewellery/necklaces',
        icon: '/icons/fine-jewellery/necklaces.svg'
      },
      {
        name: 'Earrings',
        path: '/fine-jewellery/earrings',
        icon: '/icons/fine-jewellery/earrings.svg'
      },
      {
        name: 'Bracelets',
        path: '/fine-jewellery/bracelets',
        icon: '/icons/fine-jewellery/bracelets.svg'
      },
      {
        name: 'Men\'s Jewelry',
        path: '/fine-jewellery/mens',
        icon: '/icons/fine-jewellery/mens.svg'
      }
    ],
    bannerImage: '/icons/banner/megamenu-banner.webp',
    bannerLink: '/settings/all?start=setting'
  },
  {
    name: 'Customize',
    path: '/customize',
    subcategories: [
      {
        name: 'Start with a Setting',
        path: '/settings/all?start=setting',
        icon: '/icons/customize/setting.svg'
      },
      {
        name: 'Start with a Diamond',
        path: '/diamond/all?start=diamond',
        icon: '/icons/customize/diamond.svg'
      },
      {
        name: 'Start with a Gemstone',
        path: '/gemstone/all?start=gemstone',
        icon: '/icons/customize/gemstone.svg'
      },
      {
        name: 'Start with a Lab Diamond',
        path: '/diamond/lab?start=diamond',
        icon: '/icons/customize/lab-diamond.svg'
      },
      {
        name: 'Bridal Sets',
        path: '/customize/bridal-sets',
        icon: '/icons/customize/bridal-sets.svg'
      }
    ],
    bannerImage: '/icons/banner/megamenu-banner.webp',
    bannerLink: '/settings/all?start=setting'
  }
];


export default function Navbar() {
  // Remove the existing activeMegaMenu state and toggleMegaMenu function

  // Add this for each category in the mapping
  

 
  const { user, logout } = useUser();
  const { items, itemCount, removeItem, updateQuantity, subtotal } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const cartSidebarRef = useRef<HTMLDivElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
      setSuggestions([]);
    }
  };

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error('Error fetching search suggestions:', error);
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target as Node)) {
        setIsAccountDropdownOpen(false);
      }

      if (cartSidebarRef.current && !cartSidebarRef.current.contains(event.target as Node)) {
        setIsCartSidebarOpen(false);
      }

      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setActiveMegaMenu(null);
      }
      
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSuggestions([]);
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

  const toggleCartSidebar = () => {
    setIsCartSidebarOpen(!isCartSidebarOpen);
  };

  // Format price for display
  const formatPrice = (price: number): string => {
    return `$${price.toLocaleString()}`;
  };

  // Add new refs for menu buttons
  const menuButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Enhanced toggle function with button focus management
  const toggleMegaMenu = (categoryName: string, index: number) => {
    if (activeMegaMenu === categoryName) {
      setActiveMegaMenu(null);
      menuButtonRefs.current[index]?.blur();
    } else {
      setActiveMegaMenu(categoryName);
      menuButtonRefs.current[index]?.focus();
    }
  };

  const getProductLink = (product: ProductSuggestion): string => {
    let baseUrl = '';
    if (product.slug) {
      switch (product.productType) {
        case 'Setting':
          baseUrl = `/products/rings/settings/${product.slug}`;
          break;
        case 'Wedding Ring':
          baseUrl = `/wedding/detail/${product.slug}`;
          break;
        case 'Engagement Ring':
          baseUrl = `/engagement/detail/${product.slug}`;
          break;
        case 'Diamond':
          return `/diamond/detail/${product.slug}`;
        case 'Gemstone':
          return `/gemstone/detail/${product.slug}`;
        case 'Bracelet':
          return `/fine-jewellery/bracelets/detail/${product.slug}`;
        case 'Earring':
          return `/fine-jewellery/earrings/detail/${product.slug}`;
        case 'Necklace':
          return `/fine-jewellery/necklaces/detail/${product.slug}`;
        case 'Mens Jewelry':
          return `/fine-jewellery/mens/detail/${product.slug}`;
        default:
          return `/products/${product._id}`;
      }

      if (product.metal && (product.productType === 'Setting' || product.productType === 'Wedding Ring' || product.productType === 'Engagement Ring')) {
        const metalQuery = encodeURIComponent(`${product.metal.karat}-${product.metal.color}`);
        return `${baseUrl}?metal=${metalQuery}`;
      }

      return baseUrl;
    }
    return `/products/${product._id}`;
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
                  src="/main_logo.png"
                  alt="Jewelry Store"
                  width={80} // Increased width
                  height={30} // Increased height
                  style={{ paddingLeft: 10 }}
                  className="object-contain " // Added shadow
                />
              </div>
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden lg:block flex-grow max-w-md mx-8" ref={searchContainerRef}>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search for jewelry..."
                className="w-full py-2 pl-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchQuery.trim()) {
                    // Re-fetch suggestions on focus if there's a query
                  }
                }}
              />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              {suggestions.length > 0 && (
                <ul className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  {suggestions.map((suggestion) => (
                    <li key={suggestion._id} className="border-b last:border-b-0">
                      <Link
                        href={getProductLink(suggestion)}
                        className="flex items-center p-3 hover:bg-gray-100 transition-colors"
                        onClick={() => {
                          setSearchQuery('');
                          setSuggestions([]);
                        }}
                      >
                        <div className="w-16 h-16 mr-4 flex-shrink-0">
                          <Image
                            src={suggestion.imageUrl}
                            alt={suggestion.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">{suggestion.name}</div>
                          <div className="text-sm text-gray-600">
                            {suggestion.salePrice ? (
                              <>
                                <span className="text-red-600 font-medium">{formatPrice(suggestion.salePrice)}</span>
                                <span className="ml-2 text-gray-500 line-through">{formatPrice(suggestion.price)}</span>
                              </>
                            ) : (
                              formatPrice(suggestion.price)
                            )}
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7 7z" />
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
            <div 
              className="cursor-pointer relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={toggleCartSidebar}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {/* Cart item count badge */}
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-cinzel">
                  {itemCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Categories Bar - Desktop */}
      <div className="hidden lg:block border-t border-gray-200 w-full relative">
        <div className="w-full mx-auto px-4 md:px-6">
          <ul className="flex justify-center space-x-8">
            {CATEGORIES.map((category, index) => (
              <MenuCategory
                key={category.path}
                category={category}
                isActive={activeMegaMenu === category.name}
                onToggle={() => toggleMegaMenu(category.name, index)}
                setActiveMegaMenu={setActiveMegaMenu}
              />
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
                {/* Change this condition to check for styles, metals, or featured items too */}
                {(category.subcategories.length > 0 || category.styles?.length || category.metals?.length || category.featured?.length) ? (
                  <div className="py-4">
                    <div
                      className="flex justify-between items-center text-gray-700 hover:text-amber-500 transition-colors cursor-pointer"
                      onClick={() => toggleMegaMenu(category.name === activeMegaMenu ? '' : category.name, 0)}
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
                        {/* Show subcategories if available */}
                        {category.subcategories.length > 0 && (
                          <>
                            {category.subcategories.map((subcategory) => (
                              <Link
                                key={subcategory.path}
                                href={subcategory.path}
                                className="block py-2 text-gray-600 hover:text-amber-500 flex items-center"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {subcategory.name}
                                {subcategory.icon && (
                                  <span className="icon ml-2">
                                    <Image
                                      src={subcategory.icon}
                                      alt=""
                                      width={20}
                                      height={14}
                                      className="object-contain"
                                    />
                                  </span>
                                )}
                              </Link>
                            ))}
                          </>
                        )}

                        {/* Show styles in mobile menu if available */}
                        {category.styles && category.styles.length > 0 && (
                          <>
                            <div className="py-1 my-2 border-t border-gray-100"></div>
                            <div className="font-medium text-sm text-gray-500">SHOP BY STYLE</div>
                            {category.styles.map((style) => (
                              <Link
                                key={style.path}
                                href={style.path}
                                className="block py-2 text-gray-600 hover:text-amber-500 flex items-center"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {style.name}
                                {style.icon && (
                                  <span className="icon ml-2">
                                    <Image
                                      src={style.icon}
                                      alt=""
                                      width={20}
                                      height={14}
                                      className="object-contain"
                                    />
                                  </span>
                                )}
                              </Link>
                            ))}
                          </>
                        )}

                        {/* Show metals in mobile menu if available */}
                        {category.metals && category.metals.length > 0 && (
                          <>
                            <div className="py-1 my-2 border-t border-gray-100"></div>
                            <div className="font-medium text-sm text-gray-500">SHOP BY METAL</div>
                            {category.metals.map((metal) => (
                              <Link
                                key={metal.path}
                                href={metal.path}
                                className="block py-2 text-gray-600 hover:text-amber-500 flex items-center"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {metal.name}
                                {metal.icon && (
                                  <span className="icon ml-2">
                                    <Image
                                      src={metal.icon}
                                      alt=""
                                      width={16}
                                      height={16}
                                      className="object-contain"
                                    />
                                  </span>
                                )}
                              </Link>
                            ))}
                          </>
                        )}

                        {/* Show featured items in mobile menu if available */}
                        {category.featured && category.featured.length > 0 && (
                          <>
                            <div className="py-1 my-2 border-t border-gray-100"></div>
                            <div className="font-medium text-sm text-gray-500">FEATURED</div>
                            {category.featured.map((item) => (
                              <Link
                                key={item.path}
                                href={item.path}
                                className="block py-2 text-gray-600 hover:text-amber-500 flex items-center"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {item.name}
                                {item.icon && (
                                  <span className="icon ml-2">
                                    <Image
                                      src={item.icon}
                                      alt=""
                                      width={20}
                                      height={14}
                                      className="object-contain"
                                    />
                                  </span>
                                )}
                              </Link>
                            ))}
                          </>
                        )}
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

      {/* Cart Sidebar */}
      <div 
        className={`fixed inset-y-0 right-0 z-[60] w-full max-w-md bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isCartSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        ref={cartSidebarRef}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-cinzel">Your Cart ({itemCount})</h2>
            <button 
              onClick={() => setIsCartSidebarOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-lg">Your cart is empty</p>
                <button 
                  onClick={() => setIsCartSidebarOpen(false)}
                  className="mt-4 px-6 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.cartItemId || `${item._id}-${Date.now()}-${Math.random()}`} className="flex border-b border-gray-100 pb-4">
                    <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                      <Image 
                        src={item.image} 
                        alt={item.title} 
                        width={80} 
                        height={80} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                        <button
                          onClick={() => removeItem(item.cartItemId || '')}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      {item.metalOption && (
                        <p className="mt-1 text-xs text-gray-500">
                          {item.metalOption.karat} {item.metalOption.color}
                        </p>
                      )}
                      <div className="mt-2 flex justify-between items-center">
                        <div className="flex items-center border rounded-full">
                          <button 
                            onClick={() => updateQuantity(item.cartItemId || '', item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-amber-500"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.cartItemId || '', item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-amber-500"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-gray-500 mb-4">Shipping and taxes calculated at checkout</p>
              <Link 
                href="/checkout"
                className="block w-full py-3 px-4 bg-amber-500 text-white text-center rounded-full hover:bg-amber-600 transition-colors"
                onClick={() => setIsCartSidebarOpen(false)}
              >
                Checkout
              </Link>
              <button 
                onClick={() => setIsCartSidebarOpen(false)}
                className="block w-full mt-2 py-3 px-4 border border-gray-300 text-gray-700 text-center rounded-full hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Overlay for cart sidebar */}
      {isCartSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-[55]"
          onClick={() => setIsCartSidebarOpen(false)}
        />
      )}
    </>
  );
}

const MenuCategory = ({
  category,
  isActive,
  onToggle,
  setActiveMegaMenu
}: {
  category: Category;
  isActive: boolean;
  onToggle: () => void;
  setActiveMegaMenu: (name: string | null) => void;
}) => {
  // Create a ref for the menu item
  const menuItemRef = useRef<HTMLLIElement>(null);
  
  // Calculate the left offset when the menu becomes active
  useEffect(() => {
    if (isActive && menuItemRef.current) {
      const rect = menuItemRef.current.getBoundingClientRect();
      const leftOffset = rect.left;
      
      // Set a CSS custom property for the left offset
      document.documentElement.style.setProperty('--menu-left-offset', `${leftOffset}px`);
    }
  }, [isActive]);

  return (
    <li
      className="relative"
      ref={menuItemRef}
      onMouseEnter={() => setActiveMegaMenu(category.name)}
      onMouseLeave={() => setActiveMegaMenu(null)}
    >
      <button
        onClick={onToggle}
        className="flex items-center w-full text-gray-600 hover:text-amber-500 py-4 px-2"
      >
        {category.name}
        <svg
          className={`ml-2 h-4 w-4 transition-transform duration-200 ${isActive ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isActive && (
        <div className="absolute top-full left-0 w-screen -translate-x-[var(--menu-left-offset)] bg-white shadow-lg z-[100] border-t border-gray-200">
          <div className="container mx-auto px-4 py-6">
            {/* Close button */}
            <button 
              onClick={onToggle}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6 text-gray-500 hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Main Categories Section */}
              {category.subcategories && category.subcategories.length > 0 && (
                <div className="col-span-1">
                  <h3 className="text-lg font-semibold mb-4">Categories</h3>
                  <div className="space-y-3">
                    {category.subcategories.map((item) => (
                      <Link 
                        key={item.path}
                        href={item.path}
                        className="flex items-center text-gray-600 hover:text-amber-500"
                        onClick={onToggle}
                      >
                        {item.icon && (
                         <Image 
                         src={item.icon} 
                         alt="" 
                         width={item.name.includes('Natural Gemstones') || item.name.includes('Lab Grown Gemstones') ? 25 : 20} 
                         height={item.name.includes('Natural Gemstones') || item.name.includes('Lab Grown Gemstones') ? 25 : 20} 
                         className="mr-3" 
                       />
                        )}
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Styles Section */}
              {category.styles && category.styles.length > 0 && (
                <div className="col-span-1">
                  <h3 className="text-lg font-semibold mb-4">Shop By Style</h3>
                  <div className="space-y-3">
                    {category.styles.map((style) => (
                      <Link 
                        key={style.path}
                        href={style.path}
                        className="flex items-center text-gray-600 hover:text-amber-500"
                        onClick={onToggle}
                      >
                        {style.icon && (
                          <Image src={style.icon} alt="" width={20} height={20} className="mr-3" />
                        )}
                        <span>{style.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Metals Section */}
              {category.metals && category.metals.length > 0 && (
                <div className="col-span-1">
                  <h3 className="text-lg font-semibold mb-4">Shop By Metal</h3>
                  <div className="space-y-3">
                    {category.metals.map((metal) => (
                      <Link 
                        key={metal.path}
                        href={metal.path}
                        className="flex items-center text-gray-600 hover:text-amber-500"
                        onClick={onToggle}
                      >
                        <span
                          className="w-5 h-5 rounded-full mr-3"
                          style={{
                            background:
                              metal.name.includes('Yellow Gold') ? 'linear-gradient(135deg, #FFD700, #FFA500)' :
                              metal.name.includes('White Gold') ? 'linear-gradient(135deg, #E0E0E0, #C0C0C0)' :
                              metal.name.includes('Rose Gold') ? 'linear-gradient(135deg, #F7CDCD, #E8A090)' :
                              metal.name.includes('Platinum') ? 'linear-gradient(135deg, #E5E4E2, #CECECE)' :
                              metal.name.includes('Palladium') ? 'linear-gradient(135deg, #D3D3D3, #B0B0B0)' :
                              metal.name.includes('Two Tone') ? 'linear-gradient(135deg, #FFD700, #C0C0C0)' :
                              'gray'
                          }}
                        ></span>
                        <span>{metal.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Featured Section with Banner */}
              {(category.featured || category.bannerImage) && (
                <div className="col-span-1 border-l border-gray-200 pl-6">
                  {category.featured && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-4">Featured</h3>
                      <div className="space-y-3">
                        {category.featured.map((item) => (
                          <Link 
                            key={item.path}
                            href={item.path}
                            className="flex items-center text-gray-600 hover:text-amber-500"
                            onClick={onToggle}
                          >
                            {item.icon && (
                              <Image src={item.icon} alt="" width={20} height={20} className="mr-3" />
                            )}
                            <span>{item.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  {category.bannerImage && (
                    <Link 
                      href={category.bannerLink || category.path}
                      onClick={onToggle}
                    >
                      <Image 
                        src={category.bannerImage} 
                        alt="" 
                        width={240}
                        height={320}
                        className="rounded-lg object-cover"
                      />
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </li>
  );
};
