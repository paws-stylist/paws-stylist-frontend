import React, { useState } from 'react';
import Slider from 'react-slick';
import { motion } from 'framer-motion';
import { FaLongArrowAltRight, FaLongArrowAltLeft } from "react-icons/fa";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const NextArrow = ({ onClick }) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className="absolute -bottom-12 right-1/2 translate-x-6 z-10 w-8 h-8 bg-white/80 border border-primary/20 backdrop-blur-sm rounded-full flex items-center justify-center text-primary shadow-lg hover:bg-white/90 transition-all duration-300"
    onClick={onClick}
  >
    <FaLongArrowAltRight className="w-4 h-4" />
  </motion.button>
);

const PrevArrow = ({ onClick }) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className="absolute -bottom-12 left-1/2 -translate-x-6 z-10 w-8 h-8 bg-white/80 border border-primary/20 backdrop-blur-sm rounded-full flex items-center justify-center text-primary shadow-lg hover:bg-white/90 transition-all duration-300"
    onClick={onClick}
  >
    <FaLongArrowAltLeft className="w-4 h-4" />
  </motion.button>
);

const ImageSlider = ({ 
  images,
  mainImageClassName = '',
  thumbnailClassName = '',
  containerClassName = '',
  showThumbnails = true,
}) => {
  const [mainSlider, setMainSlider] = useState(null);
  const [thumbnailSlider, setThumbnailSlider] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const mainSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    arrows: false,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (current, next) => setSelectedIndex(next),
    asNavFor: thumbnailSlider,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  const thumbnailSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    focusOnSelect: true,
    arrows: false,
    asNavFor: mainSlider,
    centerMode: false,
    swipeToSlide: true,
  };

  return (
    <div className={`relative flex items-center h-full ${containerClassName}`}>
      {/* Main Image */}
      <div className="relative w-[90%] h-full">
        <div className="h-full">
          <Slider
            ref={slider => setMainSlider(slider)}
            {...mainSettings}
            className="h-full"
          >
            {images.map((image, index) => (
              <div key={index} className="relative h-full">
                <img
                  src={image}
                  alt={`Slide ${index + 1}`}
                  className={`${mainImageClassName} object-cover w-full h-full`}
                  // priority={index === 0}
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* Thumbnails */}
      {showThumbnails && images.length > 1 && (
        <div className="absolute -right-0 top-1/2 -translate-y-1/2 h-64 w-32 overflow-hidden">
          <Slider
            ref={slider => setThumbnailSlider(slider)}
            {...thumbnailSettings}
            className={`h-full ${thumbnailClassName}`}
          >
            {images.map((image, index) => (
              <motion.div
                key={index}
                className="px-1 py-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div
                  className={`
                    relative h-20 rounded-lg overflow-hidden cursor-pointer
                    ${selectedIndex === index 
                      ? 'ring-2 ring-primary shadow-lg scale-95 border-2 border-white' 
                      : 'ring-1 ring-white/50 opacity-70 hover:opacity-100'
                    }
                  `}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                  <div 
                    className={`absolute inset-0 transition-colors duration-300
                      ${selectedIndex === index 
                        ? 'bg-primary/10' 
                        : 'bg-black/20 hover:bg-primary/10'
                      }
                    `}
                  />
                </div>
              </motion.div>
            ))}
          </Slider>
        </div>
      )}

      {/* Decorative Elements */}
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[80%] h-12 bg-primary/5 rounded-[30px] blur-xl" />
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-[60%] h-8 bg-primary/5 rounded-[30px] blur-lg" />
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-[70%] bg-gradient-to-b from-transparent via-primary/20 to-transparent rounded-full" />
    </div>
  );
};

export default ImageSlider; 