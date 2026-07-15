import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import logo from '../assets/logo.jpg';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-accent/90 backdrop-blur-md py-4 shadow-xl' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 md:px-12 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Isogoods Diner" className="h-12 w-12 md:h-16 md:w-16 object-contain rounded-full" />
          <span className="hidden sm:block text-xl md:text-2xl font-playfair font-bold text-primary tracking-wider md:tracking-widest">
            ISOGOODS <span className="text-neutral font-light">DINER</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`font-poppins text-sm uppercase tracking-widest hover:text-primary transition-colors ${
                location.pathname === link.path ? 'text-primary border-b border-primary' : 'text-neutral'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/contact"
            className="btn-primary py-2 px-6 text-xs uppercase tracking-widest"
          >
            Book Table
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-primary text-3xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-secondary border-t border-white/10"
          >
            <div className="flex flex-col p-6 space-y-4">
              <div className="flex justify-center mb-4">
                <img src={logo} alt="Logo" className="w-20 h-20 rounded-full border border-primary/20 p-1" />
              </div>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-poppins uppercase tracking-widest ${
                    location.pathname === link.path ? 'text-primary' : 'text-neutral'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="btn-primary text-center"
              >
                Book Table
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
