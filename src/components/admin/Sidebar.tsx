import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    HiHome,
    HiShoppingCart,
    HiChevronDown,
    HiChevronRight,
    HiViewList,
    HiPlus,
    HiSparkles
} from "react-icons/hi";
import { GiRing, GiDiamonds, GiCrystalGrowth } from "react-icons/gi";

interface SubMenuItem {
    title: string;
    href: string;
    type: 'list' | 'add';
    icon: React.ReactNode;
}

interface MenuItem {
    title: string;
    icon: React.ReactNode;
    href?: string;
    category?: string;
    submenu?: SubMenuItem[];
}

interface MenuSection {
    title: string;
    items: MenuItem[];
}

const Sidebar = () => {
    const pathname = usePathname();
    const [expandedSections, setExpandedSections] = useState<string[]>(['products']);

    const menuSections: MenuSection[] = [
        {
            title: "Overview",
            items: [
                {
                    title: "Dashboard",
                    icon: <HiHome className="w-5 h-5" />,
                    href: "/admin/dashboard"
                }
            ]
        },
        {
            title: "Products",
            items: [
                {
                    title: "Wedding Rings",
                    icon: <GiRing className="w-5 h-5" />,
                    category: "rings-wedding",
                    submenu: [
                        {
                            title: "View All",
                            href: "/admin/rings/wedding/list",
                            type: 'list',
                            icon: <HiViewList className="w-4 h-4" />
                        },
                        {
                            title: "Add New",
                            href: "/admin/rings/wedding",
                            type: 'add',
                            icon: <HiPlus className="w-4 h-4" />
                        }
                    ]
                },
                {
                    title: "Engagement Rings",
                    icon: <GiRing className="w-5 h-5" />,
                    category: "rings-engagement",
                    submenu: [
                        {
                            title: "View All",
                            href: "/admin/rings/engagement/list",
                            type: 'list',
                            icon: <HiViewList className="w-4 h-4" />
                        },
                        {
                            title: "Add New",
                            href: "/admin/rings/engagement",
                            type: 'add',
                            icon: <HiPlus className="w-4 h-4" />
                        }
                    ]
                },
                {
                    title: "Settings",
                    icon: <GiRing className="w-5 h-5" />,
                    category: "settings",
                    submenu: [
                        {
                            title: "View All",
                            href: "/admin/rings/settings/list",
                            type: 'list',
                            icon: <HiViewList className="w-4 h-4" />
                        },
                        {
                            title: "Add New",
                            href: "/admin/rings/settings",
                            type: 'add',
                            icon: <HiPlus className="w-4 h-4" />
                        }
                    ]
                },
                {
                    title: "Diamonds",
                    icon: <GiDiamonds className="w-5 h-5" />,
                    category: "diamonds",
                    submenu: [
                        {
                            title: "View All",
                            href: "/admin/diamonds/list",
                            type: 'list',
                            icon: <HiViewList className="w-4 h-4" />
                        },
                        {
                            title: "Add New",
                            href: "/admin/diamonds",
                            type: 'add',
                            icon: <HiPlus className="w-4 h-4" />
                        }
                    ]
                },
                {
                    title: "Gemstones",
                    icon: <GiCrystalGrowth className="w-5 h-5" />,
                    category: "gemstones",
                    submenu: [
                        {
                            title: "View All",
                            href: "/admin/gemstones/list",
                            type: 'list',
                            icon: <HiViewList className="w-4 h-4" />
                        },
                        {
                            title: "Add New",
                            href: "/admin/gemstones",
                            type: 'add',
                            icon: <HiPlus className="w-4 h-4" />
                        }
                    ]
                }
            ]
        },
        {
            title: "Fine Jewelry",
            items: [
                {
                    title: "Necklaces",
                    icon: <HiSparkles className="w-5 h-5" />,
                    submenu: [
                        {
                            title: "All Necklaces",
                            href: "/admin/necklaces/list",
                            type: 'list',
                            icon: <HiViewList className="w-4 h-4" />
                        },
                        {
                            title: "Add New",
                            href: "/admin/necklaces",
                            type: 'add',
                            icon: <HiPlus className="w-4 h-4" />
                        }
                    ]
                },
                {
                    title: "Earrings",
                    icon: <HiSparkles className="w-5 h-5" />,
                    submenu: [
                        {
                            title: "All Earrings",
                            href: "/admin/earrings/list",
                            type: 'list',
                            icon: <HiViewList className="w-4 h-4" />
                        },
                        {
                            title: "Add New",
                            href: "/admin/earrings",
                            type: 'add',
                            icon: <HiPlus className="w-4 h-4" />
                        }
                    ]
                },
                {
                    title: "Bracelets",
                    icon: <HiSparkles className="w-5 h-5" />,
                    submenu: [
                        {
                            title: "All Bracelets",
                            href: "/admin/bracelets/list",
                            type: 'list',
                            icon: <HiViewList className="w-4 h-4" />
                        },
                        {
                            title: "Add New",
                            href: "/admin/bracelets",
                            type: 'add',
                            icon: <HiPlus className="w-4 h-4" />
                        }
                    ]
                },
                {
                    title: "Men's Jewelry",
                    icon: <HiSparkles className="w-5 h-5" />,
                    submenu: [
                        {
                            title: "All Men's Jewelry",
                            href: "/admin/mens-jewelry/list",
                            type: 'list',
                            icon: <HiViewList className="w-4 h-4" />
                        },
                        {
                            title: "Add New",
                            href: "/admin/mens-jewelry",
                            type: 'add',
                            icon: <HiPlus className="w-4 h-4" />
                        }
                    ]
                }
            ]
        },
        {
            title: "Sales",
            items: [
                {
                    title: "Orders",
                    icon: <HiShoppingCart className="w-5 h-5" />,
                    href: "/admin/orders"
                }
            ]
        }
    ];

    const isActive = (path: string) => pathname === path;
    const isSubActive = (path: string) => pathname?.startsWith(path) ?? false;

    const toggleSection = (category: string) => {
        setExpandedSections(prev =>
            prev.includes(category)
                ? prev.filter(s => s !== category)
                : [...prev, category]
        );
    };

    const isSectionExpanded = (category: string) => {
        if (!category) return false;
        return expandedSections.includes(category) || isSubActive(`/admin/${category}`);
    };

    return (
        <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 border-r border-gray-200">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
                <p className="text-sm text-gray-500 mt-1">Jewelry Store</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4">
                {menuSections.map((section) => (
                    <div key={section.title} className="mb-6">
                        {/* Section Header */}
                        <div className="px-6 mb-3">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                {section.title}
                            </h3>
                        </div>

                        {/* Section Items */}
                        <div className="space-y-1 px-3">
                            {section.items.map((item) => (
                                <div key={item.title} className="space-y-1">
                                    {/* Main Item */}
                                    {item.href ? (
                                        // Direct link item
                                        <Link href={item.href}>
                                            <div className={`
                        flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
                        ${isActive(item.href)
                                                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                                }
                      `}>
                                                {item.icon}
                                                <span className="ml-3">{item.title}</span>
                                            </div>
                                        </Link>
                                    ) : (
                                        // Expandable parent item
                                        <button
                                            onClick={() => toggleSection(item.category!)}
                                            className={`
                        w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors
                        ${isSectionExpanded(item.category!) || isSubActive(`/admin/${item.category}`)
                                                    ? 'bg-gray-100 text-gray-900'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                }
                      `}
                                        >
                                            <div className="flex items-center">
                                                {item.icon}
                                                <span className="ml-3">{item.title}</span>
                                            </div>
                                            {isSectionExpanded(item.category!) ? (
                                                <HiChevronDown className="w-4 h-4" />
                                            ) : (
                                                <HiChevronRight className="w-4 h-4" />
                                            )}
                                        </button>
                                    )}

                                    {/* Submenu */}
                                    {item.submenu && isSectionExpanded(item.category!) && (
                                        <div className="ml-6 pl-4 border-l border-gray-200 space-y-1">
                                            {item.submenu.map((subItem) => (
                                                <Link key={subItem.href} href={subItem.href}>
                                                    <div className={`
                            flex items-center px-3 py-2 rounded-md text-sm transition-colors
                            ${isActive(subItem.href)
                                                            ? 'bg-purple-50 text-purple-700 border-l-2 border-purple-500'
                                                            : subItem.type === 'add'
                                                                ? 'text-green-600 hover:bg-green-50'
                                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                        }
                          `}>
                                                        {subItem.icon}
                                                        <span className="ml-2">{subItem.title}</span>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;