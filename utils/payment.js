// Payment utility functions for Paws Stylist UAE

// UAE Phone number validation regex
export const UAE_PHONE_REGEX = /^(?:\+971|971|00971|0)?(?:50|51|52|54|55|56|58)\d{7}$/;

// Emirates ID validation regex
export const EMIRATES_ID_REGEX = /^784-\d{4}-\d{7}-\d{1}$/;

// UAE Emirates list
export const UAE_EMIRATES = [
  'Abu Dhabi',
  'Dubai', 
  'Sharjah',
  'Ajman',
  'Umm Al Quwain',
  'Ras Al Khaimah',
  'Fujairah'
];

// UAE Cities list
export const UAE_CITIES = [
  'Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Al Ain', 'Fujairah',
  'Ras Al Khaimah', 'Umm Al Quwain', 'Khor Fakkan', 'Dibba',
  'Kalba', 'Madinat Zayed', 'Liwa', 'Ghayathi', 'Ruwais',
  'Masafi', 'Hatta', 'Jebel Ali', 'Dubai Marina', 'Downtown Dubai'
];

// Format price for UAE (AED)
export const formatPrice = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return 'AED 0.00';
  }
  
  return `AED ${amount.toLocaleString('en-AE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

// Convert AED to fils (Stripe expects amounts in smallest currency unit)
export const aedToFils = (aedAmount) => {
  return Math.round(aedAmount * 100);
};

// Convert fils to AED
export const filsToAed = (filsAmount) => {
  return filsAmount / 100;
};

// Validate UAE phone number
export const validateUAEPhone = (phone) => {
  if (!phone) return { isValid: false, error: 'Phone number is required' };
  
  const cleanPhone = phone.replace(/\s+/g, '');
  if (!UAE_PHONE_REGEX.test(cleanPhone)) {
    return { 
      isValid: false, 
      error: 'Please enter a valid UAE phone number (e.g., +971 50 123 4567)' 
    };
  }
  
  return { isValid: true, phone: cleanPhone };
};

// Validate Emirates ID (optional)
export const validateEmiratesId = (emiratesId) => {
  if (!emiratesId) return { isValid: true }; // Optional field
  
  if (!EMIRATES_ID_REGEX.test(emiratesId)) {
    return { 
      isValid: false, 
      error: 'Please enter a valid Emirates ID (format: 784-YYYY-XXXXXXX-X)' 
    };
  }
  
  return { isValid: true };
};

// Validate email
export const validateEmail = (email) => {
  if (!email) return { isValid: false, error: 'Email is required' };
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};

// Validate customer information for payment
export const validateCustomerInfo = (customerInfo) => {
  const errors = {};
  
  // Name validation
  if (!customerInfo.name || customerInfo.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long';
  }
  
  // Email validation
  const emailValidation = validateEmail(customerInfo.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  }
  
  // Phone validation
  const phoneValidation = validateUAEPhone(customerInfo.phone);
  if (!phoneValidation.isValid) {
    errors.phone = phoneValidation.error;
  }
  
  // Emirates ID validation (optional)
  if (customerInfo.emiratesId) {
    const emiratesIdValidation = validateEmiratesId(customerInfo.emiratesId);
    if (!emiratesIdValidation.isValid) {
      errors.emiratesId = emiratesIdValidation.error;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate billing address with configurable cities and emirates
export const validateBillingAddressWithConfig = (address, supportedCities = UAE_CITIES, supportedEmirates = UAE_EMIRATES) => {
  const errors = {};
  
  if (!address.street || address.street.trim().length < 5) {
    errors.street = 'Street address must be at least 5 characters long';
  }
  
  if (!address.city || !supportedCities.includes(address.city)) {
    errors.city = 'Please select a valid city';
  }
  
  if (!address.emirate || !supportedEmirates.includes(address.emirate)) {
    errors.emirate = 'Please select a valid emirate';
  }
  
  if (!address.country || address.country !== 'UAE') {
    errors.country = 'Country must be UAE';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate billing address (backward compatibility)
export const validateBillingAddress = (address) => {
  return validateBillingAddressWithConfig(address, UAE_CITIES, UAE_EMIRATES);
};

// Create order data for payment
export const createOrderData = (cartItems, customerInfo, billingAddress) => {
  const products = cartItems.map(item => ({
    product: item.id, // This should be the MongoDB ObjectId of the product
    quantity: item.quantity,
    price: item.hasPromotion && item.promotionPrice ? item.promotionPrice : item.price
  }));
  
  const subtotal = cartItems.reduce((total, item) => {
    const price = item.hasPromotion && item.promotionPrice ? item.promotionPrice : item.price;
    return total + (price * item.quantity);
  }, 0);
  
  const vatAmount = subtotal * 0.05; // 5% VAT
  const totalAmount = subtotal + vatAmount;
  
  // Structure according to your order API validation rules
  return {
    orderType: 'normal', // Can be 'urgent' or 'normal'
    customerName: customerInfo.name,
    contactNumber: customerInfo.phone,
    email: customerInfo.email,
    emiratesId: customerInfo.emiratesId || undefined, // Optional field
    deliveryAddress: {
      street: billingAddress.street,
      city: billingAddress.city,
      state: billingAddress.emirate, // API expects 'state' field
      country: billingAddress.country || 'UAE'
    },
    // Billing address is separate in our frontend but delivery address covers it for now
    billingAddress: {
      street: billingAddress.street,
      city: billingAddress.city,
      state: billingAddress.emirate,
      country: billingAddress.country || 'UAE'
    },
    products,
    paymentMethod: 'stripe', // As per your API validation options
    subtotal: subtotal,
    taxAmount: vatAmount, // API expects 'taxAmount' not 'vatAmount'
    totalAmount: totalAmount,
    deliveryFee: 0, // Default to 0, can be configured later
    orderNotes: '', // Optional, can be added to frontend form if needed
    // Payment status will be managed by the payment service
    paymentStatus: 'pending',
    orderDate: new Date().toISOString()
  };
};

// Format customer info for Stripe
export const formatCustomerInfoForStripe = (customerInfo, billingAddress) => {
  return {
    name: customerInfo.name,
    email: customerInfo.email,
    phone: customerInfo.phone,
    emiratesId: customerInfo.emiratesId || undefined
  };
};

// Format billing address for Stripe
export const formatBillingAddressForStripe = (billingAddress) => {
  return {
    street: billingAddress.street,
    city: billingAddress.city,
    emirate: billingAddress.emirate,
    country: 'UAE',
    postalCode: billingAddress.postalCode || undefined
  };
};

// Calculate order totals
export const calculateOrderTotals = (cartItems) => {
  const subtotal = cartItems.reduce((total, item) => {
    const price = item.hasPromotion && item.promotionPrice ? item.promotionPrice : item.price;
    return total + (price * item.quantity);
  }, 0);
  
  const originalTotal = cartItems.reduce((total, item) => {
    return total + (item.originalPrice * item.quantity);
  }, 0);
  
  const savings = originalTotal - subtotal;
  const vatAmount = subtotal * 0.05;
  const totalAmount = subtotal + vatAmount;
  
  return {
    subtotal,
    originalTotal,
    savings,
    vatAmount,
    totalAmount,
    itemCount: cartItems.reduce((total, item) => total + item.quantity, 0)
  };
};

// Generate order summary for display
export const generateOrderSummary = (cartItems) => {
  const totals = calculateOrderTotals(cartItems);
  
  return {
    items: cartItems.map(item => ({
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.hasPromotion && item.promotionPrice ? item.promotionPrice : item.price,
      originalPrice: item.originalPrice,
      totalPrice: (item.hasPromotion && item.promotionPrice ? item.promotionPrice : item.price) * item.quantity,
      hasPromotion: item.hasPromotion,
      productCode: item.productCode
    })),
    ...totals
  };
};

// Error messages for payment failures
export const getPaymentErrorMessage = (error) => {
  const errorCode = error?.code || error?.type;
  
  const errorMessages = {
    'card_declined': 'Your card was declined. Please try a different payment method.',
    'insufficient_funds': 'Insufficient funds. Please try a different card or add funds.',
    'expired_card': 'Your card has expired. Please try a different card.',
    'incorrect_cvc': 'The security code (CVC) is incorrect. Please check and try again.',
    'processing_error': 'An error occurred while processing your payment. Please try again.',
    'invalid_request_error': 'Payment information is invalid. Please check your details.',
    'api_connection_error': 'Connection error. Please check your internet and try again.',
    'api_error': 'Payment service temporarily unavailable. Please try again later.',
    'authentication_error': 'Payment authentication failed. Please try again.',
    'rate_limit_error': 'Too many requests. Please wait a moment and try again.',
    'validation_error': 'Please check your payment information and try again.'
  };
  
  return errorMessages[errorCode] || 'An unexpected error occurred. Please try again or contact support.';
};

export default {
  formatPrice,
  aedToFils,
  filsToAed,
  validateUAEPhone,
  validateEmiratesId,
  validateEmail,
  validateCustomerInfo,
  validateBillingAddress,
  validateBillingAddressWithConfig,
  createOrderData,
  formatCustomerInfoForStripe,
  formatBillingAddressForStripe,
  calculateOrderTotals,
  generateOrderSummary,
  getPaymentErrorMessage,
  UAE_EMIRATES,
  UAE_CITIES
}; 