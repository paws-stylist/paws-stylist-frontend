import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GiShoppingCart } from 'react-icons/gi';
import { useCart } from '../../contexts/CartContext';

const NavCartButton = ({ onOpenCart, className = '' }) => {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <motion.button
      onClick={onOpenCart}
      className={`relative text-cream-50 hover:text-primary transition-all duration-300 p-2 hover:bg-white/10 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <GiShoppingCart className="w-10 h-10 text-primary" />
      
      {/* Item count badge */}
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center min-w-[20px] shadow-md"
          >
            {itemCount > 99 ? '99+' : itemCount}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Pulse animation for new items (only when items exist) */}
      {itemCount > 0 && (
        <motion.div
          className="absolute inset-0 bg-primary-500 rounded-lg opacity-0 pointer-events-none"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0, 0.2, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop"
          }}
        />
      )}
    </motion.button>
  );
};

export default NavCartButton; 