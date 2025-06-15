"use client";
import Link from "next/link";
import { FiX, FiChevronDown, FiChevronRight } from "react-icons/fi";
import { MdEmail, MdBusiness } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import NavCartButton from "../ui/NavCartButton";

export default function NavSidebar({ isOpen, onClose, navData = [], isLoading = false, onOpenCart }) {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpanded = (itemName) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 left-0 bottom-0 w-full max-w-sm bg-gray-50 z-50 overflow-y-auto"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <Link href="/" onClick={onClose}>
                  <img src="/logo.png" alt="PAWS" className="h-14" />
                </Link>
                <div className="flex items-center space-x-2">
                  {/* Cart Button for Mobile */}
                  {onOpenCart && (
                    <div className="bg-gray-800 rounded-lg">
                      <NavCartButton 
                        onOpenCart={() => {
                          onOpenCart();
                          onClose();
                        }}
                        className="text-white hover:text-primary"
                      />
                    </div>
                  )}
                  <button
                    onClick={onClose}
                    className="text-gray-800 hover:text-primary transition-colors"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 p-6">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="text-gray-600">Loading navigation...</div>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {navData.map((item, index) => (
                      <li key={index}>
                        {item.isDropdown ? (
                          <div>
                            {/* Main item with toggle */}
                            <div 
                              className="flex items-center justify-between text-xl font-light text-gray-800 hover:text-primary transition-colors cursor-pointer py-2"
                              onClick={() => toggleExpanded(item.name)}
                            >
                              <span>{item.name}</span>
                              <motion.div
                                animate={{ rotate: expandedItems[item.name] ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <FiChevronRight className="w-4 h-4" />
                              </motion.div>
                            </div>

                            {/* Dropdown items */}
                            <AnimatePresence>
                              {expandedItems[item.name] && item.dropdownItems && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <ul className="ml-4 mt-2 space-y-2 border-l-2 border-gray-200">
                                    {item.dropdownItems.map((dropdownItem, dropdownIdx) => (
                                      <li key={dropdownIdx}>
                                        <Link
                                          href={dropdownItem.url}
                                          className="block pl-4 py-2 text-lg text-gray-600 hover:text-primary transition-colors"
                                          onClick={onClose}
                                        >
                                          {dropdownItem.name}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ) : (
                          <Link
                            href={item.url || '#'}
                            className="block text-xl font-light text-gray-800 hover:text-primary transition-colors py-2"
                            onClick={onClose}
                          >
                            {item.name}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </nav>

              {/* Footer - Contact Info */}
              <div className="p-6 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MdBusiness className="w-5 h-5 text-gray-800 flex-shrink-0" />
                    <span className="text-sm font-semibold text-gray-800 leading-tight">
                      PAWS STYLIST DOMESTIC PETS GROOMING LLC
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MdEmail className="w-5 h-5 text-gray-800 flex-shrink-0" />
                    <a 
                      href="mailto:info@pawsstylist.com" 
                      className="text-sm text-gray-600 hover:text-primary transition-colors"
                    >
                      info@pawsstylist.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}