'use client';

import React, { useState, useEffect } from 'react'; 
import Image from 'next/image';
import Link from 'next/link';

interface Review {
  id: number;
  name: string;
  location: string;
  rating: number;
  review: string;
  product: string;
  date: string;
  avatar: string;
  verified: boolean;
}

const Reviews = () => {
  const [currentReview, setCurrentReview] = useState(0);

  const reviews: Review[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "New York, NY",
      rating: 5,
      review: "Absolutely stunning engagement ring! The craftsmanship is impeccable and the diamond sparkles beautifully. My fiancé chose the perfect ring from Arise Jewel. The customer service was exceptional throughout the entire process.",
      product: "Classic Solitaire Engagement Ring",
      date: "2 weeks ago",
      avatar: "/avatars/sarah.jpg",
      verified: true
    },
    {
      id: 2,
      name: "Michael Chen",
      location: "Los Angeles, CA",
      rating: 5,
      review: "I was nervous about buying such an expensive piece online, but Arise Jewel exceeded all my expectations. The wedding band is exactly as described and the quality is outstanding. Highly recommend!",
      product: "Platinum Wedding Band",
      date: "1 month ago",
      avatar: "/avatars/michael.jpg",
      verified: true
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      location: "Chicago, IL",
      rating: 5,
      review: "The custom necklace I ordered for my anniversary is breathtaking. The attention to detail and personal touch made it truly special. Thank you for creating such a meaningful piece!",
      product: "Custom Diamond Necklace",
      date: "3 weeks ago",
      avatar: "/avatars/emily.jpg",
      verified: true
    },
    {
      id: 4,
      name: "David Thompson",
      location: "Miami, FL",
      rating: 4,
      review: "Great experience overall. The ring arrived quickly and was beautifully packaged. The diamond is gorgeous and my wife loves it. Only minor issue was with the initial sizing, but customer service resolved it promptly.",
      product: "Halo Engagement Ring",
      date: "1 week ago",
      avatar: "/avatars/david.jpg",
      verified: true
    },
    {
      id: 5,
      name: "Jessica Miller",
      location: "Seattle, WA",
      rating: 5,
      review: "I've been a customer for years and Arise Jewel never disappoints. The earrings I purchased are elegant and well-made. Perfect for special occasions and everyday wear. Will definitely be back!",
      product: "Diamond Stud Earrings",
      date: "2 months ago",
      avatar: "/avatars/jessica.jpg",
      verified: true
    },
    {
      id: 6,
      name: "Robert Wilson",
      location: "Boston, MA",
      rating: 5,
      review: "Exceptional quality and service. I bought a tennis bracelet for my wife's birthday and she was over the moon. The packaging was luxurious and the bracelet exceeded our expectations. Thank you!",
      product: "Diamond Tennis Bracelet",
      date: "1 month ago",
      avatar: "/avatars/robert.jpg",
      verified: true
    }
  ];

  // Auto-rotate reviews
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 8000); // Change every 8 seconds

    return () => clearInterval(interval);
  }, [reviews.length]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-amber-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  // Avatar component with fallback to initials
  const Avatar = ({ review, size = "w-12 h-12" }: { review: Review; size?: string }) => {
    const [imageError, setImageError] = useState(false);

    if (imageError) {
      return (
        <div className={`${size} bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold`}>
          {review.name.split(' ').map(n => n[0]).join('')}
        </div>
      );
    }

    return (
      <div className={`${size} rounded-full overflow-hidden flex-shrink-0`}>
        <Image
          src={review.avatar}
          alt={`${review.name} profile`}
          width={size.includes('20') ? 80 : 48}
          height={size.includes('20') ? 80 : 48}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    );
  };

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-cinzel text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="font-raleway text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have found their perfect piece at Arise Jewel
          </p>
          
          {/* Trust indicators */}
          <div className="flex justify-center items-center gap-8 mt-8">
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

        {/* Featured Review */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-16 -mt-16 opacity-60"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Avatar - Now using actual image */}
                <div className="flex-shrink-0">
                  <Avatar review={reviews[currentReview]} size="w-20 h-20" />
                </div>
                
                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex justify-center md:justify-start mb-3">
                    {renderStars(reviews[currentReview].rating)}
                  </div>
                  
                  <blockquote className="text-lg md:text-xl text-gray-700 italic mb-4 leading-relaxed">
                    "{reviews[currentReview].review}"
                  </blockquote>
                  
                  <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                    <div>
                      <p className="font-semibold text-gray-900 flex items-center justify-center md:justify-start gap-2">
                        {reviews[currentReview].name}
                        {reviews[currentReview].verified && (
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </p>
                      <p className="text-gray-600 text-sm">{reviews[currentReview].location}</p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <p className="text-sm text-gray-500">Purchased: {reviews[currentReview].product}</p>
                      <p className="text-sm text-gray-500">{reviews[currentReview].date}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Review Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {reviews.slice(0, 6).map((review, index) => (
            <div
              key={review.id}
              className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 ${
                index === currentReview ? 'ring-2 ring-amber-200' : ''
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                {/* Avatar - Now using actual image */}
                <Avatar review={review} />
                <div>
                  <p className="font-semibold text-gray-900 flex items-center gap-1">
                    {review.name}
                    {review.verified && (
                      <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </p>
                  <p className="text-sm text-gray-500">{review.location}</p>
                </div>
              </div>
              
              <div className="flex mb-3">
                {renderStars(review.rating)}
              </div>
              
              <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                "{review.review}"
              </p>
              
              <div className="text-xs text-gray-500 border-t pt-3">
                <p className="font-medium">{review.product}</p>
                <p>{review.date}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Review Navigation Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentReview(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentReview 
                  ? 'bg-amber-500 scale-110' 
                  : 'bg-gray-300 hover:bg-amber-300'
              }`}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-gray-600 mb-6">Ready to create your own success story?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/products"
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-full font-medium transition-colors"
            >
              Shop Now
            </Link>
            <Link 
              href="/reviews"
              className="border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white px-8 py-3 rounded-full font-medium transition-colors"
            >
              Read More Reviews
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;