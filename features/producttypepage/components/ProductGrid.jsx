import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ui/ProductCard';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const ProductGrid = ({ products, isService = false }) => {
  if (!products || products.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">No {isService ? 'services' : 'products'} available</div>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8 lg:px-32 md:px-16 px-4"
    >
      {products.map((product) => {
        // Map API data to ProductCard expected format
        const mappedProduct = isService ? {
          id: product._id,
          name: product.serviceName,
          price: product.servicePrice,
          promotionalPrice: null, // No promotionalPrice in new structure
          type: product.serviceType,
          image: product.serviceImages?.[0] || "/shop-beds.webp",
          promotion: product.promotion?.isActive ? "Special Offer" : null,
          promotionStartDate: null,
          promotionEndDate: null,
          description: product.serviceDetail,
          inStock: product.isActive,
          rating: 4.8, // Default rating since not in API
          isService: true,
          slug: product.slug,
          category: product.serviceCategory
        } : {
          id: product._id,
          name: product.productDetail,
          price: product.salePrice,
          promotionalPrice: product.promotion?.price || null,
          type: product.productType,
          image: product.images?.[0] || "/shop-beds.webp",
          promotion: product.promotion ? "Special Offer" : null,
          promotionStartDate: product.promotion?.startDate,
          promotionEndDate: product.promotion?.endDate,
          description: product.productDetail,
          inStock: true, // Assuming all products are in stock
          rating: 4.8, // Default rating since not in API
          brand: product.brand,
          category: product.category,
          productCode: product.productCode,
          isService: false,
          slug: product.slug,
          subCategory: product.subCategory
        };

        return (
          <motion.div key={product._id} variants={item}>
            <ProductCard isService={isService} product={mappedProduct} />
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default ProductGrid; 