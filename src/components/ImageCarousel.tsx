'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSwipeable } from 'react-swipeable';
import { motion } from 'framer-motion';
import { containerVariants, createStaggerContainer, slideUpVariants, getTextVariants } from '@/lib/animations';

interface ImageItem {
  src: string;
  alt: string;
  title: string;
  href?: string;
}

interface ImageCarouselProps {
  title: string;
  images?: ImageItem[];
  folder?: 'categories' | 'styles';
}

export default function ImageCarousel({ title, images: initialImages, folder }: ImageCarouselProps) {
  const [images, setImages] = useState<ImageItem[]>(initialImages || []);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchImages() {
      if (!folder) return;
      try {
        const response = await fetch(`/api/images?folder=${folder}`);
        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }
        const data = await response.json();
        const fetchedImages = data.images.map((img: { name: string; path: string; }) => ({
          src: img.path,
          alt: img.name,
          title: img.name.replace(/-/g, ' ').replace(/\.[^/.]+$/, ""),
          href: `/engagement/${folder}/${img.name.replace(/\.[^/.]+$/, "")}`
        }));
        setImages(fetchedImages);
      } catch (error) {
        console.error(error);
      }
    }

    if (folder) {
      fetchImages();
    } else if (initialImages) {
      setImages(initialImages);
    }
  }, [folder, initialImages]);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (isMobile && activeIndex < images.length - 1) {
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

  const nextSlide = () => {
    if (images.length === 0) return;
    if (activeIndex < images.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else {
      setActiveIndex(0);
    }
  };

  const prevSlide = () => {
    if (images.length === 0) return;
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    } else {
      setActiveIndex(images.length - 1);
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
          {title}
        </motion.h2>
        
        <div className="relative" {...handlers}>
          <div className={`md:hidden relative overflow-hidden`} ref={carouselRef}>
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {images.map((image, index) => (
                <div key={index} className="w-full flex-shrink-0 px-2">
                  {image.href ? (
                    <Link href={image.href} className="block">
                      <div className="relative rounded-lg overflow-hidden mb-3 aspect-square shadow-lg bg-gray-100">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 90vw, 280px"
                        />
                      </div>
                      <h3 className="text-center font-medium text-gray-800 text-lg">{image.title}</h3>
                    </Link>
                  ) : (
                    <div>
                      <div className="relative rounded-lg overflow-hidden mb-3 aspect-square shadow-lg bg-gray-100">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 90vw, 280px"
                        />
                      </div>
                      <h3 className="text-center font-medium text-gray-800 text-lg">{image.title}</h3>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex justify-center mt-4">
              {images.map((_, index) => (
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
          
          <motion.div
            className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6"
            variants={createStaggerContainer()}
          >
            {images.map((image, index) => (
              <motion.div key={index} variants={slideUpVariants}>
                {image.href ? (
                  <Link href={image.href} className="block group">
                    <div className="relative rounded-lg overflow-hidden mb-3 aspect-square shadow-lg bg-gray-100">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 1024px) 50vw, 16vw"
                      />
                    </div>
                    <h3 className="text-center font-medium text-gray-800 text-lg">{image.title}</h3>
                  </Link>
                ) : (
                  <div className="group cursor-pointer">
                    <div className="relative rounded-lg overflow-hidden mb-3 aspect-square shadow-lg bg-gray-100">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 1024px) 50vw, 16vw"
                      />
                    </div>
                    <h3 className="text-center font-medium text-gray-800 text-lg">{image.title}</h3>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
