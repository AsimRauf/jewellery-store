import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  HiHome, 
  HiUsers, 
  HiShoppingCart, 
  HiCog, 
  HiChartBar 
} from "react-icons/hi";
import { GiRing, GiDiamonds } from "react-icons/gi";

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    {
      title: "Dashboard",
      icon: <HiHome className="w-6 h-6" />,
      href: "/admin/dashboard"
    },
    {
      title: "Rings",
      icon: <GiRing className="w-6 h-6" />,
      href: "/admin/rings",
      submenu: [
        { title: "Wedding Rings", href: "/admin/rings/wedding" },
        { title: "Engagement Rings", href: "/admin/rings/engagement" },
        { title: "Eternity Rings", href: "/admin/rings/eternity" },
        { title: "Ring Settings", href: "/admin/rings/settings" },
      ]
    },
    {
      title: "Diamonds",
      icon: <GiDiamonds className="w-6 h-6" />,
      href: "/admin/diamonds",
      submenu: [
        { title: "All Diamonds", href: "/admin/diamonds/list" },
        { title: "Add Diamond", href: "/admin/diamonds" },
        { title: "Lab Diamonds", href: "/admin/diamonds?type=lab" },
        { title: "Natural Diamonds", href: "/admin/diamonds?type=natural" },
      ]
    },
    {
      title: "Orders",
      icon: <HiShoppingCart className="w-6 h-6" />,
      href: "/admin/orders"
    },
    {
      title: "Customers",
      icon: <HiUsers className="w-6 h-6" />,
      href: "/admin/customers"
    },
    {
      title: "Analytics",
      icon: <HiChartBar className="w-6 h-6" />,
      href: "/admin/analytics"
    },
    {
      title: "Settings",
      icon: <HiCog className="w-6 h-6" />,
      href: "/admin/settings"
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
            <Link href={item.href}>
              <div className={`
                flex items-center px-4 py-3 rounded-lg transition-colors
                ${isActive(item.href) ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'}
              `}>
                {item.icon}
                <span className="ml-3">{item.title}</span>
              </div>
            </Link>

            {item.submenu && isSubActive(item.href) && (
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