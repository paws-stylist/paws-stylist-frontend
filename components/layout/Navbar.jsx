"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FiSearch, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { MdMailOutline, MdEmail, MdBusiness } from "react-icons/md";
import Container from '@/components/ui/Container';
import NavSidebar from "./NavSidebar";
import SearchBar from "./SearchBar";
import { navbarData } from "@/utils/constants";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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

  return (
    <>
      <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <header 
        className={`fixed w-full lg:px-32 md:px-16 px-4 z-40 transition-all duration-500 ${
          isScrollingUp ? 'translate-y-0' : '-translate-y-full'
        } ${scrolled ? 'bg-gray-900/20 backdrop-blur-md' : 'bg-transparent'}`}
      >
        {/* Top Bar */}
        <Container>
          <div className="flex items-center justify-between h-20">
            {/* Left Side - Menu/Contact Info */}
            <div className="flex items-center">
              <button 
                className="md:hidden text-cream-50 hover:text-primary transition-colors"
                onClick={toggleMenu}
              >
                <FiMenu className="w-6 h-6" />
              </button>
              <div className="hidden md:flex flex-col items-start space-x4 text-cream-50">
                <div className="flex items-center space-x-2">
                  <MdBusiness className="w-4 h-4 text-cream-50 hover:text-primary transition-colors" />
                  <span className="text-xs font-medium">PAWS STYLIST DOMESTIC PETS GROOMING LLC</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MdEmail className="w-4 h-4 text-cream-50 hover:text-primary transition-colors" />
                  <a 
                    href="mailto:info@pawsstylist.com" 
                    className="text-xs hover:text-primary transition-colors"
                  >
                    info@pawsstylist.com
                  </a>
                </div>
              </div>
            </div>

            {/* Center - Logo */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <img src="/logo.png" alt="PAWS" className="h-12" />
            </Link>

            {/* Right Side - Search */}
            <button 
              className="text-cream-50 hover:text-primary transition-colors"
              onClick={toggleSearch}
            >
              <FiSearch className="w-6 h-6" />
            </button>
          </div>
        </Container>

        {/* Navigation Links */}
        <nav className="hidden md:block border-t border-white/10">
          <Container>
            <ul className="flex justify-center space-x-8 py-4">
              {navbarData.map((item, idx) => (
                <li key={idx}>
                  <Link 
                    href={item.url}
                    className="text-sm font-medium text-cream-50 hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </nav>
      </header>

      {/* Mobile Sidebar */}
      <NavSidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
};

export default Navbar;
