'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  getTextVariants, 
  heroImageVariants, 
  buttonVariants, 
  createStaggerContainer,
  containerVariants
} from '@/lib/animations';

export default function EngagementSection() {
  return (
    <motion.section 
      className="bg-gradient-to-r from-amber-50 to-amber-100"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto px-10 py-10 lg:px-0 lg:py-0 max-w-7xl">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-16">
          {/* Right content - Text and CTA */}
          <motion.div 
            className="w-full lg:w-1/2 text-center lg:text-left"
            variants={getTextVariants('right')}
          >
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-monomakh mb-6 leading-tight">
              Find Your Perfect <br />
              <span className="text-amber-700">Engagement Ring</span>
            </h2>
            
            <p className="text-gray-700 text-lg lg:text-xl mb-8 max-w-lg mx-auto lg:mx-0">
              Celebrate your love story with our exquisite collection of engagement rings, 
              each crafted to symbolize your unique journey together.
            </p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              variants={createStaggerContainer()}
            >
              <motion.div variants={buttonVariants}>
                <Link
                  href="/engagement/all"
                  className="inline-block bg-amber-600 hover:bg-amber-700 text-white 
                           px-6 py-3 md:px-8 md:py-4 
                           rounded-full font-medium 
                           transition-colors"
                >
                  Browse Engagement Rings
                </Link>
              </motion.div>
              <motion.div variants={buttonVariants}>
                <Link
                  href="/customize/engagement"
                  className="inline-block border-2 border-amber-600 text-amber-600 
                           px-6 py-3 md:px-8 md:py-4 
                           rounded-full font-medium 
                           hover:bg-amber-600 hover:text-white transition-colors"
                >
                  Design Your Own
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Left content - Image (hidden on mobile) */}
          <motion.div 
            className="hidden lg:flex w-full lg:w-1/2 justify-center lg:justify-start"
            variants={heroImageVariants}
          >
            <div className="relative w-full h-auto">
              <Image
                src="/images/engagement-section.png"
                alt="Model wearing an elegant engagement ring"
                width={500}
                height={600}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}