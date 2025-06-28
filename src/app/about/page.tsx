import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - Arise Precious Gems & Arise Jewel | Fine Gemstones & Jewelry',
  description: 'Learn about Arise Precious Gems heritage since 1959 and Arise Jewel custom jewelry since 1996. Three generations of expertise in gemstones and fine jewelry craftsmanship.',
  keywords: 'arise precious gems, arise jewel, loose gemstones, custom jewelry, fine gemstones, designer jewelry, sapphires, rubies, emeralds',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-amber-50 to-amber-100 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-cinzel text-amber-600 mb-6">
              About Us
            </h1>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Where generations of expertise meet the finest natural treasures
            </p>
          </div>
        </div>
      </section>

      {/* Arise Precious Gems Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-cinzel text-amber-600 mb-6">💎 About Our Loose Gemstones</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  At <strong>Arise Precious Gems</strong>, gemstones are more than a product—they're our heritage. 
                  Our journey began in <strong>1959</strong>, when our grandfather mastered the art of gem cutting and built 
                  a reputation as a trusted gemstone dealer. Now in our third generation, we continue that legacy 
                  by offering ethically sourced, high-quality loose gemstones to jewelers, collectors, and 
                  gemstone enthusiasts around the world.
                </p>
                <p>
                  We specialize in a wide variety of fine gemstones—sapphires, rubies, emeralds, spinels, 
                  tourmalines, and many more—each hand-selected for its beauty, rarity, and authenticity. 
                  Whether you're a jewelry designer looking for the perfect stone or a retailer sourcing inventory, 
                  we provide reliable service, competitive pricing, and deep industry knowledge to help you make 
                  informed, confident choices.
                </p>
                <p className="font-medium text-amber-700">
                  Arise Precious Gems — Where generations of expertise meet the finest natural treasures.
                </p>
              </div>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
              <div className="w-full h-full bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex items-center justify-center">
                <div className="text-center text-gray-800">
                  <div className="text-6xl mb-4">💎</div>
                  <p className="text-lg font-medium">Heritage Since 1959</p>
                  <p className="text-sm mt-2">Third Generation Expertise</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Arise Jewel Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
              <div className="w-full h-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center">
                <div className="text-center text-amber-800">
                  <div className="text-6xl mb-4">✨</div>
                  <p className="text-lg font-medium">Crafting Excellence Since 1996</p>
                  <p className="text-sm mt-2">Custom-Made Jewelry</p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-cinzel text-amber-600 mb-6">💎 About Our Jewelry</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  At <strong>Arise Jewel</strong>, we turn exceptional stones into meaningful designs. 
                  Since <strong>1996</strong>, we've been crafting fine designer jewelry and offering custom-made pieces 
                  that reflect elegance, personality, and timeless value. Our jewelry line is a natural extension 
                  of our gemstone heritage—bringing each stone's beauty to life in one-of-a-kind creations.
                </p>
                <p>
                  From classic elegance to modern sophistication, our collections are designed with meticulous 
                  care and made with premium materials. Whether you're celebrating a milestone, marking a moment, 
                  or designing something completely personal, we work closely with you to bring your vision to life.
                </p>
                <p>
                  For private clients and retailers alike, Arise Jewel offers the rare combination of custom 
                  craftsmanship and wholesale expertise—backed by decades of trust.
                </p>
                <p className="font-medium text-amber-700">
                  Arise Jewel — Designed with passion, made to last a lifetime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Heritage Timeline */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-cinzel text-amber-600 text-center mb-12">Our Heritage Timeline</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center p-6 bg-white rounded-lg shadow-lg border border-gray-200">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">💎</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">1959</h3>
                <h4 className="text-lg font-semibold text-blue-600 mb-3">Arise Precious Gems</h4>
                <p className="text-gray-600">
                  Our grandfather mastered the art of gem cutting and established our reputation 
                  as a trusted gemstone dealer, beginning our family legacy.
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-lg border border-gray-200">
                <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">✨</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">1996</h3>
                <h4 className="text-lg font-semibold text-amber-600 mb-3">Arise Jewel</h4>
                <p className="text-gray-600">
                  We expanded our expertise into fine designer jewelry and custom-made pieces, 
                  transforming exceptional stones into meaningful designs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Specialties */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-cinzel text-amber-600 text-center mb-12">Our Specialties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">💎</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Fine Gemstones</h3>
              <p className="text-gray-600 text-sm">
                Sapphires, rubies, emeralds, spinels, tourmalines, and many more—each hand-selected 
                for beauty, rarity, and authenticity.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">✨</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Custom Jewelry</h3>
              <p className="text-gray-600 text-sm">
                One-of-a-kind creations designed with meticulous care, bringing your vision to life 
                with premium materials and craftsmanship.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🌿</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Ethical Sourcing</h3>
              <p className="text-gray-600 text-sm">
                Committed to ethically sourced gemstones with reliable service, competitive pricing, 
                and deep industry knowledge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Clients */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-cinzel text-amber-600 text-center mb-12">Who We Serve</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-lg">👨‍💼</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Jewelers</h3>
              <p className="text-gray-600 text-sm">Professional jewelry designers and manufacturers</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-lg">🏪</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Retailers</h3>
              <p className="text-gray-600 text-sm">Jewelry stores sourcing quality inventory</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-lg">💎</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Collectors</h3>
              <p className="text-gray-600 text-sm">Gemstone enthusiasts and collectors</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-lg">👥</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Private Clients</h3>
              <p className="text-gray-600 text-sm">Individuals seeking custom jewelry pieces</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-amber-500 to-amber-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-cinzel text-white mb-6">Ready to Discover Our Collection?</h2>
          <p className="text-xl text-amber-100 mb-8 max-w-3xl mx-auto">
            Whether you're looking for exceptional loose gemstones or custom jewelry pieces, 
            we're here to help you find exactly what you're seeking.
          </p>
          <div className="space-x-4">
            <a
              href="/products"
              className="inline-block bg-white text-amber-600 px-8 py-3 rounded-md font-semibold hover:bg-amber-50 transition-colors"
            >
              View Gemstones & Jewelry
            </a>
            <a
              href="/contact"
              className="inline-block border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-amber-600 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}