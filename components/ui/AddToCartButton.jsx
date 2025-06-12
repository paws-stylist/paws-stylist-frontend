import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaCheck, FaPlus, FaMinus, FaInfoCircle } from 'react-icons/fa';
import { useCart } from '../../contexts/CartContext';
import Button from './Button';

const AddToCartButton = ({ product, className = '', showQuantity = false, initialQuantity = 1 }) => {
  const { 
    addToCart, 
    isItemInCart, 
    getItemQuantity, 
    updateQuantity,
    getMaxQuantityForProduct,
    canAddMoreOfProduct,
    MAX_QUANTITY_LIMIT
  } = useCart();
  
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isAdding, setIsAdding] = useState(false);
  
  const isInCart = isItemInCart(product._id || product.id);
  const cartQuantity = getItemQuantity(product._id || product.id);
  const maxAllowed = getMaxQuantityForProduct(product._id || product.id);
  const canAddMore = canAddMoreOfProduct(product._id || product.id);
  
  // Calculate available stock and limits
  const stockQuantity = product.stockQuantity || product.quantity || 999;
  const displayMaxQuantity = Math.min(MAX_QUANTITY_LIMIT, stockQuantity);
  const isStockLimited = stockQuantity < MAX_QUANTITY_LIMIT;

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    try {
      const success = await addToCart(product, quantity);
      
      if (success) {
        // Brief animation delay only on success
        setTimeout(() => {
          setIsAdding(false);
        }, 1000);
      } else {
        setIsAdding(false);
      }
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      setIsAdding(false);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    
    // Limit quantity selection to maximum allowed
    const limitedQuantity = Math.min(newQuantity, displayMaxQuantity);
    setQuantity(limitedQuantity);
  };

  const handleUpdateCartQuantity = (newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(product._id || product.id, newQuantity);
  };

  // If showing quantity controls and item is in cart
  if (showQuantity && isInCart) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center space-x-3">
          <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
            <button
              onClick={() => handleUpdateCartQuantity(cartQuantity - 1)}
              className="p-2 hover:bg-gray-50 transition-colors font-bold text-gray-600"
              disabled={cartQuantity <= 1}
            >
              <FaMinus className="w-3 h-3" />
            </button>
            <span className="px-4 py-2 font-semibold bg-gray-50 border-x border-gray-200">
              {cartQuantity}
            </span>
            <button
              onClick={() => handleUpdateCartQuantity(cartQuantity + 1)}
              className="p-2 hover:bg-gray-50 transition-colors font-bold text-gray-600"
              disabled={cartQuantity >= maxAllowed}
            >
              <FaPlus className="w-3 h-3" />
            </button>
          </div>
          <span className="text-sm text-green-600 font-medium">In Cart</span>
        </div>
        
        {/* Quantity limit info */}
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <FaInfoCircle className="w-3 h-3" />
          <span>
            {cartQuantity}/{maxAllowed} - 
            {isStockLimited 
              ? ` Only ${stockQuantity} available in stock`
              : ` Max ${MAX_QUANTITY_LIMIT} per product`
            }
          </span>
        </div>
        
        {cartQuantity >= maxAllowed && (
          <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-2">
            <strong>Limit reached:</strong> You cannot add more of this item.
          </div>
        )}
      </div>
    );
  }

  // If item is in cart but not showing quantity controls
  if (isInCart && !showQuantity) {
    return (
      <div className={`space-y-2 ${className}`}>
        <Button variant="primary" className="bg-green-600 hover:bg-green-700 w-full" disabled>
          <FaCheck className="w-4 h-4 mr-2" />
          Added to Cart ({cartQuantity}/{maxAllowed})
        </Button>
        
        {cartQuantity >= maxAllowed && (
          <div className="text-xs text-amber-600 text-center">
            Maximum quantity reached
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Quantity selector for new items */}
      {showQuantity && (
        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-gray-900">Quantity:</span>
            <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="p-2 hover:bg-gray-50 transition-colors font-bold text-gray-600"
                disabled={quantity <= 1}
              >
                <FaMinus className="w-3 h-3" />
              </button>
              <span className="px-4 py-2 font-semibold bg-gray-50 border-x border-gray-200">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="p-2 hover:bg-gray-50 transition-colors font-bold text-gray-600"
                disabled={quantity >= displayMaxQuantity}
              >
                <FaPlus className="w-3 h-3" />
              </button>
            </div>
          </div>
          
          {/* Quantity limit info */}
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <FaInfoCircle className="w-3 h-3" />
            <span>
              Max {displayMaxQuantity} per order - 
              {isStockLimited 
                ? ` Only ${stockQuantity} available in stock`
                : ` Maximum ${MAX_QUANTITY_LIMIT} per product allowed`
              }
            </span>
          </div>
        </div>
      )}

      <Button
        variant="primary"
        onClick={handleAddToCart}
        disabled={isAdding || (isInCart && !canAddMore)}
        className="w-full justify-center"
      >
        {isAdding ? (
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            Adding...
          </motion.div>
        ) : isInCart && !canAddMore ? (
          <>
            <FaCheck className="w-4 h-4 mr-2" />
            Maximum Reached
          </>
        ) : (
          <>
            <FaShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
            {showQuantity && ` (${quantity})`}
          </>
        )}
      </Button>
      
      {/* Additional info for when item can't be added */}
      {isInCart && !canAddMore && (
        <div className="text-xs text-amber-600 text-center mt-2">
          You already have the maximum allowed quantity in your cart
        </div>
      )}
    </div>
  );
};

export default AddToCartButton; 