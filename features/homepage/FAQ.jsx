import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '@/components/ui/Container';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { MdEmail, MdPhone, MdAccessTime } from 'react-icons/md';
import Link from 'next/link';

const faqs = [
  {
    id: 1,
    question: 'What luxury services do you offer for pets?',
    answer: 'We offer a wide range of premium services including spa grooming, luxury boarding, professional training, and specialized pet care. Each service is tailored to meet the unique needs of your pet with the highest standards of care and comfort.',
  },
  {
    id: 2,
    question: 'How often should I schedule grooming services?',
    answer: 'The frequency of grooming depends on your pet\'s breed, coat type, and lifestyle. Generally, we recommend professional grooming every 4-8 weeks for optimal maintenance. Our team can create a personalized grooming schedule for your pet.',
  },
  {
    id: 3,
    question: 'What makes your pet hotel different from others?',
    answer: 'Our pet hotel offers premium accommodations with private suites, 24/7 care, gourmet meals, and daily activities. We focus on creating a stress-free, luxurious environment where your pets can feel at home while you\'re away.',
  },
];

const ContactInfo = () => (
  <div className="">
    <h2 className="text-3xl font-bold text-secondary-900 mb-4">NEED HELP?</h2>
    <p className="text-lg text-cream-100 mb-8">
      Contact us and we will assist!
    </p>
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <MdEmail className="text-2xl text-accent" />
        <Link href="mailto:info@pawsstylist.com">
          <p className="text-sm text-cream-100">EMAIL</p>
          <p className="text-lg font-semibold text-secondary-900">info@pawsstylist.com</p>
        </Link>
      </div>
      {/* <div className="flex items-center space-x-4">
        <MdPhone className="text-2xl text-accent" />
        <Link href="tel:+">
          <p className="text-sm text-cream-100">MOBILE</p>
          <p className="text-lg font-semibold text-secondary-900">9876542123</p>
        </Link>
      </div> */}
      <div className="flex items-center space-x-4">
        <MdAccessTime className="text-2xl text-accent" />
        <div>
          <p className="text-sm text-cream-100">AVERAGE RESPONSE TIME</p>
          <p className="text-lg font-semibold text-secondary-900">15 MINUTES</p>
        </div>
      </div>
    </div>
  </div>
);

const FAQ = () => {
  const [activeId, setActiveId] = useState(null);

  return (
    <section className="py-16 mb-12 bg-secondary lg:mx-64 md:mx-32 mx-0 rounded-2xl">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 ">
          <ContactInfo />
          
          <div>
            <h2 className="text-3xl font-bold text-secondary-900 mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <button
                    onClick={() => setActiveId(activeId === faq.id ? null : faq.id)}
                    className="w-full text-left p-5 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-cream-200"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-secondary-900">
                        {faq.question}
                      </h3>
                      <div className="text-primary-500 ml-4">
                        {activeId === faq.id ? (
                          <AiOutlineMinus className="w-5 h-5" />
                        ) : (
                          <AiOutlinePlus className="w-5 h-5" />
                        )}
                      </div>
                    </div>

                    <AnimatePresence>
                      {activeId === faq.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="mt-4 text-secondary text-base">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FAQ; 