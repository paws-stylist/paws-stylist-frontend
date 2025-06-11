import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaCheck, FaPlus, FaMinus } from 'react-icons/fa';
import { useCart } from '../../contexts/CartContext';
import Button from './Button';

const AddToCartButton = ({ product, className = '', showQuantity = false, initialQuantity = 1 }) => {
  const { addToCart, isItemInCart, getItemQuantity, updateQuantity } = useCart();
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isAdding, setIsAdding] = useState(false);
  
  const isInCart = isItemInCart(product._id || product.id);
  const cartQuantity = getItemQuantity(product._id || product.id);

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    try {
      await addToCart(product, quantity);
      
      // Brief animation delay
      setTimeout(() => {
        setIsAdding(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      setIsAdding(false);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
  };

  const handleUpdateCartQuantity = (newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(product._id || product.id, newQuantity);
  };

  // If showing quantity controls and item is in cart
  if (showQuantity && isInCart) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
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
          >
            <FaPlus className="w-3 h-3" />
          </button>
        </div>
        <span className="text-sm text-green-600 font-medium">In Cart</span>
      </div>
    );
  }

  // If item is in cart but not showing quantity controls
  if (isInCart && !showQuantity) {
    return (
      <Button variant="primary" className={`${className} bg-green-600 hover:bg-green-700`} disabled>
        <FaCheck className="w-4 h-4 mr-2" />
        Added to Cart
      </Button>
    );
  }

  return (
    <div className={className}>
      {/* Quantity selector for new items */}
      {showQuantity && (
        <div className="flex items-center space-x-3 mb-3">
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
            >
              <FaPlus className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      <Button
        variant="primary"
        onClick={handleAddToCart}
        disabled={isAdding}
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
        ) : (
          <>
            <FaShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </>
        )}
      </Button>
    </div>
  );
};

export default AddToCartButton; 