import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Arise Jewels | Your Privacy Matters',
  description: 'Learn about how Arise Jewels protects your privacy and handles your personal information. We are committed to keeping your data secure.',
  keywords: 'privacy policy, data protection, arise jewels privacy, personal information security',
};

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-amber-50 to-amber-100 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-cinzel text-amber-600 mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Your privacy is important to us. Learn how we protect your personal information and ensure your data security.
            </p>
          </div>
        </div>
      </section>

      {/* Last Updated & Introduction */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Last Updated */}
            <div className="mb-12 p-6 bg-amber-50 rounded-lg border-l-4 border-amber-500 text-center">
              <p className="text-gray-700 text-lg">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            {/* Introduction */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-cinzel text-amber-600 mb-6">Our Commitment to Your Privacy</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed max-w-3xl mx-auto">
                <p>
                  At Arise Jewels, we are committed to protecting your privacy and ensuring the security 
                  of your personal information. This Privacy Policy explains how we collect, use, disclose, 
                  and safeguard your information when you visit our website, make a purchase, or interact 
                  with our services.
                </p>
                <p>
                  By using our website or services, you consent to the practices described in this Privacy Policy. 
                  If you do not agree with our policies and practices, please do not use our services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Information We Collect */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-cinzel text-amber-600 text-center mb-12">Information We Collect</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Personal Information */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl text-white">👤</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Personal Information</h3>
              <p className="text-gray-600 mb-4">
                We collect personal information when you:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
                <li>Create an account or make a purchase</li>
                <li>Subscribe to our newsletter</li>
                <li>Contact us for customer service</li>
                <li>Participate in surveys or promotions</li>
              </ul>
              <p className="text-gray-600 mb-2">This may include:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Name and contact information</li>
                <li>Payment information</li>
                <li>Order history and preferences</li>
                <li>Communication preferences</li>
              </ul>
            </div>

            {/* Automatically Collected Information */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl text-white">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Automatically Collected</h3>
              <p className="text-gray-600 mb-4">
                When you visit our website, we automatically collect:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>IP address and browser information</li>
                <li>Device type and operating system</li>
                <li>Pages visited and time spent</li>
                <li>Referring website information</li>
                <li>Cookies and tracking technologies</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How We Use Your Information */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-cinzel text-amber-600 text-center mb-12">How We Use Your Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">📦</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Order Processing</h3>
              <p className="text-gray-600 text-sm">Process and fulfill your orders with accurate delivery</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🛠️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Customer Service</h3>
              <p className="text-gray-600 text-sm">Provide excellent customer service and support</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">✨</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Personalization</h3>
              <p className="text-gray-600 text-sm">Personalize your shopping experience</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🔒</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Security</h3>
              <p className="text-gray-600 text-sm">Detect and prevent fraud for your safety</p>
            </div>
          </div>
        </div>
      </section>

      {/* Data Security */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl font-cinzel text-amber-600 mb-6">Data Security</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  We implement robust technical and organizational security measures to protect 
                  your personal information against unauthorized access, alteration, disclosure, or 
                  destruction.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>SSL encryption for data transmission</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>Secure payment processing systems</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>Regular security assessments</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>Employee training on data protection</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
              <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-400 flex items-center justify-center">
                <div className="text-center text-blue-800">
                  <div className="text-6xl mb-4">🔐</div>
                  <p className="text-lg font-medium">Your Data is Safe With Us</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Your Rights */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-cinzel text-amber-600 text-center mb-12">Your Rights and Choices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">👁️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Access</h3>
              <p className="text-gray-600 text-sm">Request a copy of the personal information we hold about you</p>
            </div>
            <div className="text-center p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">✏️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Correction</h3>
              <p className="text-gray-600 text-sm">Request correction of inaccurate or incomplete information</p>
            </div>
            <div className="text-center p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🗑️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Deletion</h3>
              <p className="text-gray-600 text-sm">Request deletion of your personal information</p>
            </div>
            <div className="text-center p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">📤</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Portability</h3>
              <p className="text-gray-600 text-sm">Request a copy of your data in a structured format</p>
            </div>
            <div className="text-center p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">✋</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Opt-out</h3>
              <p className="text-gray-600 text-sm">Unsubscribe from marketing communications at any time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Information Sharing */}
    <div className="mb-8 px-4 md:px-8">
        <h2 className="text-2xl font-cinzel text-amber-600 mb-4">Information Sharing and Disclosure</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          We do not sell, trade, or rent your personal information to third parties. We may share 
          your information in the following circumstances:
        </p>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Service Providers</h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          We may share information with trusted third-party service providers who assist us in:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li>Payment processing</li>
          <li>Shipping and delivery</li>
          <li>Email marketing services</li>
          <li>Website analytics</li>
          <li>Customer service support</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">Legal Requirements</h3>
        <p className="text-gray-700 leading-relaxed mb-6">
          We may disclose your information if required by law, regulation, court order, or 
          government request, or to protect our rights and the safety of our customers.
        </p>
      </div>

      {/* Cookies and Tracking */}
      <div className="mb-8 px-4 md:px-8">
        <h2 className="text-2xl font-cinzel text-amber-600 mb-4">Cookies and Tracking Technologies</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          We use cookies and similar tracking technologies to enhance your browsing experience. 
          Cookies are small files stored on your device that help us:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li>Remember your preferences and settings</li>
          <li>Keep you logged in to your account</li>
          <li>Analyze website traffic and usage patterns</li>
          <li>Provide personalized content and recommendations</li>
        </ul>
        <p className="text-gray-700 leading-relaxed">
          You can control cookie settings through your browser preferences. However, disabling 
          cookies may affect the functionality of our website.
        </p>
      </div>

      {/* Third-Party Links */}
      <div className="mb-8 px-4 md:px-8">
        <h2 className="text-2xl font-cinzel text-amber-600 mb-4">Third-Party Links</h2>
        <p className="text-gray-700 leading-relaxed">
          Our website may contain links to third-party websites. We are not responsible for the 
          privacy practices or content of these external sites. We encourage you to review the 
          privacy policies of any third-party sites you visit.
        </p>
      </div>

      {/* Children's Privacy */}
      <div className="mb-8">
        <h2 className="text-2xl font-cinzel text-amber-600 mb-4">Children&apos;s Privacy</h2>
        <p className="text-gray-700 leading-relaxed">
          Our services are not intended for children under the age of 13. We do not knowingly 
          collect personal information from children under 13. If we become aware that we have 
          collected personal information from a child under 13, we will take steps to delete 
          such information promptly.
        </p>
      </div>

      {/* International Transfers */}
      <div className="mb-8 px-4 md:px-8">
        <h2 className="text-2xl font-cinzel text-amber-600 mb-4">International Data Transfers</h2>
        <p className="text-gray-700 leading-relaxed">
          Your information may be transferred to and processed in countries other than your 
          country of residence. We ensure that such transfers comply with applicable data 
          protection laws and implement appropriate safeguards to protect your information.
        </p>
      </div>

      {/* Updates to Privacy Policy */}
      <div className="mb-8 px-4 md:px-8">
        <h2 className="text-2xl font-cinzel text-amber-600 mb-4">Updates to This Privacy Policy</h2>
        <p className="text-gray-700 leading-relaxed">
          We may update this Privacy Policy from time to time to reflect changes in our practices 
          or legal requirements. We will notify you of any material changes by posting the updated 
          policy on our website and updating the &quot;Last Updated&quot; date. Your continued use of our 
          services after such changes constitutes acceptance of the updated policy.
        </p>
      </div>

      {/* Contact Information */}
      <div className="mb-8 px-4 md:px-8">
        <h2 className="text-2xl font-cinzel text-amber-600 mb-4">Contact Us</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          If you have any questions about this Privacy Policy or our privacy practices, 
          please contact us:
        </p>
        <div className="space-y-2 text-gray-700">
          <p><strong>Email:</strong> privacy@arisejewels.com</p>
          <p><strong>Phone:</strong> +1 (234) 567-8900</p>
          <p><strong>Address:</strong> 123 Jewelry District, New York, NY 10001</p>
        </div>
      </div>

      {/* Effective Date */}
      <div className="border-t border-gray-200 pt-6">
        <p className="text-sm text-gray-500 text-center">
          This Privacy Policy is effective as of {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })} and applies to all information collected by Arise Jewels.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPage;