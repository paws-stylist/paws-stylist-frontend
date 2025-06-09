import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import { IoLocationOutline } from 'react-icons/io5';
import Container from '@/components/ui/Container';

const reviews = [
  {
    id: 1,
    name: 'Alia',
    location: 'Dubai',
    image: '/client/1.jpg',
    petImage: '/client/1.jpg',
    rating: 5,
    review: 'The luxury pet grooming service exceeded all expectations. My furry friend was treated like royalty! The attention to detail and care provided was outstanding.',
  },
  {
    id: 2,
    name: 'Sana',
    location: 'Sharjah',
    image: '/client/2.jpg',
    petImage: '/client/2.jpg',
    rating: 5,
    review: 'Outstanding pet hotel service. The facilities are top-notch and the staff is incredibly attentive. My pet feels at home every time.',
  },
  {
    id: 3,
    name: 'Sarah Williams',
    location: 'Sharjah',
    image: '/client/3.jpg',
    petImage: '/client/3.jpg',
    rating: 5,
    review: 'The training program transformed my dog\'s behavior. The trainers are true professionals! Couldn\'t be happier with the results.',
  },
  {
    id: 4,
    name: 'James Anderson',
    location: 'Dubai',
    image: '/client/4.jpg',
    petImage: '/client/4.jpg',
    rating: 5,
    review: 'Exceptional service and attention to detail. My pet comes back happy and refreshed every time. The best pet care service in the city!',
  },
];

const ReviewCard = ({ review, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-secondary rounded-2xl overflow-hidden shadow-lg"
    >
      <div className="flex flex-col md:flex-row h-full">
        {/* Image Section */}
        <div className="md:w-2/5 relative h-64 md:h-auto">
          <img
            src={review.image}
            alt={review.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 bg-cream-50 rounded-full p-1">
            <img
              src={review.petImage}
              alt="Pet"
              className="w-16 h-16 rounded-full object-cover border-4 border-primary-100"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-between">
          <div>
            {/* Rating */}
            <div className="flex gap-1 mb-4">
              {[...Array(review.rating)].map((_, i) => (
                <FaStar key={i} className="text-accent w-5 h-5" />
              ))}
            </div>

            {/* Review Text */}
            <p className="text-cream-100 mb-6 font-medium italic">
              "{review.review}"
            </p>
          </div>

          {/* Name and Location */}
          <div>
            <h3 className="text-xl font-bold text-cream-200 mb-2">
              {review.name}
            </h3>
            <div className="flex items-center text-cream-100">
              <IoLocationOutline className="w-5 h-5 mr-1" />
              <span>{review.location}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Reviews = () => {
  return (
    <section className="py-20 bg-cream-50 lg:px-32 md:px-16 px-4">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-secondary-900 mb-4">
            What Our Clients Say
          </h2>
          {/* <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Hear from our satisfied customers about their luxury pet care experience
          </p> */}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((review, index) => (
            <ReviewCard key={review.id} review={review} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Reviews; 