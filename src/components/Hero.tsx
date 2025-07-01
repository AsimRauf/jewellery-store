'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function Hero() {
  const [marginTop, setMarginTop] = useState('0');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const heroRef = useRef<HTMLElement>(null);

  // Carousel slides data
  const slides = [
    {
      id: 1,
      title: "Timeless Beauty",
      subtitle: "Eternal Love",
      description: "Discover our exquisite collection of handcrafted jewelry, where each piece tells a unique story of elegance and sophistication.",
      image: "/hero.png",
      imagePosition: "right", // Image on the right
      primaryButton: {
        text: "Explore Collections",
        href: "/engagement"
      },
      secondaryButton: {
        text: "Customize Ring",
        href: "/settings/all?start=setting"
      },
      backgroundColor: '#f0d4a4', // Default background color
    },
    {
      id: 2,
      title: "Diamond Dreams",
      subtitle: "Sparkle Forever",
      description: "Experience the brilliance of our premium diamond collection, carefully selected for their exceptional cut, clarity, and radiance.",
      image: "/hero2.png",
      imagePosition: "right", // Image in the center
      primaryButton: {
        text: "Shop Diamonds",
        href: "/diamond/all?start=diamond"
      },
      secondaryButton: {
        text: "Learn More",
        href: "/about"
      },
      backgroundColor: '#FDF6EC', // A slightly different background color
    },
    {
      id: 3,
      title: "Luxury Redefined",
      subtitle: "Crafted Perfection",
      description: "Indulge in our exclusive luxury pieces, meticulously crafted by master artisans using the finest materials and techniques.",
      image: "/hero3.png",
      imagePosition: "right", // Image on the left
      primaryButton: {
        text: "Luxury Collection",
        href: "/wedding"
      },
      secondaryButton: {
        text: "Book Consultation",
        href: "/consultation"
      },
      backgroundColor: '#e6c3a3', // Soft beige color
    }
  ];

    const [imagesLoaded, setImagesLoaded] = useState(false);

    useEffect(() => {
    // Preload images with high priority and track loading status
    let loadedCount = 0;
    const totalImages = slides.length;
    
    slides.forEach(slide => {
      const img = new window.Image();
      img.src = slide.image;
      img.loading = 'eager';
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setImagesLoaded(true);
        }
      };
    });

    // Set initial margin and mobile state based on screen width
    const updateLayout = () => {
      const width = window.innerWidth;
      setIsMobile(width < 1024);
      
      if (width < 768) {
        setMarginTop('0'); // Reset margin for mobile since we're changing layout
      } else if (width < 1024) {
        setMarginTop('2rem'); // For tablet
      } else {
        setMarginTop('0'); // For desktop
      }
    };

    // Set initial value
    updateLayout();

    // Update on resize
    window.addEventListener('resize', updateLayout);
    
    // Cleanup
    return () => window.removeEventListener('resize', updateLayout);
  }, [slides]);

  // Auto-slide effect, only start after images are loaded
  useEffect(() => {
    if (!imagesLoaded) return;
    
    const interval = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setTransitioning(false);
      }, 300); // Reduced transition duration for smoother change
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [slides.length, imagesLoaded]);

  // Manual slide navigation
  const goToSlide = (index: number) => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setTransitioning(false);
    }, 300); // Reduced transition duration for smoother change
  };

  const currentSlideData = slides[currentSlide];

  // Determine image container class based on slide position
  const getImageContainerClass = () => {
    return "flex-col lg:flex-row"; // Column for mobile (image top, text bottom), row for desktop
  };

  // Determine image justify content class
  // const getImageJustifyClass = () => {
  //   return "justify-center lg:justify-end"; // Center for mobile, right for desktop
  // };

  const backgroundColor = transitioning
    ? lightenColor(currentSlideData.backgroundColor, 20) // Lighten during transition
    : currentSlideData.backgroundColor;

  // Helper function to lighten a color (simple implementation)
  function lightenColor(color: string, percent: number): string {
    const num = parseInt(color.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 + (B < 255 ? (B < 1 ? 0 : B) : 255)).toString(16).slice(1);
  }

  return (
    <section 
      className="w-full overflow-visible relative transition-colors duration-500 ease-in-out"
      style={{ backgroundColor }}
      ref={heroRef}
    >
      {/* Main container with fixed height for consistency */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-auto min-h-[90vh] lg:h-[90vh] relative">
        {imagesLoaded ? (
          <>
            {/* Flex container for layout control with fixed height */}
            <div className={`flex ${getImageContainerClass()} h-full w-full min-h-[90vh] lg:h-[90vh] lg:justify-between`}>
              
              {/* Content section - Second on mobile, First on desktop - REDUCED WIDTH */}
              <div className={`w-full lg:w-[35%] flex flex-col justify-center 
                              order-2 lg:order-1
                              pt-8 pb-16 lg:py-0 
                              px-4 sm:px-6 lg:px-0 lg:mr-8 xl:mr-12
                              text-center lg:text-left 
                              relative z-10
                              min-h-[40vh] lg:min-h-full`}>
                
                {/* Heading with controlled spacing - using Monomakh */}
                <div className={`transition-all duration-500 ease-in-out flex flex-col justify-center h-full ${transitioning ? 'opacity-50' : 'opacity-100'}`}>
                  <h1 className="font-monomakh text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl 
                                 font-bold leading-tight mb-3 md:mb-4 lg:mb-6">
                    {currentSlideData.title}
                    <span className="block text-gray-800 whitespace-nowrap">{currentSlideData.subtitle}</span>
                  </h1>

                  {/* Description with controlled width and spacing */}
                  <p className="font-raleway text-sm md:text-base lg:text-lg xl:text-xl 
                                text-gray-800 
                                max-w-lg mx-auto lg:mx-0 
                                mb-6 md:mb-8 lg:mb-10">
                    {currentSlideData.description}
                  </p>

                  {/* Buttons with controlled spacing */}
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4 
                                  justify-center lg:justify-start">
                    <Link
                      href={currentSlideData.primaryButton.href}
                      className="inline-block bg-black text-white 
                                 px-5 py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-4 
                                 rounded-full font-medium text-sm md:text-base
                                 hover:bg-gray-900 transition-colors
                                 whitespace-nowrap"
                    >
                      {currentSlideData.primaryButton.text}
                    </Link>
                    <Link
                      href={currentSlideData.secondaryButton.href}
                      className="inline-block border-2 border-black text-black 
                                 px-5 py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-4 
                                 rounded-full font-medium text-sm md:text-base
                                 hover:bg-black hover:text-white transition-colors
                                 whitespace-nowrap"
                    >
                      {currentSlideData.secondaryButton.text}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Image section - flush right on desktop, unchanged on mobile */}
              <div 
                className="w-full lg:w-[65%] relative order-1 lg:order-2 flex items-end min-h-[50vh] lg:min-h-full pt-8 sm:pt-12 lg:pt-0"
                style={{ marginTop }}
              >
                <div className="h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[75vh] xl:h-[80vh] w-full flex items-end 
                                justify-center lg:justify-end relative overflow-visible">
                    <Image
                      src={currentSlideData.image}
                      alt={`${currentSlideData.title} - Elegant Jewelry Model`}
                      width={771}
                      height={1066}
                      className="h-full w-auto max-h-full object-contain object-bottom transition-all duration-300 ease-in-out"
                      priority={true}
                      sizes="(max-width: 1024px) 100vw, 65vw"
                      style={{
                        maxWidth: 'none',
                        height: '100%',
                        objectFit: 'contain',
                        objectPosition: 'bottom center',
                        opacity: transitioning ? 0 : 1,
                        transform: transitioning ? 'scale(1)' : 'scale(1)',
                        transition: 'opacity 300ms ease-in-out',
                        ...(isMobile && {
                          maskImage: 'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.1) 8%, rgba(0,0,0,0.5) 15%, rgba(0,0,0,0.8) 25%, black 35%)',
                          WebkitMaskImage: 'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.1) 8%, rgba(0,0,0,0.5) 15%, rgba(0,0,0,0.8) 25%, black 35%)',
                        })
                      }}
                    />
                </div>
              </div>
            </div>

            {/* Carousel dots - centered at bottom */}
            <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20">
              <div className="flex justify-center gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'bg-amber-500 scale-110' 
                        : 'bg-gray-300 hover:bg-amber-300'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="h-[90vh] w-full flex items-center justify-center bg-gray-200">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        )}
      </div>
    </section>
  );
}
