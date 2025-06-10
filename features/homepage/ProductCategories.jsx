import { motion } from 'framer-motion';
import Container from '@/components/ui/Container';
import Link from 'next/link';

const categories = [
  {
    id: 1,
    name: 'Food',
    image: '/category/food.png',
  },
  {
    id: 2,
    name: 'Toys',
    image: '/category/toys.png',
  },
  {
    id: 3,
    name: 'Accessories',
    image: '/category/accessories.png',
  },
  {
    id: 4,
    name: 'Grooming',
    image: '/category/grooming.png',
  },
  {
    id: 5,
    name: 'Supplements',
    image: '/category/supplement.png',
  }
];

const ProductCategories = () => {
  return (
    <section className="py-16 lg:px-32 md:px-16 px-2 bg-white">
      <Container>
        <div className="flex flex-wrap items-center justify-center gap-8 space-y-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ scale: 1.05 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group cursor-pointer"
              onClick={() => handleCategoryClick(category.name)}
            >
              <Link href={`/products/${category.name.toLowerCase()}`} className="relative pt-[30%]">
                {/* Image Container */}
                <div className="absolute -top-14 right-2 md:w-[90%] w-[80%] aspect-square z-20">
                  <motion.img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover rounded-2xl"
                    transition={{ duration: 0.3 }}
                  />
                </div>
                
                {/* Box Container */}
                <div className="bg-brown rounded-2xl md:h-[300px] h-[150px] aspect-square relative z-10">
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-3xl font-bold text-cream-50 uppercase">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default ProductCategories;