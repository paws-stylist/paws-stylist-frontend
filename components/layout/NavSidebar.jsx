"use client";
import { navbarData } from "@/utils/constants";
import Link from "next/link";
import { FiX } from "react-icons/fi";
import { MdEmail, MdBusiness } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

export default function NavSidebar({ isOpen, onClose }) {
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
                  <img src="/logo.png" alt="PAWS" className="h-10" />
                </Link>
                <button
                  onClick={onClose}
                  className="text-gray-800 hover:text-primary transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 p-6">
                <ul className="space-y-6">
                  {navbarData.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.url || '#'}
                        className="block text-xl font-light text-gray-800 hover:text-primary transition-colors"
                        onClick={onClose}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
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