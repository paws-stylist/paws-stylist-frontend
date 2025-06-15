import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaCreditCard, 
  FaLock,
  FaExclamationTriangle,
  FaSpinner,
  FaIdCard,
  FaTimes
} from 'react-icons/fa';
import Button from './Button';
import { useCart } from '../../contexts/CartContext';
import { useCompletePaymentFlow, usePaymentConfig, useCreateCashOnDeliveryOrder } from '../../hooks/usePayment';
import { 
  validateCustomerInfo, 
  validateBillingAddress,
  validateBillingAddressWithConfig, 
  formatPrice,
  UAE_EMIRATES,
  UAE_CITIES
} from '../../utils/payment';
import toast from 'react-hot-toast';

// Stripe card element options
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
    },
    invalid: {
      color: '#9e2146',
    },
  },
  hidePostalCode: true,
};

// Payment form component
const PaymentForm = ({ onSuccess, onCancel, onBack, paymentConfig }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { items, getTotal, clearCart } = useCart();
  const { 
    startPaymentFlow, 
    confirmPaymentSuccess,
    handlePaymentFailure,
    currentStep, 
    loading, 
    error: paymentError 
  } = useCompletePaymentFlow();
  const { createCashOnDeliveryOrder, loading: cashOnDeliveryLoading } = useCreateCashOnDeliveryOrder();

  // Get cities and emirates from backend config or fallback to hardcoded ones
  const supportedCities = paymentConfig?.data?.businessInfo?.supportedCities || UAE_CITIES;
  const supportedEmirates = paymentConfig?.data?.businessInfo?.supportedEmirates || UAE_EMIRATES;
  const vatRate = paymentConfig?.data?.vatRate || 5;
  const currency = paymentConfig?.data?.currency || 'AED';

  const [formData, setFormData] = useState({
    customerInfo: {
      name: '',
      email: '',
      phone: '',
      emiratesId: ''
    },
    billingAddress: {
      street: '',
      city: '',
      emirate: '',
      country: 'UAE',
      postalCode: ''
    }
  });

  const [formErrors, setFormErrors] = useState({});
  const [currentFormStep, setCurrentFormStep] = useState(1);
  const [cardError, setCardError] = useState(null);
  const [showCardError, setShowCardError] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isProcessingCashOrder, setIsProcessingCashOrder] = useState(false);
  const maxRetries = 2;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (name.startsWith('customerInfo.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        customerInfo: {
          ...prev.customerInfo,
          [field]: value
        }
      }));
    } else if (name.startsWith('billingAddress.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [field]: value
        }
      }));
    }
  };

  const handleCardChange = (event) => {
    // Only store the card error, don't display it immediately
    if (event.error) {
      setCardError(event.error.message);
    } else {
      setCardError(null);
    }
  };

  const validateStep1 = () => {
    const customerValidation = validateCustomerInfo(formData.customerInfo);
    const addressValidation = validateBillingAddressWithConfig(
      formData.billingAddress, 
      supportedCities, 
      supportedEmirates
    );
    
    const errors = {
      ...customerValidation.errors,
      ...addressValidation.errors
    };
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setCurrentFormStep(2);
      setShowCardError(false);
    }
  };

  const handlePreviousStep = () => {
    setCurrentFormStep(1);
    setShowCardError(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || processingPayment) {
      return;
    }

    // Enable card error display when payment is attempted
    setShowCardError(true);
    setProcessingPayment(true);

    try {
      // Start the payment flow - this will create order first, then payment intent
      const { clientSecret: newClientSecret, orderId, paymentIntentId } = await startPaymentFlow(
        items,
        formData.customerInfo,
        formData.billingAddress
      );

      const cardElement = elements.getElement(CardElement);
      
      // Validate card details first (this will show errors now)
      const { error: cardError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: formData.customerInfo.name,
          email: formData.customerInfo.email,
          phone: formData.customerInfo.phone,
          address: {
            line1: formData.billingAddress.street,
            city: formData.billingAddress.city,
            state: formData.billingAddress.emirate,
            country: 'AE',
            postal_code: formData.billingAddress.postalCode || undefined
          }
        }
      });

      if (cardError) {
        console.error('Card validation error:', cardError);
        
        // Handle payment failure through our backend
        await handlePaymentFailure(cardError);
        
        // Show card-specific error messages
        if (cardError.type === 'card_error') {
          toast.error(`Card Error: ${cardError.message}`);
        } else if (cardError.type === 'validation_error') {
          toast.error(`Validation Error: ${cardError.message}`);
        } else {
          toast.error('Card validation failed. Please check your card details.');
        }
        
        setProcessingPayment(false);
        return;
      }

      // Now call your backend confirm-payment API directly
      try {
        const confirmResponse = await confirmPaymentSuccess({
          id: paymentIntentId, // paymentIntentId
          payment_method: paymentMethod.id // paymentMethodId
        });

        // Handle successful payment confirmation from your backend
        resetRetryCount();
        clearCart();
        toast.success('Payment successful! Order confirmed.');
        
        if (onSuccess) {
          onSuccess({
            paymentIntent: { id: paymentIntentId, status: 'succeeded' },
            orderId,
            orderData: formData,
            confirmResponse
          });
        }

      } catch (confirmError) {
        console.error('Backend payment confirmation error:', confirmError);
        
        // Handle different backend response scenarios
        if (confirmError.message.includes('already_confirmed')) {
          toast.success('Payment was already confirmed! Order is being processed.');
        } else if (confirmError.message.includes('payment_failed')) {
          await handlePaymentFailure(confirmError);
          toast.error('Payment confirmation failed. Please try again or contact support.');
        } else if (confirmError.message.includes('insufficient_funds')) {
          await handlePaymentFailure(confirmError);
          toast.error('Insufficient funds. Please try a different payment method.');
        } else {
          await handlePaymentFailure(confirmError);
          toast.error('Payment confirmation failed. Please try again.');
        }
      }

    } catch (error) {
      console.error('Payment error:', error);
      
      // Handle network errors, API errors, etc.
      if (error.message.includes('network') || error.message.includes('connection')) {
        toast.error('Network error. Please check your connection and try again.');
      } else if (error.message.includes('order')) {
        toast.error('There was an issue creating your order. Please try again.');
      } else {
        toast.error(error.message || 'Payment failed. Please try again.');
      }
      
      // Offer retry option for certain errors
      if (retryCount < maxRetries && 
          (error.message.includes('network') || error.message.includes('temporary'))) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          toast.info(`Retrying payment... (Attempt ${retryCount + 2}/${maxRetries + 1})`);
          handleSubmit(event);
        }, 2000);
      }
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleCashOnDelivery = async () => {
    if (!validateStep1()) return;
    
    // Prevent multiple clicks/calls - check both hook loading and local state
    if (cashOnDeliveryLoading || isProcessingCashOrder) {
      console.log('⚠️ Cash on delivery order already in progress, ignoring duplicate call');
      return;
    }
    
    setIsProcessingCashOrder(true);
    
    try {
      console.log('🚀 Starting cash on delivery order process...');
      
      const orderResponse = await createCashOnDeliveryOrder(
        items,
        formData.customerInfo,
        formData.billingAddress
      );

      console.log('🎉 Cash on delivery order completed, clearing cart...');
      clearCart();
      toast.success('Order placed successfully! You will pay on delivery.');
      
      if (onSuccess) {
        onSuccess({
          orderId: orderResponse.data?._id || orderResponse.data?.id,
          paymentStatus: 'pending',
          paymentMethod: 'cash_on_delivery'
        });
      }
    } catch (error) {
      console.error('💥 Cash on delivery error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsProcessingCashOrder(false);
    }
  };

  // Reset retry count when form is reset or successful
  const resetRetryCount = () => {
    setRetryCount(0);
    setShowCardError(false);
  };

  const renderFieldError = (fieldName) => {
    if (formErrors[fieldName]) {
      return (
        <p className="text-red-500 text-xs mt-1 flex items-center">
          <FaExclamationTriangle className="w-3 h-3 mr-1" />
          {formErrors[fieldName]}
        </p>
      );
    }
    return null;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {currentFormStep === 1 && (
        <div className="space-y-6">
          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaUser className="w-5 h-5 mr-2 text-primary-600" />
              Customer Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="customerInfo.name"
                  value={formData.customerInfo.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                    formErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                  required
                />
                {renderFieldError('name')}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaEnvelope className="inline w-4 h-4 mr-1" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="customerInfo.email"
                    value={formData.customerInfo.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                      formErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="your@email.com"
                    required
                  />
                  {renderFieldError('email')}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaPhone className="inline w-4 h-4 mr-1" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="customerInfo.phone"
                    value={formData.customerInfo.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                      formErrors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+971 50 123 4567"
                    required
                  />
                  {renderFieldError('phone')}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaIdCard className="inline w-4 h-4 mr-1" />
                  Emirates ID (Optional)
                </label>
                <input
                  type="text"
                  name="customerInfo.emiratesId"
                  value={formData.customerInfo.emiratesId}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                    formErrors.emiratesId ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="784-1990-1234567-1"
                />
                {renderFieldError('emiratesId')}
              </div>
            </div>
          </div>

          {/* Billing Address */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaMapMarkerAlt className="w-5 h-5 mr-2 text-primary-600" />
              Billing Address
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="billingAddress.street"
                  value={formData.billingAddress.street}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                    formErrors.street ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your street address"
                  required
                />
                {renderFieldError('street')}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <select
                    name="billingAddress.city"
                    value={formData.billingAddress.city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                      formErrors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Select City</option>
                    {supportedCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {renderFieldError('city')}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emirate *
                  </label>
                  <select
                    name="billingAddress.emirate"
                    value={formData.billingAddress.emirate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                      formErrors.emirate ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Select Emirate</option>
                    {supportedEmirates.map(emirate => (
                      <option key={emirate} value={emirate}>{emirate}</option>
                    ))}
                  </select>
                  {renderFieldError('emirate')}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code (Optional)
                </label>
                <input
                  type="text"
                  name="billingAddress.postalCode"
                  value={formData.billingAddress.postalCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="12345"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {currentFormStep === 2 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaCreditCard className="w-5 h-5 mr-2 text-primary-600" />
              Payment Information
            </h3>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <FaLock className="w-4 h-4 mr-2 text-green-600" />
                Your payment information is secure and encrypted
              </div>
            </div>

            <div className="border border-gray-300 rounded-lg p-4 bg-white">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Card Information *
              </label>
              <CardElement
                options={cardElementOptions}
                onChange={handleCardChange}
              />
              {showCardError && cardError && (
                <p className="text-red-500 text-xs mt-2 flex items-center">
                  <FaExclamationTriangle className="w-3 h-3 mr-1" />
                  {cardError}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Form Navigation */}
      <div className="flex justify-between pt-6 border-t border-gray-200 mt-6">
        <div>
          {currentFormStep === 2 && (
            <Button
              type="button"
              variant="outline"
              onClick={handlePreviousStep}
              disabled={loading || processingPayment}
            >
              Back
            </Button>
          )}
          {currentFormStep === 1 && onBack && (
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={loading || processingPayment}
            >
              Back to Cart
            </Button>
          )}
        </div>

        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading || processingPayment}
          >
            Cancel
          </Button>
          
          {currentFormStep === 1 ? (
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCashOnDelivery}
                disabled={loading || processingPayment || cashOnDeliveryLoading || isProcessingCashOrder}
              >
                {(cashOnDeliveryLoading || isProcessingCashOrder) ? (
                  <div className="flex items-center">
                    <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </div>
                ) : (
                  'Pay Cash On Delivery'
                )}
              </Button>
              <Button
                type="button"
                variant="disabled"
                onClick={handleNextStep}
              >
                Pay Online
              </Button>
            </div>
          ) : (
            <Button
              type="submit"
              variant="primary"
              disabled={!stripe || loading || processingPayment}
            >
              {processingPayment ? (
                <div className="flex items-center">
                  <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </div>
              ) : (
                <>
                  <FaLock className="w-4 h-4 mr-2" />
                  Pay {formatPrice(getTotal())}
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {paymentError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <div className="flex items-center">
            <FaExclamationTriangle className="w-4 h-4 mr-2" />
            {paymentError}
          </div>
        </div>
      )}
    </form>
  );
};

// Main checkout form component with Stripe provider
const CheckoutForm = ({ isOpen, onClose, onSuccess }) => {
  const [stripePromise, setStripePromise] = useState(null);
  const [stripeError, setStripeError] = useState(null);
  const { data: paymentConfig, loading: configLoading, error: configError } = usePaymentConfig();

  useEffect(() => {
    // Use environment variable for publishable key instead of backend
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    
    if (publishableKey) {
      try {
        const promise = loadStripe(publishableKey);
        setStripePromise(promise);
        setStripeError(null);
      } catch (error) {
        console.error('Error loading Stripe:', error);
        setStripeError(error.message);
      }
    } else {
      console.error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY not found in environment variables');
      setStripeError('Stripe publishable key not configured. Please check environment variables.');
    }
  }, [paymentConfig, configLoading]);

  const handleSuccess = (paymentData) => {
    if (onSuccess) onSuccess(paymentData);
    onClose();
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Secure Checkout</h2>
                <p className="text-gray-600 mt-1">Complete your purchase securely</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Show config error if any */}
            {configError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-6">
                <div className="flex items-center">
                  <FaExclamationTriangle className="w-4 h-4 mr-2" />
                  Payment configuration error: {configError}
                </div>
              </div>
            )}

            {/* Show stripe error if any */}
            {stripeError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-6">
                <div className="flex items-center">
                  <FaExclamationTriangle className="w-4 h-4 mr-2" />
                  Stripe initialization error: {stripeError}
                </div>
              </div>
            )}

            {configLoading ? (
              <div className="flex items-center justify-center py-12">
                <FaSpinner className="w-8 h-8 animate-spin text-primary-600" />
                <span className="ml-3 text-gray-600">Loading payment configuration...</span>
              </div>
            ) : !stripePromise ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <FaSpinner className="w-8 h-8 animate-spin text-primary-600" />
                <span className="text-gray-600">Initializing payment system...</span>
                <p className="text-sm text-gray-500">Please wait while we set up secure payments...</p>
              </div>
            ) : (
              <Elements stripe={stripePromise}>
                <PaymentForm
                  onSuccess={handleSuccess}
                  onCancel={onClose}
                  onBack={() => {/* Could implement going back to cart */}}
                  paymentConfig={paymentConfig}
                />
              </Elements>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CheckoutForm;