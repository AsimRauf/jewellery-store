'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSwipeable } from 'react-swipeable';

// Style data with updated images
const styles = [
  {
    id: 'vintage',
    title: 'Vintage',
    image: '/styles/vintage.png',
    link: '/engagement/style-vintage'
  },
  {
    id: 'celtic',
    title: 'Celtic',
    image: '/styles/celtic.png',
    link: '/engagement/style-celtic'
  },
  {
    id: 'two-tone',
    title: 'Two Tone',
    image: '/styles/two-tone.png',
    link: '/engagement/style-two-tone'
  },
  {
    id: 'nature-inspired',
    title: 'Nature Inspired',
    image: '/styles/nature-inspired.png',
    link: '/engagement/style-nature-inspired'
  },
  {
    id: 'classic',
    title: 'Classic',
    image: '/styles/classic.png',
    link: '/engagement/style-classic'
  },
  {
    id: 'halo',
    title: 'Halo',
    image: '/styles/halo.jpg',
    link: '/engagement/style-halo'
  },
  {
    id: 'three-stone',
    title: 'Three Stone',
    image: '/styles/three-stone.jpg',
    link: '/engagement/style-three-stone'
  }
];

export default function StyleCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Swipe handlers for mobile
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (isMobile && activeIndex < styles.length - 1) {
        setActiveIndex(activeIndex + 1);
      }
    },
    onSwipedRight: () => {
      if (isMobile && activeIndex > 0) {
        setActiveIndex(activeIndex - 1);
      }
    },
    trackMouse: true
  });

  // Handle next slide
  const nextSlide = () => {
    if (activeIndex < styles.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else {
      setActiveIndex(0); // Loop back to first slide
    }
  };

  // Handle previous slide
  const prevSlide = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    } else {
      setActiveIndex(styles.length - 1); // Loop to last slide
    }
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-monomakh text-center mb-8">Shop by Style</h2>
        
        <div className="relative" {...handlers}>
          {/* Mobile Carousel */}
          <div className={`md:hidden relative overflow-hidden`} ref={carouselRef}>
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {styles.map((style) => (
                <div key={style.id} className="w-full flex-shrink-0 px-2">
                  <Link href={style.link} className="block">
                    <div className="relative rounded-lg overflow-hidden mb-3 aspect-square shadow-sm bg-white p-4">
                      <div className="relative w-full h-full">
                        <Image
                          src={style.image}
                          alt={style.title}
                          fill
                          className="object-contain hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 90vw, 250px"
                        />
                      </div>
                    </div>
                    <h3 className="text-center font-medium text-gray-800">{style.title}</h3>
                  </Link>
                </div>
              ))}
            </div>
            
            {/* Mobile Navigation Dots */}
            <div className="flex justify-center mt-4">
              {styles.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2 h-2 mx-1 rounded-full ${
                    index === activeIndex ? 'bg-amber-500' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            
            {/* Mobile Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md z-10"
              aria-label="Previous slide"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md z-10"
              aria-label="Next slide"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-6">
            {styles.map((style) => (
              <Link key={style.id} href={style.link} className="block group">
                <div className="relative rounded-lg overflow-hidden mb-3 aspect-square shadow-sm bg-white p-4">
                  <div className="relative w-full h-full">
                    <Image
                      src={style.image}
                      alt={style.title}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 1024px) 50vw, 14vw"
                    />
                  </div>
                </div>
                <h3 className="text-center font-medium text-gray-800">{style.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}