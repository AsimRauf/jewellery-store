'use client';

import React from 'react';

const ShippingAndReturnsPage = () => {
  const shippingMethods = [
    {
      name: 'Standard Shipping',
      icon: '🚚',
      time: '5-7 Business Days',
      cost: 'Free on orders over $250',
      details: 'Tracking number provided for all orders'
    },
    {
      name: 'Express Shipping',
      icon: '🚀',
      time: '2-3 Business Days',
      cost: '$25',
      details: 'Priority handling and faster delivery'
    },
    {
      name: 'Overnight Shipping',
      icon: '✈️',
      time: 'Next Business Day',
      cost: '$50',
      details: 'Guaranteed next-day delivery for urgent orders'
    },
    {
      name: 'International Shipping',
      icon: '🌍',
      time: '7-14 Business Days',
      cost: 'Varies by Location',
      details: 'Customs fees may apply'
    }
  ];

  const returnPolicy = [
    {
      type: 'Unworn Jewelry',
      days: '30 Days',
      condition: 'Original packaging, unworn, no signs of use',
      refund: 'Full Refund'
    },
    {
      type: 'Customized Pieces',
      days: 'Non-Returnable',
      condition: 'Special orders, engraved items',
      refund: 'Store Credit Only'
    },
    {
      type: 'Damaged Items',
      days: '60 Days',
      condition: 'Manufacturing defects',
      refund: 'Full Replacement or Repair'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-amber-50 to-amber-100 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-cinzel text-amber-600 mb-6">
              Shipping & Returns
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Transparent, hassle-free shipping and returns for your peace of mind
            </p>
          </div>
        </div>
      </section>

      {/* Shipping Methods */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-cinzel text-amber-600 text-center mb-12">Shipping Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {shippingMethods.map((method, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl mb-4">{method.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{method.name}</h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>Delivery: {method.time}</p>
                  <p>Cost: {method.cost}</p>
                  <p className="text-xs text-amber-600 mt-2">{method.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Return Policy */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-cinzel text-amber-600 text-center mb-12">Return Policy</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {returnPolicy.map((policy, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-amber-500"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">{policy.type}</h3>
                  <span className="text-sm text-amber-600 font-medium">{policy.days}</span>
                </div>
                <div className="text-sm text-gray-600 space-y-2">
                  <p><strong>Condition:</strong> {policy.condition}</p>
                  <p><strong>Refund Type:</strong> {policy.refund}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Return Process */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-cinzel text-amber-600 text-center mb-12">Return Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Contact Support</h3>
              <p className="text-sm text-gray-600">
                Initiate return by contacting our customer support team
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Get Return Label</h3>
              <p className="text-sm text-gray-600">
                We&apos;ll email you a prepaid return shipping label
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Pack Carefully</h3>
              <p className="text-sm text-gray-600">
                Pack item in original packaging with all accessories
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Process Refund</h3>
              <p className="text-sm text-gray-600">
                Refund processed within 5-7 business days after receipt
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* International Shipping */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-cinzel text-amber-600 mb-6">International Shipping</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              We ship worldwide! Please note that international orders may be subject to customs fees, 
              import taxes, and additional shipping regulations.
            </p>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Global Coverage</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Secure Packaging</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Insurance Included</span>
                </div>
              </div>
              <a
                href="/contact"
                className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-md font-semibold transition-colors"
              >
                Contact International Support
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-cinzel text-amber-600 text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">How long does shipping take?</h3>
              <p className="text-gray-600 text-sm">
                Shipping times vary by method. Standard shipping is 5-7 business days, Express is 2-3 days, and Overnight is next business day.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Are shipping costs refundable?</h3>
              <p className="text-gray-600 text-sm">
                Shipping costs are non-refundable. If you return an item, the original shipping fee will not be refunded.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Do you ship to P.O. Boxes?</h3>
              <p className="text-gray-600 text-sm">
                We recommend using a physical address for jewelry shipments. Some high-value items may require signature upon delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-amber-500 to-amber-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-cinzel text-white mb-6">Questions About Shipping?</h2>
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Our customer support team is ready to help you with any shipping or return inquiries.
          </p>
          <div className="space-x-4">
            <a
              href="/contact"
              className="inline-block bg-white text-amber-600 px-8 py-3 rounded-md font-semibold hover:bg-amber-50 transition-colors"
            >
              Contact Support
            </a>
            <a
              href="/faq"
              className="inline-block border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-amber-600 transition-colors"
            >
              View FAQ
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShippingAndReturnsPage;