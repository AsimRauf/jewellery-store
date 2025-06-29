import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  HiHome, 
  HiShoppingCart
} from "react-icons/hi";
import { GiRing, GiDiamonds, GiCrystalGrowth } from "react-icons/gi";

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  href: string;
  isParent?: boolean;
  submenu?: Array<{
    title: string;
    href: string;
  }>;
}

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    {
      title: "Dashboard",
      icon: <HiHome className="w-6 h-6" />,
      href: "/admin/dashboard"
    },
    {
      title: "Rings",
      icon: <GiRing className="w-6 h-6" />,
      href: "/admin/rings",
      isParent: true,
      submenu: [
        { title: "📋 Wedding Rings List", href: "/admin/rings/wedding/list" },
        { title: "➕ Add Wedding Ring", href: "/admin/rings/wedding" },
        { title: "📋 Engagement Rings List", href: "/admin/rings/engagement/list" },
        { title: "➕ Add Engagement Ring", href: "/admin/rings/engagement" },
        { title: "📋 Settings List", href: "/admin/rings/settings/list" },
        { title: "➕ Add Setting", href: "/admin/rings/settings" },
      ]
    },
    {
      title: "Diamonds",
      icon: <GiDiamonds className="w-6 h-6" />,
      href: "/admin/diamonds",
      isParent: true,
      submenu: [
        { title: "📋 Diamonds List", href: "/admin/diamonds/list" },
        { title: "➕ Add Diamond", href: "/admin/diamonds" },
      ]
    },
    {
      title: "Gemstones",
      icon: <GiCrystalGrowth className="w-6 h-6" />,
      href: "/admin/gemstones",
      isParent: true,
      submenu: [
        { title: "📋 Gemstones List", href: "/admin/gemstones/list" },
        { title: "➕ Add Gemstone", href: "/admin/gemstones" },
      ]
    },
    {
      title: "Orders",
      icon: <HiShoppingCart className="w-6 h-6" />,
      href: "/admin/orders"
    }
  ];

  const isActive = (path: string) => pathname === path;
  const isSubActive = (path: string) => pathname?.startsWith(path) ?? false;

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-purple-600">Admin Panel</h2>
      </div>

      <nav className="mt-6 px-4">
        {menuItems.map((item) => (
          <div key={item.href} className="mb-4">
            {item.isParent ? (
              <div className={`
                flex items-center px-4 py-3 rounded-lg transition-colors
                ${isSubActive(item.href) ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'}
              `}>
                {item.icon}
                <span className="ml-3">{item.title}</span>
              </div>
            ) : (
              <Link href={item.href}>
                <div className={`
                  flex items-center px-4 py-3 rounded-lg transition-colors
                  ${isActive(item.href) ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'}
                `}>
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
                </div>
              </Link>
            )}

            {item.submenu && (item.isParent || isSubActive(item.href)) && (
              <div className="ml-8 mt-2 space-y-2">
                {item.submenu.map((subItem) => (
                  <Link key={subItem.href} href={subItem.href}>
                    <div className={`
                      px-4 py-2 rounded-md text-sm transition-colors
                      ${isActive(subItem.href) ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-50'}
                    `}>
                      {subItem.title}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;