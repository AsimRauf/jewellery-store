'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Hero() {
  const [marginTop, setMarginTop] = useState('0');

  useEffect(() => {
    // Set initial margin based on screen width
    const updateMargin = () => {
      if (window.innerWidth < 768) {
        setMarginTop('2rem'); // For mobile - using a much larger value
      } else if (window.innerWidth < 1024) {
        setMarginTop('2rem'); // For tablet
      } else {
        setMarginTop('0'); // For desktop
      }
    };

    // Set initial value
    updateMargin();

    // Update on resize
    window.addEventListener('resize', updateMargin);
    
    // Cleanup
    return () => window.removeEventListener('resize', updateMargin);
  }, []);

  return (
    <section className="bg-[#f0d4a4] w-full overflow-visible">
      {/* Main container with modified height for mobile */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-auto min-h-[90vh] lg:h-[90vh] relative">
        
        {/* Flex container for layout control */}
        <div className="flex flex-col lg:flex-row h-full w-full">
          
          {/* Left content section - vertically centered */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center 
                          pt-16 pb-8 lg:py-0 
                          px-4 sm:px-6 lg:px-0 
                          text-center lg:text-left 
                          relative z-10">
            
            {/* Heading with controlled spacing - using Monomakh */}
            <h1 className="font-monomakh text-4xl md:text-5xl lg:text-6xl xl:text-7xl 
                           font-bold leading-tight mb-4 md:mb-6">
              Timeless Beauty
              <span className="block text-gray-800">Eternal Love</span>
            </h1>

            {/* Description with controlled width and spacing */}
            <p className="font-raleway text-base md:text-lg lg:text-xl 
                          text-gray-800 
                          max-w-lg mx-auto lg:mx-0 
                          mb-8 md:mb-10">
              Discover our exquisite collection of handcrafted jewelry, where each piece tells a unique story of elegance and sophistication.
            </p>

            {/* Buttons with controlled spacing */}
            <div className="flex flex-col sm:flex-row gap-4 
                            justify-center lg:justify-start">
              <Link
                href="/collections"
                className="inline-block bg-black text-white 
                           px-6 py-3 md:px-8 md:py-4 
                           rounded-full font-medium 
                           hover:bg-gray-900 transition-colors"
              >
                Explore Collections
              </Link>
              <Link
                href="/customize"
                className="inline-block border-2 border-black text-black 
                           px-6 py-3 md:px-8 md:py-4 
                           rounded-full font-medium 
                           hover:bg-black hover:text-white transition-colors"
              >
                Customize Ring
              </Link>
            </div>
          </div>
          
          {/* Right image container with dynamic inline styles */}
          <div 
            className="w-full lg:w-1/2 
                      relative lg:relative 
                      mt-10 lg:mt-0
                      flex justify-center lg:justify-end 
                      items-end lg:items-end"
            style={{ marginTop }}
          >
            <div className="h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[75vh] xl:h-[80vh]
                           w-full flex items-end justify-center lg:justify-end">
              <Image
                src="/hero.png"
                alt="Elegant Jewelry Model"
                width={771}
                height={1066}
                className="h-full w-auto max-h-full object-contain object-bottom"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}