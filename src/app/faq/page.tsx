'use client';

import React, { useState } from 'react';

export default function FAQPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqData = [
    {
      category: "Orders & Shipping",
      icon: "📦",
      color: "bg-blue-500",
      questions: [
        {
          question: "How long does shipping take?",
          answer: "Standard shipping takes 3-5 business days within the US. Express shipping (1-2 business days) and international shipping options are also available. Custom jewelry orders may require additional processing time."
        },
        {
          question: "Do you offer free shipping?",
          answer: "Yes! We offer free standard shipping on orders over $500. For orders under $500, standard shipping is $15 within the US."
        },
        {
          question: "Can I track my order?",
          answer: "Absolutely! Once your order ships, you'll receive a tracking number via email. You can also track your order status by logging into your account on our website."
        },
        {
          question: "Do you ship internationally?",
          answer: "Yes, we ship worldwide. International shipping costs and delivery times vary by location. Please note that customers are responsible for any customs duties or taxes."
        }
      ]
    },
    {
      category: "Returns & Exchanges",
      icon: "🔄",
      color: "bg-green-500",
      questions: [
        {
          question: "What is your return policy?",
          answer: "We offer a 30-day return policy for most items in original condition. Custom and personalized jewelry cannot be returned unless there's a manufacturing defect."
        },
        {
          question: "How do I return an item?",
          answer: "Contact our customer service team to initiate a return. We'll provide you with a prepaid return label and detailed instructions. Items must be returned in original packaging."
        },
        {
          question: "Can I exchange my jewelry?",
          answer: "Yes, exchanges are available within 30 days of purchase. The item must be in original condition, and you'll be responsible for any price difference."
        }
      ]
    },
    {
      category: "Jewelry Care",
      icon: "✨",
      color: "bg-amber-500",
      questions: [
        {
          question: "How should I clean my jewelry?",
          answer: "Use a soft cloth and mild soap solution for most pieces. Avoid harsh chemicals and ultrasonic cleaners unless specifically recommended. We provide detailed care instructions with each purchase."
        },
        {
          question: "How often should I have my jewelry professionally cleaned?",
          answer: "We recommend professional cleaning every 6-12 months, depending on how frequently you wear the piece. We offer complimentary cleaning services for life on all our jewelry."
        },
        {
          question: "Do you offer repair services?",
          answer: "Yes, we provide comprehensive repair services including resizing, stone replacement, and restoration. Contact us for a free repair estimate."
        }
      ]
    },
    {
      category: "Custom Jewelry",
      icon: "💎",
      color: "bg-purple-500",
      questions: [
        {
          question: "Do you create custom jewelry?",
          answer: "Yes! We specialize in custom jewelry design. Our team works with you from initial concept to final creation, ensuring your piece is exactly what you envisioned."
        },
        {
          question: "How long does custom jewelry take?",
          answer: "Custom pieces typically take 4-8 weeks, depending on complexity. We'll provide a timeline during your consultation and keep you updated throughout the process."
        },
        {
          question: "Can I use my own gemstones?",
          answer: "Absolutely! We can incorporate your existing gemstones into new designs. Our gemologists will evaluate your stones and discuss the best setting options."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-amber-50 to-amber-100 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-cinzel text-amber-600 mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Find answers to common questions about our jewelry, services, and policies
            </p>
          </div>
        </div>
      </section>

      {/* Quick Help Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-cinzel text-amber-600 mb-6">Need Help?</h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              Can't find what you're looking for? Our customer service team is here to help!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl">📞</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Call Us</h3>
                <p className="text-sm text-gray-600 mb-3">Speak with our experts</p>
                <a href="tel:+1234567890" className="text-amber-600 hover:text-amber-700 font-medium">
                  +1 (234) 567-8900
                </a>
              </div>
              <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl">✉️</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Email Us</h3>
                <p className="text-sm text-gray-600 mb-3">Get detailed answers</p>
                <a href="mailto:info@arisejewels.com" className="text-amber-600 hover:text-amber-700 font-medium">
                  info@arisejewels.com
                </a>
              </div>
              <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl">🏪</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Visit Store</h3>
                <p className="text-sm text-gray-600 mb-3">See jewelry in person</p>
                <a href="/contact" className="text-amber-600 hover:text-amber-700 font-medium">
                  Find Location
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Categories Overview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-cinzel text-amber-600 text-center mb-12">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {faqData.map((category, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-2xl text-white">{category.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{category.category}</h3>
                <p className="text-gray-600 text-sm">
                  {category.questions.length} questions
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {faqData.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-12">
                <div className="text-center mb-8">
                  <div className={`w-20 h-20 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-3xl text-white">{category.icon}</span>
                  </div>
                  <h2 className="text-2xl font-cinzel text-amber-600">{category.category}</h2>
                </div>
                
                <div className="space-y-4">
                  {category.questions.map((faq, faqIndex) => {
                    const globalIndex = categoryIndex * 10 + faqIndex;
                    return (
                      <div key={faqIndex} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                        <button
                          className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-inset"
                          onClick={() => toggleFAQ(globalIndex)}
                        >
                          <span className="font-semibold text-gray-800 pr-4">{faq.question}</span>
                          <span className={`text-amber-600 transform transition-transform flex-shrink-0 ${
                            openFAQ === globalIndex ? 'rotate-180' : ''
                          }`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </span>
                        </button>
                        {openFAQ === globalIndex && (
                          <div className="px-6 pb-4 border-t border-gray-100">
                            <div className="pt-4 text-gray-700 leading-relaxed">
                              {faq.answer}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 bg-gradient-to-r from-amber-500 to-amber-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-cinzel text-white mb-6">Still Have Questions?</h2>
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Our jewelry experts are here to help you find the perfect piece or answer any questions you may have.
          </p>
          <div className="space-x-4">
            <a
              href="/contact"
              className="inline-block bg-white text-amber-600 px-8 py-3 rounded-md font-semibold hover:bg-amber-50 transition-colors"
            >
              Contact Us
            </a>
            <a
              href="tel:+1234567890"
              className="inline-block border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-amber-600 transition-colors"
            >
              Call Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}