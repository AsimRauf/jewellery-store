import React from 'react';
import Link from 'next/link';

const ReviewsPage = () => {
  const allReviews = [
    {
      id: 9,
      name: "Linda Cooper",
      location: "Portland, OR",
      rating: 5,
      review: "I was looking for something special for my daughter's graduation. The pearl necklace I found here is absolutely perfect. She loves it and the quality is incredible. Worth every penny!",
      product: "Pearl Necklace",
      date: "1 month ago",
      verified: true
    },
    {
      id: 10,
      name: "Kevin Park",
      location: "Austin, TX",
      rating: 5,
      review: "Proposing was nerve-wracking enough, but Arise Jewel made choosing the ring stress-free. The diamond is stunning and she said yes! The whole experience was perfect from start to finish.",
      product: "Three Stone Engagement Ring",
      date: "5 days ago",
      verified: true
    },
    {
      id: 11,
      name: "Rachel Green",
      location: "Nashville, TN",
      rating: 5,
      review: "The bracelet I ordered for my anniversary is gorgeous. My husband has great taste! The diamonds are brilliant and the setting is very secure. I couldn't be happier with this purchase.",
      product: "Diamond Tennis Bracelet",
      date: "1 week ago",
      verified: true
    },
    {
      id: 12,
      name: "Tom Anderson",
      location: "San Diego, CA",
      rating: 4,
      review: "Really impressed with the quality of the cufflinks. They add the perfect touch to my formal wear. Only minor complaint is that shipping took a bit longer than expected, but the product is worth it.",
      product: "Diamond Cufflinks",
      date: "2 weeks ago",
      verified: true
    },
    {
      id: 13,
      name: "Maria Santos",
      location: "Las Vegas, NV",
      rating: 5,
      review: "The custom design service is amazing! They brought my vision to life perfectly. The ring is exactly what I dreamed of and the process was so smooth. Highly recommend for custom pieces.",
      product: "Custom Design Ring",
      date: "1 month ago",
      verified: true
    },
    {
      id: 14,
      name: "Chris Taylor",
      location: "Atlanta, GA",
      rating: 5,
      review: "Bought an eternity band for my wife's birthday. She was absolutely thrilled! The diamonds are beautiful and the craftsmanship is top-notch. Will definitely be returning customers.",
      product: "Diamond Eternity Band",
      date: "3 weeks ago",
      verified: true
    },
    {
      id: 15,
      name: "Nicole Brown",
      location: "Minneapolis, MN",
      rating: 5,
      review: "The earrings are stunning! They're the perfect size and the diamonds sparkle beautifully. I wear them almost every day now. Great quality and excellent customer service.",
      product: "Diamond Drop Earrings",
      date: "2 days ago",
      verified: true
    },
    {
      id: 16,
      name: "Alex Johnson",
      location: "Salt Lake City, UT",
      rating: 4,
      review: "Very satisfied with my purchase. The watch is elegant and well-made. The only issue was with the initial band size, but customer service was quick to resolve it. Overall great experience.",
      product: "Luxury Watch",
      date: "1 week ago",
      verified: true
    },
    {
      id: 17,
      name: "Stephanie Davis",
      location: "Orlando, FL",
      rating: 5,
      review: "I'm so happy with my new necklace! It's exactly what I was looking for and the quality is amazing. The chain is sturdy and the pendant is beautiful. Perfect for everyday wear.",
      product: "Diamond Solitaire Necklace",
      date: "4 days ago",
      verified: true
    },
    {
      id: 18,
      name: "Mark Williams",
      location: "Cleveland, OH",
      rating: 5,
      review: "Exceptional service from start to finish. The team helped me choose the perfect engagement ring and my fiancée loves it! The diamond is gorgeous and the setting is exactly what she wanted.",
      product: "Vintage Style Engagement Ring",
      date: "2 weeks ago",
      verified: true
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-amber-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-cinzel text-3xl md:text-4xl font-bold text-gray-900">
                Customer Reviews
              </h1>
              <p className="font-raleway text-gray-600 mt-2">
                See what our customers are saying about their experience
              </p>
            </div>
            <Link 
              href="/"
              className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-full font-medium transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-center items-center gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {renderStars(5)}
              </div>
              <p className="text-sm font-medium text-gray-700">4.9/5 Rating</p>
              <p className="text-xs text-gray-500">Based on 2,847 reviews</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">10,000+</p>
              <p className="text-sm text-gray-600">Happy Customers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">25+</p>
              <p className="text-sm text-gray-600">Years Experience</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {allReviews.map((review) => (
              <div 
                key={review.id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {/* Initial-based avatar */}
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {review.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 flex items-center gap-2">
                        {review.name}
                        {review.verified && (
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">{review.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex mb-1">
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-xs text-gray-500">{review.date}</p>
                  </div>
                </div>
                
                <blockquote className="text-gray-700 mb-4 leading-relaxed">
                  "{review.review}"
                </blockquote>
                
                <div className="border-t pt-3">
                  <p className="text-sm font-medium text-gray-600">
                    Product: <span className="text-amber-600">{review.product}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Ready to Join Our Happy Customers?
            </h2>
            <p className="text-gray-600 mb-6">
              Discover our collection and create your own success story
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/products"
                className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-full font-medium transition-colors"
              >
                Shop Now
              </Link>
              <Link 
                href="/contact"
                className="border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white px-8 py-3 rounded-full font-medium transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;