import React from 'react';
import { motion } from 'framer-motion';
import { BsArrowRight } from 'react-icons/bs';
import { FaPaw } from "react-icons/fa";
import { useGet } from '../../hooks/useApi';

const featuredShops = [
    {
        id: 1,
        name: "Grooming",
        image: "/shops/grooming.webp",
        link: "/services/grooming"
    },
    {
        id: 2,
        name: "Medical",
        image: "/shops/medical.webp",
        link: "/services/medical"
    },
    {
        id: 3,
        name: "Day Care",
        image: "/shops/daycare.webp",
        link: "/services/daycare"
    }
]

const Shop = () => {
  // Fetch products from API
  const { data: allProducts, loading, error } = useGet('/products');

  // Get the newest toy product
  const toyProduct = allProducts 
    ? allProducts
        .filter(product => product.category.title.toLowerCase().includes('toy'))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
    : null;

  // Shop content - use toy product data if available, otherwise fallback
  const shopContent = toyProduct ? {
    title: "For Lovers of Cats & Decor",
    description: toyProduct.productDetail || "Every piece in our collection of luxury cat towers, beds, and caves is a work of art - it's supposed to make you feel happy every time you pass by it.",
    buttonText: "Shop Now",
    image: toyProduct.images?.[0] || "/shop-cats.webp",
    link: `/products/${toyProduct.category.slug}/${toyProduct.slug}`
  } : {
    title: "For Lovers of Cats & Decor",
    description: "Every piece in our collection of luxury cat towers, beds, and caves is a work of art - it's supposed to make you feel happy every time you pass by it.",
    buttonText: "Shop Now",
    image: "/shop-cats.webp",
    link: "/products/accessories"
  };

  return (
    <section className="relative px-4 md:px-8 overflow-hidden space-y-12">
      <div className="container mx-auto">
        <div className="relative max-w-7xl mx-auto">
          {/* Image Container - Left Side */}
          <motion.div 
            className="relative w-full md:w-[60%] h-[400px] md:h-[600px]"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <img
              src={shopContent.image}
              alt="Luxury Cat Decor"
              className="object-cover rounded-2xl shadow-xl h-full w-full"
            />
            {/* Decorative Elements */}
            <motion.div 
              className="absolute -bottom-8 left-8 text-primary-500/20 text-6xl"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, -10, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <FaPaw />
            </motion.div>
            <motion.div 
              className="absolute -top-6 right-12 text-accent-500/20 text-4xl"
              animate={{ 
                y: [0, -8, 0],
                rotate: [10, 0, 10]
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            >
              <FaPaw />
            </motion.div>
          </motion.div>

          {/* Content Box - Right Side Overlapping */}
          <motion.div 
            className="absolute md:top-1/3 top-[80%] right-0 transform -translate-y-1/2 w-[90%] md:w-[45%] bg-white/90 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl"
            initial={{ opacity: 0, x: 50, y: 0 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <div className="relative">
              {/* Decorative Element */}
              <motion.div 
                className="absolute -top-4 -right-4 w-20 h-20 bg-accent-500/10 rounded-full"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 45, 0]
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              <motion.h2 
                className="text-2xl md:text-3xl lg:text-4xl font-semibold text-brown mb-4 md:mb-6 relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {shopContent.title}
              </motion.h2>
              
              <motion.p 
                className="text-base md:text-lg text-brown/70 mb-6 md:mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {shopContent.description}
              </motion.p>
              
              <motion.a 
                href={shopContent.link}
                className="inline-flex items-center text-base md:text-lg text-primary-500 hover:text-primary-600 transition-colors group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {shopContent.buttonText}
                <BsArrowRight className="ml-2 text-xl transition-transform group-hover:translate-x-2" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Featured Shops Section */}
      <motion.div 
        className='container flex flex-col items-center md:pt-0 pt-36'
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2 
          className="text-3xl md:text-4xl font-semibold text-center text-brown mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          FEATURED SERVICES
        </motion.h2>
        <div className='flex flex-wrap md:gap-8 gap-4 items-center justify-center'>
          {featuredShops.map((shop, index) => (
            <motion.a 
              href={shop.link}
              key={shop.id} 
              className='group flex flex-col items-center cursor-pointer md:ml-10'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="relative overflow-hidden rounded-full h-40 w-40 shadow-lg">
                <img
                  src={shop.image} 
                  alt={shop.name} 
                  className='object-cover h-full w-full transition-transform duration-300 group-hover:scale-110' 
                />
              </div>
              <motion.h3 
                className='text-lg font-semibold mt-3 text-brown'
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
              >
                {shop.name}
              </motion.h3>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Shop; 