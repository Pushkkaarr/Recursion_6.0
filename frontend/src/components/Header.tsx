
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Search, BookOpen, Home, Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // Close mobile menu when path changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-3 bg-white/80 backdrop-blur-lg shadow-sm' : 'py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary/10 p-1.5 rounded-full">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <span className="font-semibold text-lg">CourseHub</span>
          </Link>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-1">
              <Link 
                to="/" 
                className={`nav-item ${isActive('/') ? 'bg-secondary text-primary' : ''}`}
              >
                <div className="flex items-center space-x-2">
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </div>
              </Link>
              
              <Link 
                to="/browse" 
                className={`nav-item ${isActive('/browse') ? 'bg-secondary text-primary' : ''}`}
              >
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Browse</span>
                </div>
              </Link>
              
              <Link 
                to="/search" 
                className={`nav-item ${isActive('/search') ? 'bg-secondary text-primary' : ''}`}
              >
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </div>
              </Link>
            </nav>
          )}
          
          {/* Mobile Menu Button */}
          {isMobile && (
            <button 
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}
        </div>
        
        {/* Mobile Menu */}
        {isMobile && mobileMenuOpen && (
          <nav className="mt-4 py-4 border-t border-gray-200 animate-slide-down">
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/"
                  className={`block px-3 py-2 rounded-md ${
                    isActive('/') ? 'bg-secondary text-primary' : ''
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <Home className="w-5 h-5" />
                    <span>Home</span>
                  </div>
                </Link>
              </li>
              
              <li>
                <Link 
                  to="/browse"
                  className={`block px-3 py-2 rounded-md ${
                    isActive('/browse') ? 'bg-secondary text-primary' : ''
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5" />
                    <span>Browse</span>
                  </div>
                </Link>
              </li>
              
              <li>
                <Link 
                  to="/search"
                  className={`block px-3 py-2 rounded-md ${
                    isActive('/search') ? 'bg-secondary text-primary' : ''
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <Search className="w-5 h-5" />
                    <span>Search</span>
                  </div>
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
