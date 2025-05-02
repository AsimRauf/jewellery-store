'use client';

import React from 'react';
import { GiDiamondRing, GiCutDiamond } from 'react-icons/gi';
import { MdOutlineVerified } from 'react-icons/md';
import Link from 'next/link';

const features = [
  {
    id: 'craftsmanship',
    title: 'Expert Craftsmanship',
    description: 'Each piece is meticulously handcrafted by our master jewelers with decades of experience.',
    icon: <GiDiamondRing className="h-12 w-12 lg:h-16 lg:w-16 text-amber-500 mx-auto mb-4 lg:mb-6" />
  },
  {
    id: 'quality',
    title: 'Ethically Sourced Materials',
    description: 'We use only conflict-free diamonds and responsibly sourced precious metals in all our jewelry.',
    icon: <MdOutlineVerified className="h-12 w-12 lg:h-16 lg:w-16 text-amber-500 mx-auto mb-4 lg:mb-6" />
  },
  {
    id: 'guarantee',
    title: 'Lifetime Warranty',
    description: 'We stand behind our quality with a lifetime warranty on all our fine jewelry pieces.',
    icon: <GiCutDiamond className="h-12 w-12 lg:h-16 lg:w-16 text-amber-500 mx-auto mb-4 lg:mb-6" />
  }
];

export default function FeatureBox() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-12 lg:mb-16">
          {features.map((feature) => (
            <div 
              key={feature.id} 
              className="text-center p-6 lg:p-10 rounded-lg transition-all duration-300 hover:shadow-lg lg:min-h-[320px] flex flex-col justify-center"
            >
              {feature.icon}
              <h3 className="text-xl lg:text-2xl font-monomakh mb-3 lg:mb-5">{feature.title}</h3>
              <p className="text-gray-600 lg:text-lg">{feature.description}</p>
            </div>
          ))}
        </div>
        
        {/* Centered button to showcase collections */}
        <div className="text-center mt-8 lg:mt-12">
          <Link 
            href="/collections" 
            className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 lg:px-12 lg:py-4 lg:text-lg rounded-full font-medium transition-colors"
          >
            Explore Our Masterpieces
          </Link>
        </div>
      </div>
    </section>
  );
}