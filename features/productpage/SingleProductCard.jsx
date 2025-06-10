import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaHeart, 
  FaShare, 
  FaStar, 
  FaShoppingCart, 
  FaTag, 
  FaCertificate,
  FaClock,
  FaGift,
  FaCalendarAlt,
  FaBoxes,
  FaPalette,
  FaCrown,
  FaAward
} from 'react-icons/fa'
import { FaShield } from 'react-icons/fa6'
import Button from '@/components/ui/Button'
import ImageSlider from '@/components/ui/ImageSlider'
import BookingForm from '@/components/ui/BookingForm'
import BuyingForm from '@/components/ui/BuyingForm'

const SingleProductCard = ({ data, type, params }) => {
  const [selectedVariant, setSelectedVariant] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isFavorited, setIsFavorited] = useState(false)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [showBuyingForm, setShowBuyingForm] = useState(false)

  const isProduct = type === 'product'
  const isService = type === 'service'

  // Handle API data format - updated for new service structure
  const currentPrice = isProduct ? data.salePrice : data.servicePrice
  const promotionPrice = isProduct ? data.promotion?.price : null // No promotionPrice for services in new structure
  const hasPromotion = isProduct ? !!data.promotion : (data.promotion?.isActive || false)
  const displayPrice = hasPromotion && promotionPrice ? promotionPrice : currentPrice
  const itemName = isProduct ? (data.productDetail || data.name || data.title) : (data.serviceName || data.name || data.title)

  // Calculate savings - only for products
  const savings = hasPromotion && promotionPrice ? currentPrice - promotionPrice : 0
  const savingsPercentage = hasPromotion && promotionPrice ? Math.round((savings / currentPrice) * 100) : 0

  // Get images
  const images = isProduct ? data.images : data.serviceImages
  const fallbackImage = ['/shop-beds.webp']

  // Get promotion dates - only for products
  const promotionStartDate = isProduct ? data.promotion?.startDate : null
  const promotionEndDate = isProduct ? data.promotion?.endDate : null

  // Safe string conversion for display
  const safeString = (value) => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (value && typeof value === 'object') return JSON.stringify(value);
    return value || '';
  };

  // Safe description handling
  const description = isProduct 
    ? (data.description || data.productDetail || data.details || '')
    : (data.description || data.serviceDetail || data.details || '');

  const handleBookingSuccess = (bookingData) => {
  };

  const handleBuyingSuccess = (buyingData) => {
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.15
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  }

  return (
    <>
      <motion.div 
        className="relative pt-20 sm:pt-24 md:pt-28 lg:pt-32"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 sm:top-20 -right-10 sm:-right-20 w-48 sm:w-96 h-48 sm:h-96 bg-primary-100 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-10 sm:bottom-20 -left-10 sm:-left-20 w-48 sm:w-96 h-48 sm:h-96 bg-accent-100 rounded-full opacity-20 blur-3xl"></div>
        </div>

        {/* Breadcrumb */}
        <motion.div variants={itemVariants} className="container mx-auto px-4 sm:px-6 mb-4 sm:mb-6 max-w-7xl">
          <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500 overflow-x-auto">
            <span className="hover:text-primary-600 cursor-pointer transition-colors whitespace-nowrap">Home</span>
            <span>/</span>
            <span className="capitalize hover:text-primary-600 cursor-pointer transition-colors whitespace-nowrap">{type}s</span>
            <span>/</span>
            <span className="capitalize text-gray-400 whitespace-nowrap">{isProduct ? params['product-type'] : params['service-type']}</span>
            <span>/</span>
            <span className="text-primary-600 font-medium capitalize whitespace-nowrap">{isProduct ? params.product : params.service}</span>
          </div>
        </motion.div>

        <div className="container mx-auto px-4 sm:px-6 pb-8 sm:pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 max-w-7xl mx-auto">
            {/* Left Side - Images */}
            <motion.div variants={itemVariants} className="relative order-1 lg:order-1">
              {/* Luxury Badge */}
              <motion.div 
                className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20"
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-2 sm:px-3 py-1 rounded-full font-semibold text-xs flex items-center space-x-1 shadow-lg">
                  <FaCrown className="w-2 sm:w-3 h-2 sm:h-3" />
                  <span className="hidden sm:inline">PREMIUM</span>
                  <span className="sm:hidden">VIP</span>
                </div>
              </motion.div>

              {/* Promotion Badge - only show for products with actual savings */}
              {hasPromotion && savingsPercentage > 0 && (
                <motion.div 
                  className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20"
                  initial={{ scale: 0, rotate: 10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                >
                  <div className="bg-gradient-to-r from-accent-500 to-accent-600 text-brown-900 px-2 sm:px-3 py-1 rounded-full font-bold text-xs flex items-center space-x-1 shadow-lg">
                    <FaTag className="w-2 sm:w-3 h-2 sm:h-3" />
                    <span>{savingsPercentage}% OFF</span>
                  </div>
                </motion.div>
              )}

              {/* Special offer badge for services */}
              {isService && hasPromotion && (
                <motion.div 
                  className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20"
                  initial={{ scale: 0, rotate: 10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                >
                  <div className="bg-gradient-to-r from-accent-500 to-accent-600 text-brown-900 px-2 sm:px-3 py-1 rounded-full font-bold text-xs flex items-center space-x-1 shadow-lg">
                    <FaTag className="w-2 sm:w-3 h-2 sm:h-3" />
                    <span>SPECIAL</span>
                  </div>
                </motion.div>
              )}

              <div className="relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-white to-gray-50 shadow-xl sm:shadow-2xl border border-gray-100">
                <ImageSlider 
                  images={images && images.length > 0 ? images : fallbackImage}
                  mainImageClassName="rounded-2xl sm:rounded-3xl object-cover"
                  containerClassName="h-full"
                />
                
                {/* Subtle overlay for luxury effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none rounded-2xl sm:rounded-3xl"></div>
              </div>

              {/* Floating Action Buttons - Mobile: Bottom center, Desktop: Bottom right */}
              <motion.div 
                className="absolute -bottom-3 sm:-bottom-4 left-1/2 lg:left-auto lg:right-8 transform -translate-x-1/2 lg:translate-x-0 flex space-x-2 sm:space-x-3"
                variants={itemVariants}
              >
                <motion.button
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/90 text-gray-600 hover:text-primary-600 shadow-lg backdrop-blur-sm border border-white/50 transition-all"
                >
                  <FaShare className="w-4 sm:w-5 h-4 sm:h-5" />
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right Side - Details */}
            <motion.div variants={itemVariants} className="space-y-4 sm:space-y-6 order-2 lg:order-2">
              {/* Header Section */}
              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-2 sm:space-y-3">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                    {itemName}
                  </h1>
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="w-3 sm:w-4 h-3 sm:h-4 text-accent-500 fill-current" />
                      ))}
                      <span className="text-xs sm:text-sm text-gray-600 ml-1 sm:ml-2 font-medium">4.9 • 127 reviews</span>
                    </div>
                  </div>
                </div>

                {/* Brand and Category Tags */}
                {isProduct && (
                  <div className="flex flex-wrap gap-2">
                    {data.brand && (
                      <span className="bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 px-3 sm:px-4 py-1 sm:py-2 rounded-full font-medium text-xs sm:text-sm border border-primary-200">
                        <FaAward className="w-2 sm:w-3 h-2 sm:h-3 inline mr-1 sm:mr-2" />
                        {safeString(data.brand)}
                      </span>
                    )}
                    {data.category && (
                      <span className="bg-gradient-to-r from-secondary-50 to-secondary-100 text-secondary-700 px-3 sm:px-4 py-1 sm:py-2 rounded-full font-medium text-xs sm:text-sm border border-secondary-200">
                        {safeString(typeof data.category === 'object' ? data.category.title || data.category.name : data.category)}
                      </span>
                    )}
                  </div>
                )}

                {/* Service Type Tag */}
                {isService && (
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 px-3 sm:px-4 py-1 sm:py-2 rounded-full font-medium text-xs sm:text-sm border border-primary-200">
                      <FaAward className="w-2 sm:w-3 h-2 sm:h-3 inline mr-1 sm:mr-2" />
                      {safeString(data.serviceType)}
                    </span>
                  </div>
                )}
              </div>

              {/* Price Section */}
              <div className="bg-gradient-to-r from-cream-50 to-cream-100 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-cream-200">
                <div className="flex items-baseline space-x-2 sm:space-x-3 mb-2">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                    AED {displayPrice?.toLocaleString() || currentPrice?.toLocaleString()}
                  </span>
                  {hasPromotion && promotionPrice && (
                    <span className="text-lg sm:text-xl text-gray-400 line-through">
                      AED {currentPrice?.toLocaleString()}
                    </span>
                  )}
                </div>
                {hasPromotion && savings > 0 && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <FaGift className="w-3 sm:w-4 h-3 sm:h-4" />
                    <span className="font-semibold text-sm sm:text-base">You save AED {savings?.toLocaleString()}!</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Limited Time</span>
                  </div>
                )}
                {isService && hasPromotion && (
                  <div className="flex items-center space-x-2 text-primary-600">
                    <FaGift className="w-3 sm:w-4 h-3 sm:h-4" />
                    <span className="font-semibold text-sm sm:text-base">Special Offer Available!</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  {description}
                </p>
              </div>

              {/* Quantity and Action Buttons */}
              <div className="space-y-4">
                {isProduct && (
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <span className="font-semibold text-gray-900 text-sm sm:text-base">Quantity:</span>
                    <div className="flex items-center border-2 border-gray-200 rounded-lg sm:rounded-xl overflow-hidden bg-white">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 sm:p-3 hover:bg-gray-50 transition-colors font-bold text-gray-600 text-sm sm:text-base"
                      >
                        −
                      </button>
                      <span className="px-3 sm:px-6 py-2 sm:py-3 font-semibold bg-gray-50 border-x border-gray-200 text-sm sm:text-base">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 sm:p-3 hover:bg-gray-50 transition-colors font-bold text-gray-600 text-sm sm:text-base"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button 
                    variant="primary" 
                    className="justify-center py-3 sm:py-4 text-sm sm:text-base font-semibold"
                    onClick={isService ? () => setShowBookingForm(true) : () => setShowBuyingForm(true)}
                  >
                    <FaShoppingCart className="w-4 sm:w-5 h-4 sm:h-5" />
                    {isProduct ? 'Buy Now' : 'Book Service'}
                  </Button>
                  {/* <Button variant="outline" className="justify-center py-3 sm:py-4 text-sm sm:text-base font-semibold">
                    {isProduct ? 'Buy Now' : 'Call Now'}
                  </Button> */}
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-gray-200">
                {isProduct && (
                  <>
                    {data.productCode && (
                      <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm text-gray-600">
                        <FaCertificate className="w-3 sm:w-4 h-3 sm:h-4 text-primary-600 flex-shrink-0" />
                        <span>Code: {data.productCode}</span>
                      </div>
                    )}
                    {data.unit && (
                      <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm text-gray-600">
                        <FaBoxes className="w-3 sm:w-4 h-3 sm:h-4 text-primary-600 flex-shrink-0" />
                        <span>Unit: {data.unit}</span>
                      </div>
                    )}
                  </>
                )}

                {isService && data.serviceCode && (
                  <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm text-gray-600">
                    <FaCertificate className="w-3 sm:w-4 h-3 sm:h-4 text-primary-600 flex-shrink-0" />
                    <span>Code: {data.serviceCode}</span>
                  </div>
                )}
                
                {hasPromotion && promotionEndDate && (
                  <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm text-gray-600">
                    <FaCalendarAlt className="w-3 sm:w-4 h-3 sm:h-4 text-accent-600 flex-shrink-0" />
                    <span>Valid till: {new Date(promotionEndDate).toLocaleDateString()}</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm text-gray-600">
                  <FaShield className="w-3 sm:w-4 h-3 sm:h-4 text-green-600 flex-shrink-0" />
                  <span>Secure Payment</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Booking Form Modal */}
      <AnimatePresence>
        {showBookingForm && isService && (
          <BookingForm
            service={data}
            onClose={() => setShowBookingForm(false)}
            onSuccess={handleBookingSuccess}
          />
        )}
      </AnimatePresence>

      {/* Buying Form Modal */}
      <AnimatePresence>
        {showBuyingForm && isProduct && (
          <BuyingForm
            product={data}
            quantity={quantity}
            onClose={() => setShowBuyingForm(false)}
            onSuccess={handleBuyingSuccess}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default SingleProductCard