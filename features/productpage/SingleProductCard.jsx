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
import AddToCartButton from '@/components/ui/AddToCartButton'

const SingleProductCard = ({ data, type, params }) => {
  const [selectedVariant, setSelectedVariant] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isFavorited, setIsFavorited] = useState(false)
  const [showBookingForm, setShowBookingForm] = useState(false)

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
    // Handle successful booking
    console.log('Booking successful:', bookingData);
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

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            
            {/* Left Column - Image Slider */}
            <motion.div 
              className="relative"
              variants={itemVariants}
            >
              <div className="sticky top-32">
                <ImageSlider 
                  images={images && images.length > 0 ? images : fallbackImage}
                  alt={itemName}
                  className="rounded-3xl overflow-hidden shadow-2xl"
                />
                
                {/* Image Actions */}
                <div className="flex justify-center space-x-4 mt-6">
                  <button 
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={`p-3 sm:p-4 rounded-full border-2 transition-all duration-300 ${
                      isFavorited 
                        ? 'bg-red-500 border-red-500 text-white' 
                        : 'bg-white border-gray-200 text-gray-600 hover:border-red-500 hover:text-red-500'
                    }`}
                  >
                    <FaHeart className="w-5 sm:w-6 h-5 sm:h-6" />
                  </button>
                  <button className="p-3 sm:p-4 rounded-full border-2 border-gray-200 bg-white text-gray-600 hover:border-primary-500 hover:text-primary-500 transition-all duration-300">
                    <FaShare className="w-5 sm:w-6 h-5 sm:h-6" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Product Details */}
            <motion.div 
              className="space-y-6 sm:space-y-8"
              variants={itemVariants}
            >
              {/* Breadcrumb */}
              <div className="text-sm text-gray-500">
                <span>{isService ? 'Services' : 'Products'}</span>
                <span className="mx-2">•</span>
                <span className="text-primary-600">{data.category?.name || type}</span>
              </div>

              {/* Title and Rating */}
              <div className="space-y-3 sm:space-y-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  {itemName}
                </h1>
                
                {/* Rating */}
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="flex text-accent-500">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="w-4 sm:w-5 h-4 sm:h-5" />
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm sm:text-base">(4.9) • 234 reviews</span>
                </div>
              </div>

              {/* Price Section */}
              <div className="space-y-3 sm:space-y-4 p-4 sm:p-6 bg-gray-50 rounded-2xl">
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-600">
                    AED {displayPrice?.toLocaleString()}
                  </span>
                  
                  {hasPromotion && promotionPrice && (
                    <>
                      <span className="text-xl sm:text-2xl text-gray-500 line-through">
                        AED {currentPrice?.toLocaleString()}
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                        Save {savingsPercentage}%
                      </span>
                    </>
                  )}
                </div>
                
                {hasPromotion && (
                  <div className="flex items-center text-green-600 text-sm sm:text-base">
                    <FaTag className="w-4 h-4 mr-2" />
                    <span>Special offer - You save AED {savings?.toLocaleString()}!</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                  {safeString(description)}
                </p>
              </div>

              {/* Quantity and Action Buttons */}
              <div className="space-y-4">
                {isProduct && (
                  <AddToCartButton 
                    product={data} 
                    showQuantity={true}
                    initialQuantity={quantity}
                    className="w-full"
                  />
                )}

                {isService && (
                  <Button 
                    variant="primary" 
                    className="w-full justify-center py-3 sm:py-4 text-sm sm:text-base font-semibold"
                    onClick={() => setShowBookingForm(true)}
                  >
                    <FaCalendarAlt className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                    Book Service
                  </Button>
                )}
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

      {/* Booking Form Modal - Only for services */}
      <AnimatePresence>
        {showBookingForm && isService && (
          <BookingForm
            service={data}
            onClose={() => setShowBookingForm(false)}
            onSuccess={handleBookingSuccess}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default SingleProductCard