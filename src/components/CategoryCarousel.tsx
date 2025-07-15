'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSwipeable } from 'react-swipeable';
import { motion } from 'framer-motion';
import { 
  containerVariants, 
  createStaggerContainer, 
  slideUpVariants,
  getTextVariants
} from '@/lib/animations';

// Category data
const categories = [
  {
    id: 'engagement-rings',
    title: 'Engagement Rings',
    image: '/categories/engagement-rings.jpg',
    link: '/engagement/all'
  },
  {
    id: 'gemstone-rings',
    title: 'Gemstone Rings',
    image: '/categories/gemstone-rings.jpg',
    link: '/engagement/all?gemstoneTypes=Ruby,Sapphire,Emerald'
  },
  {
    id: 'lab-diamond-rings',
    title: 'Lab Diamond Rings',
    image: '/categories/lab-diamond-rings.jpg',
    link: '/engagement/all?stoneTypes=Lab%20Diamond'
  },
  {
    id: 'womens-wedding-rings',
    title: "Women's Wedding Rings",
    image: '/categories/womens-wedding-rings.jpg',
    link: '/wedding/women-s-wedding-rings'
  },
  {
    id: 'mens-wedding-rings',
    title: "Men's Wedding Rings",
    image: '/categories/mens-wedding-rings.jpg',
    link: '/wedding/men-s-wedding-rings'
  },
  {
    id: 'fine-jewelry',
    title: "Fine Jewelry",
    image: '/categories/fine-jewelry.jpg',
    link: '/jewelry/all'
  }
];

export default function CategoryCarousel() {
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
      if (isMobile && activeIndex < categories.length - 1) {
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
    if (activeIndex < categories.length - 1) {
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
      setActiveIndex(categories.length - 1); // Loop to last slide
    }
  };

  return (
    <motion.section 
      className="py-12 bg-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl font-monomakh text-center mb-8"
          variants={getTextVariants('left')}
        >
          Shop by Category
        </motion.h2>
        
        <div className="relative" {...handlers}>
          {/* Mobile Carousel */}
          <div className={`md:hidden relative overflow-hidden`} ref={carouselRef}>
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {categories.map((category) => (
                <div key={category.id} className="w-full flex-shrink-0 px-2">
                  <Link href={category.link} className="block">
                    <div className="relative rounded-lg overflow-hidden mb-3 aspect-square shadow-sm bg-white p-4">
                      <div className="relative w-full h-full">
                        <Image
                          src={category.image}
                          alt={category.title}
                          fill
                          className="object-contain hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 90vw, 250px"
                        />
                      </div>
                    </div>
                    <h3 className="text-center font-medium text-gray-800">{category.title}</h3>
                  </Link>
                </div>
              ))}
            </div>
            
            {/* Mobile Navigation Dots */}
            <div className="flex justify-center mt-4">
              {categories.map((_, index) => (
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
          <motion.div 
            className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6"
            variants={createStaggerContainer()}
          >
            {categories.map((category) => (
              <motion.div key={category.id} variants={slideUpVariants}>
                <Link href={category.link} className="block group">
                  <div className="relative rounded-lg overflow-hidden mb-3 aspect-square shadow-sm bg-white p-4">
                    <div className="relative w-full h-full">
                      <Image
                        src={category.image}
                        alt={category.title}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 1024px) 50vw, 16vw"
                      />
                    </div>
                  </div>
                  <h3 className="text-center font-medium text-gray-800">{category.title}</h3>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}