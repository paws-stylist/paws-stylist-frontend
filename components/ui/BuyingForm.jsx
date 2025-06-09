import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaShoppingCart, FaBox, FaStickyNote, FaCog, FaCalendarAlt, FaCreditCard, FaCalculator } from 'react-icons/fa';
import Button from './Button';
import { usePost } from '../../hooks/useApi';

const BuyingForm = ({ product, quantity = 1, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    orderType: 'normal',
    customerName: '',
    contactNumber: '',
    email: '',
    deliveryAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'UAE'
    },
    orderDate: '',
    orderNotes: ''
  });

  const [buyingState, triggerPurchase] = usePost('/orders', {
    showSuccessToast: true,
    successMessage: 'Order placed successfully! You will receive a confirmation email.',
    onSuccess: (data) => {
      if (onSuccess) onSuccess(data);
      if (onClose) onClose();
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('deliveryAddress.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        deliveryAddress: {
          ...prev.deliveryAddress,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    formData.orderDate = new Date().toISOString();
    
    // Validate required fields
    if (!formData.customerName || !formData.contactNumber || !formData.email || 
        !formData.deliveryAddress.street || !formData.deliveryAddress.city || 
        !formData.deliveryAddress.state || !formData.deliveryAddress.zipCode || 
        !formData.orderDate) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Calculate pricing
    const currentPrice = product.salePrice;
    const promotionPrice = product.promotion?.price;
    const hasPromotion = !!product.promotion;
    const unitPrice = hasPromotion && promotionPrice ? promotionPrice : currentPrice;
    const subtotal = unitPrice * quantity;
    

    try {
      await triggerPurchase({
        ...formData,
        products: [{
          product: product._id,
          quantity: quantity
        }],
        orderDate: new Date(formData.orderDate).toISOString(),
        subtotal: subtotal,
        totalAmount: totalAmount
      });
    } catch (error) {
      console.error('Purchase error:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  // Calculate pricing for display
  const currentPrice = product.salePrice;
  const promotionPrice = product.promotion?.price;
  const hasPromotion = !!product.promotion;
  const unitPrice = hasPromotion && promotionPrice ? promotionPrice : currentPrice;
  const subtotal = unitPrice * quantity;
  const savings = hasPromotion && promotionPrice ? (currentPrice - promotionPrice) * quantity : 0;
  
  // Calculate totals with tax and delivery
  const taxAmount = formData.taxAmount ? parseFloat(formData.taxAmount) : 0;
  const deliveryFee = formData.deliveryFee ? parseFloat(formData.deliveryFee) : 0;
  const totalAmount = subtotal + taxAmount + deliveryFee;

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().slice(0, 16);

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Complete Order</h2>
              <p className="text-gray-600 mt-1">{product?.productDetail || product?.name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Order Type */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaCog className="inline w-4 h-4 mr-2 text-primary-600" />
              Order Type
            </label>
            <select
              name="orderType"
              value={formData.orderType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            >
              <option value="normal">Normal Delivery</option>
              <option value="urgent">Urgent Delivery</option>
            </select>
          </motion.div>

          {/* Customer Name */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaUser className="inline w-4 h-4 mr-2 text-primary-600" />
              Customer Name *
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="Enter your full name"
              required
            />
          </motion.div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaEnvelope className="inline w-4 h-4 mr-2 text-primary-600" />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Enter your email address"
                required
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaPhone className="inline w-4 h-4 mr-2 text-primary-600" />
                Contact Number *
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="+971 50 123 4567"
                required
              />
            </motion.div>
          </div>

          {/* Delivery Address */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <FaMapMarkerAlt className="inline w-4 h-4 mr-2 text-primary-600" />
              Delivery Address *
            </label>
            <div className="space-y-3">
              <input
                type="text"
                name="deliveryAddress.street"
                value={formData.deliveryAddress.street}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Street Address *"
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  name="deliveryAddress.city"
                  value={formData.deliveryAddress.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="City *"
                  required
                />
                <input
                  type="text"
                  name="deliveryAddress.state"
                  value={formData.deliveryAddress.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="State/Emirate *"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  name="deliveryAddress.zipCode"
                  value={formData.deliveryAddress.zipCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Zip Code *"
                  required
                />
                <input
                  type="text"
                  name="deliveryAddress.country"
                  value={formData.deliveryAddress.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Country"
                />
              </div>
            </div>
          </motion.div>

          {/* Order Notes */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaStickyNote className="inline w-4 h-4 mr-2 text-primary-600" />
              Order Notes
            </label>
            <textarea
              name="orderNotes"
              value={formData.orderNotes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
              placeholder="Any special instructions or notes..."
            />
          </motion.div>

          {/* Order Summary */}
          <motion.div variants={itemVariants} className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <FaShoppingCart className="w-4 h-4 mr-2" />
              Order Summary
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span className="font-medium">Product:</span>
                <span>{product?.productDetail || product?.name}</span>
              </div>
              {product?.productCode && (
                <div className="flex justify-between">
                  <span className="font-medium">Code:</span>
                  <span>{product.productCode}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-medium">Quantity:</span>
                <span>{quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Unit Price:</span>
                <span>AED {unitPrice?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Subtotal:</span>
                <span>AED {subtotal?.toLocaleString()}</span>
              </div>
              {hasPromotion && savings > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="font-medium">You Save:</span>
                  <span>AED {savings?.toLocaleString()}</span>
                </div>
              )}
              {taxAmount > 0 && (
                <div className="flex justify-between">
                  <span className="font-medium">Tax:</span>
                  <span>AED {taxAmount?.toLocaleString()}</span>
                </div>
              )}
              {deliveryFee > 0 && (
                <div className="flex justify-between">
                  <span className="font-medium">Delivery Fee:</span>
                  <span>AED {deliveryFee?.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t border-gray-300 pt-2 mt-2">
                <div className="flex justify-between font-semibold text-gray-900">
                  <span>Total:</span>
                  <span>AED {totalAmount?.toLocaleString()}</span>
                </div>
              </div>
              {hasPromotion && (
                <p className="text-primary-600 font-medium text-xs">
                  Special offer applied!
                </p>
              )}
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants} className="pt-4">
            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 text-base font-semibold"
              disabled={buyingState.loading}
            >
              {buyingState.loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                <>
                  <FaShoppingCart className="w-4 h-4 mr-2" />
                  Place Order - AED {totalAmount?.toLocaleString()}
                </>
              )}
            </Button>
          </motion.div>

          {/* Error Display */}
          {buyingState.error && (
            <motion.div 
              variants={itemVariants}
              className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
            >
              {buyingState.error}
            </motion.div>
          )}
        </form>
      </motion.div>
    </motion.div>
  );
};

export default BuyingForm; 