import "./globals.css";
import { cinzel, raleway } from '@/utils/fonts';
import { UserProvider } from "../context/UserContext";
import ClientLayout from "@/components/ClientLayout";

// Root layout component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${raleway.variable}`}>
      <body className="font-raleway">
        <UserProvider>
          <ClientLayout>{children}</ClientLayout>
        </UserProvider>
      </body>
    </html>
  );
}