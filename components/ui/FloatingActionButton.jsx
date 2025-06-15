'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { MdMail } from 'react-icons/md';
import { RiWhatsappFill } from "react-icons/ri";
import { FaPhone, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

// Icon mapping object
const iconMap = {
  whatsapp: RiWhatsappFill,
  email: MdMail,
  mail: MdMail,
  phone: FaPhone,
  facebook: FaFacebook,
  twitter: FaTwitter,
  instagram: FaInstagram,
  linkedin: FaLinkedin,
};

const FloatingActionButton = ({ 
  icon, // Now accepts string instead of component
  href, 
  className = '', 
  iconClassName = '',
  bgColor = 'bg-primary',
  hoverBgColor = 'hover:bg-primary-600',
  textColor = 'text-white',
  size = 'w-14 h-14',
  iconSize = 'text-2xl',
  tooltip,
  position = 'bottom-6 right-6'
}) => {
  // Get the icon component from the mapping
  const IconComponent = iconMap[icon?.toLowerCase()] || iconMap.email;

  const handleClick = (e) => {
    // Ensure the link works properly
    if (href) {
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      className={`fixed ${position} z-50 group`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: 0.2 
      }}
    >
      {/* Tooltip */}
      {tooltip && (
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
            {tooltip}
            {/* Arrow */}
            <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
          </div>
        </div>
      )}
      
      {/* Main Button */}
      <motion.button
        onClick={handleClick}
        className={`
          ${size} ${bgColor} ${hoverBgColor} ${textColor}
          rounded-full shadow-lg hover:shadow-xl
          flex items-center justify-center
          transition-all duration-300 ease-in-out
          backdrop-blur-sm border border-white/10
          cursor-pointer relative overflow-hidden
          ${className}
        `}
        whileHover={{ 
          scale: 1.1,
          rotate: [0, -10, 10, -10, 0],
          transition: { 
            scale: { duration: 0.2 },
            rotate: { duration: 0.5 }
          }
        }}
        whileTap={{ scale: 0.95 }}
      >
        <IconComponent className={`${iconSize} ${iconClassName} relative z-10`} />
        
        {/* Ripple effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-white/20"
          initial={{ scale: 0, opacity: 0 }}
          whileHover={{
            scale: [0, 1.2, 1.4],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: "loop"
          }}
        />
      </motion.button>
      
      {/* Glow effect */}
      <div className={`
        absolute inset-0 rounded-full ${bgColor} opacity-20 blur-xl
        group-hover:opacity-40 transition-opacity duration-300 pointer-events-none
      `} />
    </motion.div>
  );
};

export default FloatingActionButton;