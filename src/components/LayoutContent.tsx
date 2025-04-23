'use client';

import { useUser } from "@/context/UserContext";
import HeadlineBanner from "./HeadlineBanner";
import Navbar from "./Navbar";
import { usePathname } from 'next/navigation';

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const pathname = usePathname();
  
  // Check if current path is an admin route
  const isAdminRoute = pathname?.startsWith('/admin');
  
  // Don't show navbar and headline banner for admin routes or if user is admin
  const showNavbar = !isAdminRoute && (!user || user.role !== 'admin');

  return (
    <div className="flex flex-col min-h-screen">
      {showNavbar && <HeadlineBanner />}
      {showNavbar && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {/* Footer would go here */}
    </div>
  );
}