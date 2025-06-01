import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

const Select = ({ 
  options, 
  value, 
  onChange, 
  placeholder = 'Select an option',
  className = '',
  containerClassName = '',
  optionClassName = '',
  chevronClassName = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  const selectedOption = options.find(option => option.value === value) || options[0];

  return (
    <div ref={selectRef} className={`relative ${containerClassName}`}>
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between w-full px-6 py-4
          bg-cream-50 rounded-xl cursor-pointer
          border-2 border-cream-200 hover:border-primary/30
          transition-all duration-300
          ${className}
        `}
      >
        <span className="text-xl font-medium text-gray-800">
          {selectedOption.label || placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={`text-primary ${chevronClassName}`}
        >
          <FaChevronDown />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border-2 border-cream-100 overflow-hidden"
          >
            {options.map((option, index) => (
              <motion.div
                key={option.value}
                whileHover={{ backgroundColor: 'rgba(229, 137, 4, 0.05)' }}
                className={`
                  px-6 py-3 cursor-pointer text-gray-700
                  transition-colors duration-200
                  ${value === option.value ? 'bg-primary/5 text-primary font-medium' : ''}
                  ${optionClassName}
                `}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Select; 