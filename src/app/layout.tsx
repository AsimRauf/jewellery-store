import "./globals.css";
import { poppins } from '@/utils/fonts';
import { UserProvider } from "../context/UserContext";
import { CartProvider } from "../context/CartContext";
import ClientLayout from "@/components/ClientLayout";
import { Toaster } from 'react-hot-toast';

// Root layout component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <head>
        <link href="https://db.onlinewebfonts.com/c/0928a012dc26f49ac4fbc90fa9f7460a?family=Monomakh+Unicode" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Elegance Jewels - Fine jewelry for life's precious moments" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </head>
      <body className="font-poppins">
        <UserProvider>
          <CartProvider>
            <ClientLayout>{children}</ClientLayout>
            <Toaster />
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
