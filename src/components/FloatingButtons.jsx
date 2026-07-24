import { FaPhone, FaFacebookMessenger } from 'react-icons/fa';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingButtons = () => {
  const { cartCount, setIsCartOpen } = useCart();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <>
      {/* Floating Cart Button (Visible on all screens) */}
      <AnimatePresence>
        {user && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-24 right-8 z-50 w-14 h-14 bg-primary text-secondary rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(212,175,55,0.3)] border border-primary/20 group hover:scale-110 transition-all duration-300"
            title="Open Cart"
          >
            <HiOutlineShoppingBag size={28} className="group-hover:rotate-12 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-primary text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-primary shadow-lg animate-bounce">
                {cartCount}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-50 flex flex-col gap-4">
        <a
          href="tel:09958702671"
          className="w-10 h-10 md:w-12 md:h-12 bg-primary text-accent rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
          title="Call Us"
        >
          <FaPhone size={18} />
        </a>
        <a
          href="https://m.me/isogoodsdiner"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 md:w-12 md:h-12 bg-[#0084FF] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
          title="Message Us"
        >
          <FaFacebookMessenger size={20} />
        </a>
      </div>
    </>
  );
};

export default FloatingButtons;
