import React from 'react';
import { motion } from 'framer-motion';
import { FaPaw, FaHeart, FaStar } from 'react-icons/fa';
import Button from '@/components/ui/Button';

const Hero = ({ type }) => {
  console.log({type});
  const typeInfo = {
    'walk-gear': {
      title: 'Walk Gear',
      subtitle: 'Luxury Collection',
      description: 'Handcrafted essentials for the discerning pet owner. Where elegance meets functionality.',
      bgImage: '/feeding.webp',
      accent: 'Premium Quality',
      icon: FaPaw
    },
    'feeding': {
      title: 'Feeding',
      subtitle: 'Luxury Collection',
      description: 'Transform dining into an art form with our exquisite feeding solutions.',
      bgImage: '/feeding.webp',
      accent: 'Artisan Crafted',
      icon: FaPaw
    },
    'beds': {
      title: 'Pet Beds',
      subtitle: 'Luxury Collection',
      description: 'Where comfort becomes luxury. Indulgent rest for your beloved companion.',
      bgImage: '/feeding.webp',
      accent: 'Ultimate Comfort',
      icon: FaHeart
    },
    'toys': {
      title: 'Pet Toys',
      subtitle: 'Luxury Collection',
      description: 'Sophisticated play experiences designed for the refined pet.',
      bgImage: '/feeding.webp',
      accent: 'Intelligent Design',
      icon: FaPaw
    },
    'cats': {
      title: 'Feline',
      subtitle: 'Luxury Collection',
      description: 'Exclusively curated for the most discerning feline connoisseurs.',
      bgImage: '/feeding.webp',
      accent: 'Feline Excellence',
      icon: FaPaw
    },
    'home-grooming': {
      title: 'Home Grooming',
      subtitle: 'Grooming at home',
      description: 'Experience the luxury of home grooming with our expert team.',
      bgImage: '/feeding.webp',
      accent: 'Home Grooming',
      icon: FaPaw
    },
    'mobile-grooming': {
      title: 'Mobile Grooming',
      subtitle: 'Grooming on the Go',
      description: 'Experience the luxury of mobile grooming with our expert team.',
      bgImage: '/feeding.webp',
      accent: 'Mobile Grooming',
      icon: FaPaw
    }
  };

  const info = typeInfo[type] || typeInfo['walk-gear'];
  const Icon = info.icon;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-cream-50 via-white to-cream-100 overflow-hidden lg:px-32 md:px-16 px-4">
      {/* Navbar Background Overlay - Dark gradient at top for navbar visibility */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-gray-900/60 via-gray-900/30 to-transparent z-0"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-30 -translate-y-48 translate-x-48"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-100 rounded-full blur-3xl opacity-20 translate-y-32 -translate-x-32"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-screen py-20">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-primary-200 shadow-lg"
            >
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
              <span className="text-primary-700 font-medium text-sm tracking-wide uppercase">
                {info.accent}
              </span>
            </motion.div>

            {/* Main Title */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-6xl lg:text-7xl font-light text-gray-900 leading-tight"
              >
                {info.title}
                <span className="block text-primary-600 font-normal italic">
                  {info.subtitle}
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-xl text-gray-600 max-w-lg leading-relaxed font-light"
              >
                {info.description}
              </motion.p>
            </div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Button variant="primary">
                Explore Collection
              </Button>
              
              <Button variant="outline">
                View Catalog
              </Button>
            </motion.div>

            {/* Luxury Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="flex items-center gap-8 pt-8 border-t border-gray-200"
            >
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="w-4 h-4 text-accent-500" />
                  ))}
                </div>
                <span className="text-gray-600 text-sm">Rated Excellent</span>
              </div>
              
              <div className="text-gray-600 text-sm">
                <span className="font-semibold text-primary-600">500+</span> Happy Customers
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* Main Image Container */}
            <div className="relative">
              {/* Background Accent */}
              <div className="absolute -top-8 -right-8 w-full h-full bg-primary-100 rounded-lg"></div>
              
              {/* Main Image */}
              <div className="relative bg-white rounded-lg shadow-2xl overflow-hidden">
                <img
                  src={info.bgImage}
                  alt={info.title}
                  className="w-full h-[400px] md:h-[600px] object-cover"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                
                {/* Floating Quality Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-primary-600" />
                    <span className="text-sm font-medium text-gray-800">Premium Quality</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Floating Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-xl p-6 border border-gray-100"
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">20+</div>
                  <div className="text-sm text-gray-600">Curated Items</div>
                </div>
                <div className="text-center border-l border-gray-200 pl-6">
                  <div className="text-2xl font-bold text-primary-600">4.9</div>
                  <div className="text-sm text-gray-600">Excellence Rating</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero; 