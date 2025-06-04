'use client'
import { motion } from 'framer-motion';
import { FiInstagram, FiFacebook, FiTwitter, FiYoutube } from 'react-icons/fi';
import { serviceTypes, productCategories } from '@/data/sampleData';
import Container from '../ui/Container'

const Footer = () => {
  const footerLinks = {
    services: serviceTypes.map(service => ({
      name: service.name,
      href: `/services/${service.name.toLowerCase().replace(' ', '-')}`
    })),
    products: productCategories.map(category => ({
      name: category.name,
      href: `/products/${category.name.toLowerCase()}`
    })),
    support: [
      { name: 'Terms of Service', href: '/terms-of-service' },
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Shipping Policy', href: '/shipping-policy' },
    ],
  };

  const socialLinks = [
    { icon: FiInstagram, href: '#' },
    { icon: FiFacebook, href: '#' },
    { icon: FiTwitter, href: '#' },
    { icon: FiYoutube, href: '#' },
  ];

  return (
    <footer className="bg-secondary-900 text-white pt-20 pb-10">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <img src="/logo.png" alt="PAWS" className="h-12 mb-6" />
            <p className="text-gray-400 mb-8 max-w-md">
              Providing luxury care and premium services for your beloved pets. Because they deserve nothing but the best.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="bg-white/10 p-3 rounded-full hover:bg-primary-500 transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links], index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <h3 className="text-lg font-semibold mb-6 capitalize">{title}</h3>
              <ul className="space-y-4">
                {links.map((link, linkIndex) => (
                  <motion.li
                    key={link.name}
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-primary-500 transition-colors"
                    >
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Section */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 pt-8 border-t border-white/10"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-gray-400">
                Stay updated with our latest services and pet care tips
              </p>
            </div>
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-primary-500 rounded-full font-medium hover:bg-primary-600 transition-colors"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div> */}

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center text-gray-400 text-sm border-t border-white/10 pt-8"
        >
          <p>© {new Date().getFullYear()} PAWS. All rights reserved.</p>
        </motion.div>
      </Container>
    </footer>
  );
};

export default Footer;