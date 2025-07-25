'use client';

import React from 'react';

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Contact form submitted');
    alert('Thank you for your message! We\'ll get back to you soon.');
  };

  // Function to open Google Maps with the address
  const openGoogleMaps = () => {
    const address = "350 West Passaic Street Suite 401, Rochelle Park, NJ 07662, USA";
    const encodedAddress = encodeURIComponent(address);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-amber-50 to-amber-100 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-cinzel text-amber-600 mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Get in touch with our team of gemstone and jewelry experts
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-cinzel text-amber-600 mb-8">Get In Touch</h2>
              
              {/* Contact Cards */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">📍</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Visit Our Showroom</h3>
                    <div 
                      className="text-gray-600 cursor-pointer hover:text-amber-600 transition-colors duration-200"
                      onClick={openGoogleMaps}
                      title="Click to open in Google Maps"
                    >
                      <p className="hover:underline">
                        350 West Passaic Street<br />
                        Suite 401<br />
                        Rochelle Park, NJ 07662<br />
                        USA
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">📞</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Call Us</h3>
                    <p className="text-gray-600">
                      Tel: <a href="tel:+12123917745" className="text-amber-600 hover:text-amber-700">212-391-7745</a><br />
                      Fax: <a href="tel:+12129976878" className="text-amber-600 hover:text-amber-700">212-997-6878</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">✉️</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Email Us</h3>
                    <p className="text-gray-600">
                      General: <a href="mailto:info@arisegems.com" className="text-amber-600 hover:text-amber-700">info@arisegems.com</a><br />
                      Custom Orders: <a href="mailto:custom@arisejewel.com" className="text-amber-600 hover:text-amber-700">custom@arisejewel.com</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">🕐</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Business Hours</h3>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: By Appointment Only
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-cinzel text-amber-600 mb-8">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-8 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="(123) 456-7890"
                  />
                </div>

                <div>
                  <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-700 mb-2">
                    Inquiry Type *
                  </label>
                  <select
                    id="inquiryType"
                    name="inquiryType"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select an option</option>
                    <option value="loose-gemstones">Loose Gemstones</option>
                    <option value="custom-jewelry">Custom Jewelry</option>
                    <option value="existing-jewelry">Existing Jewelry Collection</option>
                    <option value="repair-services">Repair/Maintenance Services</option>
                    <option value="wholesale">Wholesale Inquiries</option>
                    <option value="general">General Questions</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-vertical"
                    placeholder="Please describe your inquiry in detail..."
                  ></textarea>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="newsletter"
                    name="newsletter"
                    className="mt-1 mr-3 h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  />
                  <label htmlFor="newsletter" className="text-sm text-gray-600">
                    I would like to receive updates about new gemstones, jewelry collections, and special offers.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200"
                >
                  Send Message
                </button>

                <p className="text-xs text-gray-500 text-center">
                  * Required fields. We'll respond to your inquiry within 24 hours during business days.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps Embed Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-cinzel text-amber-600 text-center mb-8">Find Us</h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3019.8234567890123!2d-74.0123456789!3d40.9123456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s350%20West%20Passaic%20Street%2C%20Rochelle%20Park%2C%20NJ%2007662!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Our Location - 350 West Passaic Street, Rochelle Park, NJ"
              ></iframe>
            </div>
            <div className="text-center mt-4">
              <button
                onClick={openGoogleMaps}
                className="inline-flex items-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-md transition-colors duration-200"
              >
                <span className="mr-2">📍</span>
                Open in Google Maps
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-cinzel text-amber-600 text-center mb-12">How We Can Help You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">💎</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Loose Gemstone Sourcing</h3>
              <p className="text-gray-600 text-sm">
                Find the perfect gemstone for your project with our extensive collection of 
                ethically sourced sapphires, rubies, emeralds, and more.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">✨</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Custom Jewelry Design</h3>
              <p className="text-gray-600 text-sm">
                Work with our designers to create one-of-a-kind pieces that reflect your 
                personal style and celebrate life's special moments.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🔧</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Jewelry Services</h3>
              <p className="text-gray-600 text-sm">
                Professional cleaning, repair, and maintenance services to keep your precious 
                jewelry looking beautiful for generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-cinzel text-amber-600 text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Do you work with international clients?</h3>
              <p className="text-gray-600">
                Yes, we serve clients worldwide. We have experience with international shipping and 
                can work with customs requirements for gemstones and jewelry.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">How long does custom jewelry take?</h3>
              <p className="text-gray-600">
                Custom jewelry timelines vary depending on complexity. Simple pieces may take 2-4 weeks, 
                while intricate designs can take 6-8 weeks. We'll provide a timeline during consultation.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Can I see gemstones before purchasing?</h3>
              <p className="text-gray-600">
                Absolutely! We encourage clients to view gemstones in person or request detailed photos 
                and videos before making a purchase. We want you to be completely satisfied with your selection.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Do you offer financing options?</h3>
              <p className="text-gray-600">
                Yes, we offer various financing options to make your dream jewelry more accessible. 
                Contact us to discuss payment plans and financing solutions that work for your budget.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">What is your return policy?</h3>
              <p className="text-gray-600">
                We offer a 30-day return policy for most items in original condition. Custom pieces 
                have different terms. Please contact us for specific details about returns and exchanges.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Do you provide certificates for gemstones?</h3>
              <p className="text-gray-600">
                Yes, all our premium gemstones come with certificates from recognized gemological institutes. 
                We can also arrange certification for stones that don't already have documentation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}