import React from 'react';
import { motion } from 'framer-motion';
import { FaPaw, FaHeart, FaStar, FaCut, FaHome, FaCar } from 'react-icons/fa';
import Button from '@/components/ui/Button';
import { useGet } from '@/hooks/useApi';

const Hero = ({ type, isService = false }) => {  
  // Fetch category data based on whether it's a service or product
  const { data: categories, loading: categoriesLoading } = useGet(
    isService ? '/service-categories/active' : '/product-categories/active',
    { immediate: true, showErrorToast: false }
  );

  // Find the current category based on the slug/type
  let currentCategory = null;
  if (categories && categories.length > 0) {
    currentCategory = categories.find(cat => cat.slug === type);
  }

  // Fallback content structure
  const fallbackInfo = {
    title: isService ? 'Our Services' : 'Our Products',
    subtitle: 'Premium Collection',
    description: isService 
      ? 'Professional pet care services designed for your beloved companion.' 
      : 'Quality products crafted with care for your pet\'s needs.',
    image: '/feeding.webp',
    accent: 'Premium Quality'
  };

  // Use category data or fallback
  const categoryInfo = currentCategory ? {
    title: currentCategory.title,
    subtitle: currentCategory.subtitle || (isService ? 'Professional Service' : 'Premium Collection'),
    description: currentCategory.description,
    image: currentCategory.image || '/feeding.webp',
    accent: currentCategory.accent || (isService ? 'Professional Care' : 'Premium Quality')
  } : fallbackInfo;

  // Dynamic icon selection based on service type or category
  const getIcon = () => {
    if (isService) {
      if (type?.includes('home')) return FaHome;
      if (type?.includes('mobile')) return FaCar;
      return FaCut;
    }
    return FaPaw;
  };

  const Icon = getIcon();

  // Show loading state
  if (categoriesLoading) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-cream-50 via-white to-cream-100 overflow-hidden lg:px-32 md:px-16 px-4">
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-gray-900/60 via-gray-900/30 to-transparent z-0"></div>
        <div className="container mx-auto px-4 relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-xl text-gray-600">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

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
                {categoryInfo.accent}
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
                {categoryInfo.title}
                <span className="block text-primary-600 font-normal italic">
                  {categoryInfo.subtitle}
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-xl text-gray-600 max-w-lg leading-relaxed font-light"
              >
                {categoryInfo.description}
              </motion.p>
            </div>

            {/* CTA Section */}
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
              href="#collection"
            >
              <Button variant="primary">
                {isService ? 'Book Service' : 'Explore Collection'}
              </Button>
              
              {/* <Button variant="outline">
                {isService ? 'Learn More' : 'View Catalog'}
              </Button> */}
            </motion.a>

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
                  src={categoryInfo.image}
                  alt={categoryInfo.title}
                  className="w-full h-[400px] md:h-[600px] object-cover"
                  onError={(e) => {
                    e.target.src = '/feeding.webp'; // Fallback image
                  }}
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
                    <span className="text-sm font-medium text-gray-800">
                      {isService ? 'Professional Service' : 'Premium Quality'}
                    </span>
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
                  <div className="text-sm text-gray-600">
                    {isService ? 'Services' : 'Curated Items'}
                  </div>
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