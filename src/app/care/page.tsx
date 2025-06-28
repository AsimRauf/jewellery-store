'use client';

import React from 'react';

const CarePage = () => {
  const careGuides = [
    {
      metal: 'Gold',
      icon: '🥇',
      color: 'amber',
      tips: [
        'Clean with warm soapy water and a soft brush',
        'Store in a soft cloth pouch or jewelry box',
        'Avoid exposure to chlorine and harsh chemicals',
        'Remove before swimming, exercising, or cleaning',
        'Professional cleaning recommended every 6 months'
      ],
      dos: [
        'Use a soft-bristled toothbrush for detailed cleaning',
        'Dry thoroughly after cleaning',
        'Store pieces separately to prevent scratching'
      ],
      donts: [
        'Use abrasive cleaners or bleach',
        'Wear while applying lotions or perfumes',
        'Store in humid environments'
      ]
    },
    {
      metal: 'Silver',
      icon: '🥈',
      color: 'gray',
      tips: [
        'Polish regularly with a silver polishing cloth',
        'Store in anti-tarnish bags or with chalk',
        'Clean with specialized silver cleaner when needed',
        'Wear frequently to prevent tarnishing',
        'Keep away from rubber and latex'
      ],
      dos: [
        'Use silver polishing cloths for regular maintenance',
        'Store in airtight containers when possible',
        'Clean immediately after exposure to sulfur compounds'
      ],
      donts: [
        'Use paper towels or tissues for polishing',
        'Store in plastic bags without anti-tarnish strips',
        'Expose to household chemicals'
      ]
    },
    {
      metal: 'Platinum',
      icon: '💎',
      color: 'slate',
      tips: [
        'Clean with mild soap and warm water',
        'Use a soft brush for intricate details',
        'Professional cleaning and polishing annually',
        'Store in individual soft pouches',
        'Platinum develops a natural patina over time'
      ],
      dos: [
        'Embrace the natural patina for vintage look',
        'Have professional re-polishing when desired',
        'Store separately from other metals'
      ],
      donts: [
        'Use harsh chemicals or abrasives',
        'Worry about minor scratches (they add character)',
        'Mix with other metals during storage'
      ]
    }
  ];

  const gemstoneGuides = [
    {
      stone: 'Diamonds',
      icon: '💎',
      hardness: '10 (Hardest)',
      care: [
        'Clean with warm soapy water and soft brush',
        'Use ultrasonic cleaners safely',
        'Professional cleaning recommended',
        'Check settings regularly for loose stones'
      ]
    },
    {
      stone: 'Emeralds',
      icon: '💚',
      hardness: '7.5-8',
      care: [
        'Gentle cleaning with soft cloth only',
        'Avoid ultrasonic and steam cleaners',
        'Protect from impacts and temperature changes',
        'Professional cleaning only'
      ]
    },
    {
      stone: 'Sapphires & Rubies',
      icon: '🔵',
      hardness: '9',
      care: [
        'Clean with warm soapy water',
        'Safe for ultrasonic cleaning',
        'Durable for everyday wear',
        'Check prongs and settings regularly'
      ]
    },
    {
      stone: 'Pearls',
      icon: '🤍',
      hardness: '2.5-4.5 (Soft)',
      care: [
        'Wipe with soft, damp cloth after wearing',
        'Never use chemicals or ultrasonic cleaners',
        'Store separately in soft pouches',
        'Restring periodically if worn frequently'
      ]
    }
  ];

  const storageTypes = [
    {
      type: 'Jewelry Box',
      icon: '📦',
      description: 'Individual compartments prevent scratching',
      best: 'Daily wear pieces, mixed collections'
    },
    {
      type: 'Soft Pouches',
      icon: '👝',
      description: 'Fabric pouches protect from scratches',
      best: 'Travel, delicate pieces, silver jewelry'
    },
    {
      type: 'Anti-Tarnish Strips',
      icon: '🛡️',
      description: 'Prevents tarnishing in storage',
      best: 'Silver jewelry, long-term storage'
    },
    {
      type: 'Hanging Organizers',
      icon: '🏷️',
      description: 'Prevents tangling of chains and necklaces',
      best: 'Necklaces, bracelets, chains'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-amber-50 to-amber-100 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-cinzel text-amber-600 mb-6">
              Jewelry Care Guide
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Keep your precious jewelry looking beautiful for generations with our expert care tips and maintenance guide
            </p>
          </div>
        </div>
      </section>

      {/* Quick Care Tips */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-cinzel text-amber-600 text-center mb-12">Essential Care Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🧼</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Clean Regularly</h3>
              <p className="text-gray-600 text-sm">
                Regular gentle cleaning maintains brilliance and prevents buildup of oils and dirt.
              </p>
            </div>

            <div className="text-center p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🏠</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Store Properly</h3>
              <p className="text-gray-600 text-sm">
                Proper storage prevents scratches, tarnishing, and damage from environmental factors.
              </p>
            </div>

            <div className="text-center p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🛡️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Handle Gently</h3>
              <p className="text-gray-600 text-sm">
                Gentle handling and avoiding harsh chemicals extends the life of your jewelry.
              </p>
            </div>

            <div className="text-center p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🔧</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Professional Service</h3>
              <p className="text-gray-600 text-sm">
                Regular professional cleaning and inspection keeps jewelry in optimal condition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Metal-Specific Care */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-cinzel text-amber-600 text-center mb-12">Care by Metal Type</h2>
          <div className="space-y-8 max-w-6xl mx-auto">
            {careGuides.map((guide, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className={`bg-${guide.color}-500 text-white p-6`}>
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl">{guide.icon}</span>
                    <h3 className="text-2xl font-cinzel">{guide.metal} Jewelry Care</h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">General Care Tips</h4>
                      <ul className="space-y-2">
                        {guide.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start space-x-2 text-sm text-gray-600">
                            <span className="text-green-500 mt-1">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 text-green-600">Do's</h4>
                      <ul className="space-y-2">
                        {guide.dos.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start space-x-2 text-sm text-gray-600">
                            <span className="text-green-500 mt-1">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 text-red-600">Don'ts</h4>
                      <ul className="space-y-2">
                        {guide.donts.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start space-x-2 text-sm text-gray-600">
                            <span className="text-red-500 mt-1">✗</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gemstone Care */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-cinzel text-amber-600 text-center mb-12">Gemstone Care Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {gemstoneGuides.map((gem, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-lg p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-3xl">{gem.icon}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{gem.stone}</h3>
                    <p className="text-sm text-gray-500">Hardness: {gem.hardness}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {gem.care.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start space-x-2 text-sm text-gray-600">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Storage Solutions */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-cinzel text-amber-600 text-center mb-12">Storage Solutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {storageTypes.map((storage, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="text-4xl mb-4">{storage.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{storage.type}</h3>
                <p className="text-sm text-gray-600 mb-3">{storage.description}</p>
                <div className="text-xs text-amber-600 font-medium">
                  Best for: {storage.best}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

            {/* Cleaning Methods */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-cinzel text-amber-600 text-center mb-12">Cleaning Methods</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            
            {/* At-Home Cleaning */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl text-white">🏠</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">At-Home Cleaning</h3>
              <div className="space-y-4 text-gray-700">
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">1</span>
                  <p>Mix warm water with a few drops of mild dish soap</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">2</span>
                  <p>Soak jewelry for 10-15 minutes</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">3</span>
                  <p>Gently scrub with a soft-bristled toothbrush</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">4</span>
                  <p>Rinse thoroughly with clean water</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">5</span>
                  <p>Dry completely with a soft, lint-free cloth</p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Safe for:</strong> Gold, platinum, diamonds, sapphires, rubies
                </p>
              </div>
            </div>

            {/* Professional Cleaning */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl text-white">👨‍🔧</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Professional Cleaning</h3>
              <div className="space-y-4 text-gray-700">
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">•</span>
                  <p>Ultrasonic cleaning for deep cleaning</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">•</span>
                  <p>Steam cleaning for sanitization</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">•</span>
                  <p>Professional polishing and buffing</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">•</span>
                  <p>Inspection for loose stones or damage</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">•</span>
                  <p>Prong tightening and minor repairs</p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Recommended:</strong> Every 6-12 months for frequently worn pieces
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What to Avoid */}
      <section className="py-16 bg-red-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-cinzel text-red-600 text-center mb-12">What to Avoid</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-2xl">🧴</span>
                <h3 className="text-lg font-semibold text-gray-800">Harsh Chemicals</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Bleach and chlorine</li>
                <li>• Ammonia-based cleaners</li>
                <li>• Abrasive cleaners</li>
                <li>• Acetone and nail polish remover</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-2xl">🏃‍♀️</span>
                <h3 className="text-lg font-semibold text-gray-800">Physical Activities</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Swimming (especially pools)</li>
                <li>• Exercising and sports</li>
                <li>• Gardening and yard work</li>
                <li>• Heavy lifting or manual labor</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-2xl">🌡️</span>
                <h3 className="text-lg font-semibold text-gray-800">Extreme Conditions</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Extreme temperatures</li>
                <li>• Direct sunlight for extended periods</li>
                <li>• High humidity environments</li>
                <li>• Exposure to perfumes and lotions</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Maintenance Schedule */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-cinzel text-amber-600 text-center mb-12">Maintenance Schedule</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">D</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Daily</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Remove before bed</li>
                  <li>• Wipe with soft cloth</li>
                  <li>• Store properly</li>
                  <li>• Check for damage</li>
                </ul>
              </div>

              <div className="text-center p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">M</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Monthly</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Deep clean at home</li>
                  <li>• Inspect settings</li>
                  <li>• Polish silver pieces</li>
                  <li>• Organize storage</li>
                </ul>
              </div>

              <div className="text-center p-6 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">Y</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Yearly</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Professional cleaning</li>
                  <li>• Prong inspection</li>
                  <li>• Insurance appraisal</li>
                  <li>• Major repairs if needed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Care */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-cinzel text-amber-600 text-center mb-12">Emergency Care Tips</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-yellow-500">
              <div className="flex items-start space-x-4">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Loose Stone</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Stop wearing immediately. Place in a safe container and visit a jeweler as soon as possible.
                  </p>
                  <p className="text-xs text-yellow-700 font-medium">
                    Don't attempt to tighten or fix yourself - this can cause more damage.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500">
              <div className="flex items-start space-x-4">
                <span className="text-2xl">🚨</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Broken Chain or Clasp</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Carefully collect all pieces. Don't wear until professionally repaired.
                  </p>
                  <p className="text-xs text-red-700 font-medium">
                    Keep all pieces together - even small fragments can be important for repair.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
              <div className="flex items-start space-x-4">
                <span className="text-2xl">💧</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Water Damage</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Dry immediately with soft cloth. For watches, seek professional help immediately.
                  </p>
                  <p className="text-xs text-blue-700 font-medium">
                    Don't use heat sources - air dry only to prevent damage.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Services CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-cinzel text-amber-600 mb-6">Professional Care Services</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Let our expert jewelers take care of your precious pieces with professional cleaning, 
              inspection, and maintenance services.
            </p>
            <div className="bg-amber-50 p-8 rounded-lg border border-amber-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-white">🧼</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Professional Cleaning</h3>
                  <p className="text-sm text-gray-600">Ultrasonic and steam cleaning services</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-white">🔍</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Inspection & Repair</h3>
                  <p className="text-sm text-gray-600">Comprehensive inspection and minor repairs</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-white">✨</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Restoration</h3>
                  <p className="text-sm text-gray-600">Bring vintage pieces back to life</p>
                </div>
              </div>
              <div className="space-x-4">
                <button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-md font-semibold transition-colors">
                  Schedule Service
                </button>
                <a
                  href="/contact"
                  className="inline-block border-2 border-amber-500 text-amber-600 px-8 py-3 rounded-md font-semibold hover:bg-amber-500 hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Care Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-cinzel text-amber-600 text-center mb-12">Recommended Care Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🧽</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Jewelry Cleaning Cloths</h3>
              <p className="text-sm text-gray-600 mb-4">
                Pre-treated polishing cloths for gold, silver, and platinum
              </p>
              <div className="text-amber-600 font-semibold">$12.99</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🧴</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Gentle Jewelry Cleaner</h3>
              <p className="text-sm text-gray-600 mb-4">
                Safe for all metals and most gemstones
              </p>
              <div className="text-amber-600 font-semibold">$19.99</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">👝</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Anti-Tarnish Pouches</h3>
              <p className="text-sm text-gray-600 mb-4">
                Set of 10 protective storage pouches
              </p>
              <div className="text-amber-600 font-semibold">$24.99</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">📦</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Complete Care Kit</h3>
              <p className="text-sm text-gray-600 mb-4">
                Everything you need for at-home jewelry care
              </p>
              <div className="text-amber-600 font-semibold">$49.99</div>
            </div>
          </div>
          <div className="text-center mt-8">
            <button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-md font-semibold transition-colors">
              Shop Care Products
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-cinzel text-amber-600 text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">How often should I clean my jewelry?</h3>
              <p className="text-gray-600 text-sm">
                For daily wear pieces, clean weekly with gentle soap and water. Professional cleaning is recommended every 6-12 months.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Can I wear my jewelry in the shower?</h3>
              <p className="text-gray-600 text-sm">
                It's best to remove jewelry before showering. Soap residue can build up and dull the appearance, and some gemstones can be damaged by chemicals in soaps and shampoos.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Why is my silver jewelry turning black?</h3>
              <p className="text-gray-600 text-sm">
                Silver naturally tarnishes when exposed to sulfur compounds in the air. This is normal and can be easily cleaned with silver polish or professional cleaning.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Is it safe to use ultrasonic cleaners at home?</h3>
              <p className="text-gray-600 text-sm">
                Home ultrasonic cleaners can be safe for diamonds, rubies, and sapphires in secure settings. Avoid using them on emeralds, pearls, opals, or any stones with fractures or inclusions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">How should I store my jewelry when traveling?</h3>
              <p className="text-gray-600 text-sm">
                Use individual soft pouches or a travel jewelry case with separate compartments. Keep pieces separated to prevent scratching and tangling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-amber-500 to-amber-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-cinzel text-white mb-6">Keep Your Jewelry Beautiful Forever</h2>
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Proper care ensures your precious jewelry maintains its beauty and value for generations to come.
          </p>
          <div className="space-x-4">
            <a
              href="/products"
              className="inline-block bg-white text-amber-600 px-8 py-3 rounded-md font-semibold hover:bg-amber-50 transition-colors"
            >
              Shop Jewelry
            </a>
            <a
              href="/contact"
              className="inline-block border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-amber-600 transition-colors"
            >
              Professional Services
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CarePage;
