import { Cinzel, Raleway } from 'next/font/google';

// Cinzel for headings
export const cinzel = Cinzel({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cinzel',
  weight: ['400', '500', '700', '900'],
});

// Raleway for body text
export const raleway = Raleway({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-raleway',
  weight: ['300', '400', '500', '600', '700'],
});