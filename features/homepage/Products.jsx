import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import { MdRestaurantMenu, MdPets, MdKingBed } from "react-icons/md";
import Link from "next/link";

const categories = [
  {
    id: 1,
    name: "Shop Accessories",
    image: "/shop-accessories.webp",
    icon: MdRestaurantMenu,
    link: "/products/accessories",
  },
  {
    id: 2,
    name: "Shop Food",
    image: "/shop-food.webp",
    icon: MdPets,
    link: "/products/food",
  },
  {
    id: 3,
    name: "Shop Toys",
    image: "/shop-toys.webp",
    icon: MdKingBed,
    link: "/products/toys",
  },
];

const Categories = () => {
  return (
    <section className="py-8">
      <Container>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-brown mb-8 md:mb-12">
            BROWSE COLLECTION
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={category.link}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0"
                    >
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                  </div>

                  <div className="absolute top-4 right-4">
                    <div className="backdrop-blur-md p-3 rounded-full shadow-lg transform -rotate-12 group-hover:rotate-0 transition-all duration-300">
                      <category.icon className="w-6 h-6 text-accent" />
                    </div>
                  </div>

                  <div className="p-6 backdrop-blur-md absolute bottom-0 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-xl font-bold text-accent text-center">
                      {category.name}
                    </h3>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Categories;
