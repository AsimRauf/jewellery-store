'use client';

import React from 'react';

// Move metadata outside the component since we're using 'use client'
// const metadata = {
//   title: 'Ring Sizing Guide - Arise Jewels | Find Your Perfect Fit',
//   description: 'Learn how to measure your ring size accurately with our comprehensive sizing guide. Includes size charts, measurement tips, and professional advice.',
//   keywords: 'ring sizing guide, how to measure ring size, ring size chart, jewelry sizing, arise jewels',
// };

const SizingPage = () => {
  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const sizeChart = [
    { us: '3', uk: 'F', eu: '44', mm: '14.1' },
    { us: '3.5', uk: 'G', eu: '45', mm: '14.5' },
    { us: '4', uk: 'H', eu: '46', mm: '14.9' },
    { us: '4.5', uk: 'I', eu: '47', mm: '15.3' },
    { us: '5', uk: 'J', eu: '48', mm: '15.7' },
    { us: '5.5', uk: 'K', eu: '49', mm: '16.1' },
    { us: '6', uk: 'L', eu: '50', mm: '16.5' },
    { us: '6.5', uk: 'M', eu: '52', mm: '16.9' },
    { us: '7', uk: 'N', eu: '54', mm: '17.3' },
    { us: '7.5', uk: 'O', eu: '55', mm: '17.7' },
    { us: '8', uk: 'P', eu: '56', mm: '18.1' },
    { us: '8.5', uk: 'Q', eu: '58', mm: '18.5' },
    { us: '9', uk: 'R', eu: '59', mm: '18.9' },
    { us: '9.5', uk: 'S', eu: '60', mm: '19.3' },
    { us: '10', uk: 'T', eu: '61', mm: '19.7' },
    { us: '10.5', uk: 'U', eu: '62', mm: '20.1' },
    { us: '11', uk: 'V', eu: '64', mm: '20.5' },
    { us: '11.5', uk: 'W', eu: '65', mm: '20.9' },
    { us: '12', uk: 'X', eu: '66', mm: '21.3' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-amber-50 to-amber-100 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-cinzel text-amber-600 mb-6">
              Ring Sizing Guide
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Find your perfect ring size with our comprehensive guide and professional tips
            </p>
          </div>
        </div>
      </section>

      {/* Quick Options */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-cinzel text-amber-600 text-center mb-12">How Would You Like to Get Sized?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl text-white">📏</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Measure at Home</h3>
                <p className="text-gray-600 mb-6">
                  Use our step-by-step guide to measure your ring size using common household items.
                </p>
                <button 
                  onClick={() => scrollToSection('diy-measuring')}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-md transition-colors"
                >
                  Start Measuring
                </button>
              </div>
              
              <div className="text-center p-8 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl text-white">💍</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Free Ring Sizer</h3>
                <p className="text-gray-600 mb-6">
                  Order our free plastic ring sizer kit delivered to your door for the most accurate measurement.
                </p>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors">
                  Order Free Kit
                </button>
              </div>
              
              <div className="text-center p-8 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl text-white">🏪</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Professional Sizing</h3>
                <p className="text-gray-600 mb-6">
                  Visit our showroom or any local jewelry store for professional ring sizing service.
                </p>
                <a href="/contact" className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition-colors">
                  Find Location
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DIY Measuring Methods */}
      <section id="diy-measuring" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-cinzel text-amber-600 text-center mb-12">Measure at Home</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            
            {/* Method 1: String/Paper Method */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl text-white">📝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">String or Paper Method</h3>
              <div className="space-y-4 text-gray-700">
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">1</span>
                  <p>Cut a strip of paper or string about 4 inches long</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">2</span>
                  <p>Wrap it around the base of your finger where the ring will sit</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">3</span>
                  <p>Mark where the paper/string overlaps with a pen</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">4</span>
                  <p>Measure the length with a ruler in millimeters</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">5</span>
                  <p>Use our size chart below to find your ring size</p>
                </div>
              </div>
            </div>

            {/* Method 2: Existing Ring Method */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl text-white">💍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Existing Ring Method</h3>
              <div className="space-y-4 text-gray-700">
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">1</span>
                  <p>Find a ring that fits the intended finger perfectly</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">2</span>
                  <p>Place the ring on a ruler and measure the inside diameter</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">3</span>
                  <p>Measure from the inside edge to inside edge in millimeters</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">4</span>
                  <p>Match your measurement to our diameter chart below</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg mt-4">
                  <p className="text-sm text-blue-800">
                    <strong>Pro Tip:</strong> This method is most accurate if the existing ring fits the same finger you&apos;re sizing for.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ring Size Chart */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-cinzel text-amber-600 text-center mb-12">International Ring Size Chart</h2>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-amber-500 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">US Size</th>
                      <th className="px-6 py-4 text-left font-semibold">UK Size</th>
                      <th className="px-6 py-4 text-left font-semibold">EU Size</th>
                      <th className="px-6 py-4 text-left font-semibold">Diameter (mm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeChart.map((size, index) => (
                      <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-amber-50 transition-colors`}>
                        <td className="px-6 py-3 font-medium text-gray-800">{size.us}</td>
                        <td className="px-6 py-3 text-gray-600">{size.uk}</td>
                        <td className="px-6 py-3 text-gray-600">{size.eu}</td>
                        <td className="px-6 py-3 text-gray-600">{size.mm}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sizing Tips */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-cinzel text-amber-600 text-center mb-12">Expert Sizing Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">🌡️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">Best Time to Measure</h3>
              <p className="text-gray-600 text-sm text-center">
                Measure your finger at the end of the day when your fingers are at their largest. 
                Avoid measuring when you&apos;re cold, as fingers shrink.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">👐</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">Finger Differences</h3>
              <p className="text-gray-600 text-sm text-center">
                Your dominant hand fingers are typically 1/4 to 1/2 size larger. 
                Always measure the specific finger you&apos;ll wear the ring on.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">📏</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">Comfort Fit</h3>
              <p className="text-gray-600 text-sm text-center">
                The ring should slide over your knuckle with slight resistance and 
                fit snugly at the base without being too tight.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">💍</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">Wide Band Consideration</h3>
              <p className="text-gray-600 text-sm text-center">
                Wide bands (6mm+) should be ordered 1/4 to 1/2 size larger than 
                your normal ring size for comfortable wear.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">🔄</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">Multiple Measurements</h3>
              <p className="text-gray-600 text-sm text-center">
                Take measurements 2-3 times to ensure accuracy. 
                If you&apos;re between sizes, it&apos;s usually better to size up.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">❄️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">Weather Considerations</h3>
              <p className="text-gray-600 text-sm text-center">
                Fingers can vary by up to 1/2 size between summer and winter. 
                Consider the season when you&apos;ll wear the ring most.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Common Sizing Mistakes */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-cinzel text-amber-600 text-center mb-12">Common Sizing Mistakes to Avoid</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-6 bg-red-50 border border-red-200 rounded-lg">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg">❌</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Measuring when hands are cold</h3>
                  <p className="text-gray-600 text-sm">Cold fingers shrink significantly, leading to rings that are too small.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-red-50 border border-red-200 rounded-lg">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg">❌</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Using a ring from a different finger</h3>
                  <p className="text-gray-600 text-sm">Each finger has a different size - always measure the specific finger.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-red-50 border border-red-200 rounded-lg">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg">❌</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Wrapping string too tightly</h3>
                  <p className="text-gray-600 text-sm">The string should fit snugly but not compress your finger.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-red-50 border border-red-200 rounded-lg">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg">❌</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Measuring only once</h3>
                  <p className="text-gray-600 text-sm">Single measurements can be inaccurate - always measure multiple times.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resizing Information */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl font-cinzel text-amber-600 mb-6">Ring Resizing Services</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Don&apos;t worry if your ring doesn&apos;t fit perfectly! Most rings can be resized by our expert jewelers. 
                  We offer complimentary resizing within 60 days of purchase.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>Free resizing within 60 days of purchase</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>Most rings can be resized up or down 2 sizes</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>Professional craftsmanship maintains ring integrity</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>Lifetime resizing service available</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
              <div className="w-full h-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center">
                <div className="text-center text-amber-800">
                  <div className="text-6xl mb-4">🔧</div>
                  <p className="text-lg font-medium">Expert Resizing Services</p>
                  <p className="text-sm mt-2">Perfect Fit Guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Ring Sizer CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-cinzel text-amber-600 mb-6">Still Unsure About Your Size?</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Get the most accurate measurement with our free ring sizer kit. We&apos;ll mail it to you at no cost, 
              and you can take your time to find the perfect fit.
            </p>
            <div className="bg-amber-50 p-8 rounded-lg border border-amber-200">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-white">📦</span>
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-semibold text-gray-800">Free Ring Sizer Kit</h3>
                  <p className="text-gray-600">Includes multiple sizing tools and instructions</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Free shipping</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>No obligation</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Professional accuracy</span>
                </div>
              </div>
              <button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-md font-semibold transition-colors">
                Order Your Free Ring Sizer
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-amber-500 to-amber-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-cinzel text-white mb-6">Ready to Find Your Perfect Ring?</h2>
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Now that you know your size, explore our collection of beautiful rings crafted with precision and care.
          </p>
          <div className="space-x-4">
            <a
              href="/products"
              className="inline-block bg-white text-amber-600 px-8 py-3 rounded-md font-semibold hover:bg-amber-50 transition-colors"
            >
              Shop Rings
            </a>
            <a
              href="/contact"
              className="inline-block border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-amber-600 transition-colors"
            >
              Custom Ring Design
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SizingPage;