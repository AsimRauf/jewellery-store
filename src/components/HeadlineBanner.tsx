'use client';

import Link from 'next/link';

export default function HeadlineBanner() {
  return (
    <div className="bg-[#f0d4a4] text-gray-800 text-xs py-1.5 w-full overflow-hidden">
      <div className="w-full mx-auto flex justify-center items-center px-4">
        <Link 
          href="/payment-options" 
          className="hover:underline flex items-center mx-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span>Flexible Payment Options</span>
        </Link>
        <div className="mx-4 h-4 border-r border-gray-500"></div>
        <Link 
          href="/customer-service" 
          className="hover:underline flex items-center mx-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span>24/7 Customer Service</span>
        </Link>
      </div>
    </div>
  );
}