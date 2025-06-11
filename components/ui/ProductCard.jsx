import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import AddToCartButton from './AddToCartButton';

const ProductCard = ({ isService, product }) => {
  const {
    name,
    price,
    type,
    image,
    promotion,
    promotionStartDate,
    promotionEndDate,
    promotionalPrice,
    description,
    inStock,
    slug,
    category,
    subCategory
  } = product;

  // Check if promotion is active
  const isPromotionActive = () => {
    if (!promotion || !promotionStartDate || !promotionEndDate) return false;
    const now = new Date();
    const start = new Date(promotionStartDate);
    const end = new Date(promotionEndDate);
    return now >= start && now <= end;
  };

  const showPromotion = isPromotionActive();

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 relative group"
    >
      {/* Out of Stock Overlay */}
      {!inStock && (
        <div className="absolute inset-0 bg-gray-900/60 z-20 flex items-center justify-center">
          <span className="text-white font-medium text-lg">Out of Stock</span>
        </div>
      )}

      {/* Promotion Badge */}
      {showPromotion && (
        <div className="absolute top-4 right-4 bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
          {promotion}
        </div>
      )}

      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Content Container */}
      <div className="p-6 space-y-4">
        {/* Product Details */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-800 line-clamp-1">{name}</h3>
          <span className="inline-block bg-cream-100 text-primary-600 px-3 py-1 rounded-full text-sm font-medium">
            {type}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          {showPromotion && promotionalPrice ? (
            <>
              <span className="text-2xl font-bold text-primary-500">{promotionalPrice}</span>
              <span className="text-gray-400 line-through">{price}</span>
            </>
          ) : (
            <span className="text-2xl font-bold text-primary-500">{price}</span>
          )}
          <span className="text-gray-500">AED</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          {/* Add to Cart Button - Only for products and in-stock items */}
          {!isService && inStock && (
            <AddToCartButton product={product} />
          )}

          {/* See Details Button */}
          <a href={`${isService ? `/services/` : `/products/`}${category?.slug}/${slug}`}>
            <Button variant="outline" className="w-full">
              {isService ? 'View Service Details' : 'View Product Details'}
            </Button>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard; 