import type { Metadata } from "next";
import { cinzel, raleway } from '@/utils/fonts';
import "./globals.css";
import { UserProvider } from "../context/UserContext";
import HeadlineBanner from "../components/HeadlineBanner";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "Jewelry Store",
  description: "Exquisite jewelry for every occasion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${raleway.variable}`}>
      <body className="font-raleway">
        <UserProvider>
          <div className="flex flex-col min-h-screen">
            <HeadlineBanner />
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            {/* Footer would go here */}
          </div>
        </UserProvider>
      </body>
    </html>
  );
}