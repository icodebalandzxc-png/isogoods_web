import { FaPhone, FaFacebookMessenger } from 'react-icons/fa';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';

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
    <div className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-50 flex flex-col gap-4">
      {/* Floating Cart Button (Mobile only) */}
      {user && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="lg:hidden w-12 h-12 bg-white text-secondary rounded-full flex items-center justify-center shadow-2xl border border-primary/20 relative animate-fade-in"
          title="Open Cart"
        >
          <HiOutlineShoppingBag size={24} className="text-primary" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-secondary text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-accent animate-pulse">
              {cartCount}
            </span>
          )}
        </button>
      )}

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
  );
};

export default FloatingButtons;
