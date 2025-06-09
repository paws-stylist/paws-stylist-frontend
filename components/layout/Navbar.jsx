"use client";
import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { FiSearch, FiMenu, FiChevronDown } from 'react-icons/fi';
import { MdEmail, MdBusiness } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import Container from '@/components/ui/Container';
import NavSidebar from "./NavSidebar";
import SearchBar from "./SearchBar";
import { useGet } from "@/hooks/useApi";
import Button from "../ui/Button";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Fetch data from backend
  const { data: serviceCategories, loading: servicesLoading } = useGet('/service-categories/active', { 
    immediate: true, 
    showErrorToast: false 
  });
  
  const { data: productCategories, loading: productCategoriesLoading } = useGet('/product-categories/active', { 
    immediate: true, 
    showErrorToast: false 
  });

  // Build navigation data dynamically
  const navbarData = useMemo(() => {
    const baseNavigation = [
      {
        name: "Home",
        url: "/",
        desc: "All about PAWS",
      }
    ];

    // Add Services with dropdown
    if (serviceCategories && serviceCategories.length > 0) {
      baseNavigation.push({
        name: "Services",
        url: "/services",
        desc: "Pet grooming and care services",
        isDropdown: true,
        dropdownItems: serviceCategories.map(service => ({
          name: service.title,
          url: `/services/${service.slug}`,
          desc: service.description || `${service.title} services for your pet`,
          image: service.image,
        })),
      });
    }

    // Add Product Categories with subcategories
    if (productCategories && productCategories.length > 0) {
      productCategories.forEach(category => {
        // Handle subcategories - they can be a single object or an array
        let subcategories = [];
        if (category.subCategory) {
          if (Array.isArray(category.subCategory)) {
            subcategories = category.subCategory.filter(sub => sub && sub.isActive !== false);
          } else if (typeof category.subCategory === 'object' && category.subCategory.name) {
            // Single subcategory object
            if (category.subCategory.isActive !== false) {
              subcategories = [category.subCategory];
            }
          }
        }
        
        const hasSubcategories = subcategories.length > 0;
        
        baseNavigation.push({
          name: category.title,
          url: `/products/${category.slug}`,
          desc: category.description || `${category.title} products for your pet`,
          isDropdown: hasSubcategories,
          dropdownItems: hasSubcategories ? subcategories.map(subCategory => ({
            name: subCategory.name,
            url: `/products/${category.slug}?${subCategory.slug}`,
            desc: subCategory.description || `${subCategory.name} in ${category.title}`,
          })) : [],
        });
      });
    }

    return baseNavigation;
  }, [serviceCategories, productCategories]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrollingUp(currentScrollY < lastScrollY || currentScrollY <= 0);
      setLastScrollY(currentScrollY);
      setScrolled(currentScrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (menuOpen) setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (searchOpen) setSearchOpen(false);
  };

  const handleDropdownEnter = (itemName) => {
    setActiveDropdown(itemName);
  };

  const handleDropdownLeave = () => {
    setActiveDropdown(null);
  };

  // Show loading state while fetching navigation data
  const isLoading = servicesLoading || productCategoriesLoading;

  return (
    <>
      {/* <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} /> */}
      <header 
        className={`fixed w-full lg:px-32 md:px-16 px-4 z-40 transition-all duration-500 ${
          isScrollingUp ? 'translate-y-0' : '-translate-y-full'
        } ${scrolled ? 'bg-gray-900/20 backdrop-blur-md' : 'bg-transparent'}`}
      >
        {/* Top Bar */}
        <Container>
          <div className="flex items-center justify-between h-20">
            {/* Left Side - Menu/Contact Info */}
            <div className="flex items-center gap-4">
              <button 
                className="md:hidden text-cream-50 hover:text-primary transition-colors"
                onClick={toggleMenu}
              >
                <FiMenu className="w-6 h-6" />
              </button>
              <Link href="/" className="md:flex hidden">
                <img src="/logo.png" alt="PAWS" className="h-12" />
              </Link>
              <div className="hidden md:flex flex-col items-start space-x4 text-cream-50">
                <div className="flex items-center space-x-2">
                  <MdBusiness className="w-4 h-4 text-cream-50 hover:text-primary transition-colors" />
                  <span className="text-base font-medium">PAWS STYLIST DOMESTIC PETS GROOMING LLC</span>
                </div>
                {/* <div className="flex items-center space-x-2">
                  <MdBusiness className="w-4 h-4 text-cream-50 hover:text-primary transition-colors" />
                  <span className="text-xs font-medium"> بوس  ستيلسة  دمستك  بطس  غرومينج  لك </span>
                </div> */}
                <div className="flex items-center space-x-2">
                  <MdEmail className="w-4 h-4 text-cream-50 hover:text-primary transition-colors" />
                  <a 
                    href="mailto:info@pawsstylist.com" 
                    className="text-base hover:text-primary transition-colors"
                  >
                    info@pawsstylist.com
                  </a>
                </div>
              </div>
            </div>

            {/* Center - Logo */}
            {/* <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <img src="/logo.png" alt="PAWS" className="h-12" />
            </Link> */}

            {/* Right Side - Search */}
            <a href="/services">
              <Button 
                variant="primary"
              >
                Book Appointment
              </Button>
            </a>
          </div>
        </Container>

        {/* Navigation Links */}
        <nav className="hidden md:block border-t border-white/10">
          <Container>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="text-cream-50 text-sm">Loading navigation...</div>
              </div>
            ) : (
              <ul className="flex justify-center space-x-8 py-4">
                {navbarData.map((item, idx) => (
                  <li 
                    key={idx}
                    className="relative"
                    onMouseEnter={() => item.isDropdown && handleDropdownEnter(item.name)}
                    onMouseLeave={() => item.isDropdown && handleDropdownLeave()}
                  >
                    <div className="flex items-center space-x-1">
                      <Link 
                        href={item.url}
                        className="text-sm font-medium text-cream-50 hover:text-primary transition-colors"
                      >
                        {item.name}
                      </Link>
                      {item.isDropdown && (
                        <FiChevronDown className="w-3 h-3 text-cream-50" />
                      )}
                    </div>

                    {/* Dropdown Menu */}
                    {item.isDropdown && (
                      <AnimatePresence>
                        {activeDropdown === item.name && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden min-w-48 z-50"
                          >
                            {item.dropdownItems?.map((dropdownItem, dropdownIdx) => (
                              <Link
                                key={dropdownIdx}
                                href={dropdownItem.url}
                                className="block px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors border-b border-gray-50 last:border-b-0"
                              >
                                {dropdownItem.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Container>
        </nav>
      </header>
      {/* Mobile Sidebar */}
      <NavSidebar 
        isOpen={menuOpen} 
        onClose={() => setMenuOpen(false)} 
        navData={navbarData}
        isLoading={isLoading}
      />
    </>
  );
};

export default Navbar;
