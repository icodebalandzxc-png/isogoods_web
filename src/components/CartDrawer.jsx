import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiMinus, HiPlus, HiOutlineShoppingBag } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
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
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-secondary shadow-2xl z-[101] flex flex-col border-l border-white/5"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <HiOutlineShoppingBag size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-playfair font-bold text-neutral">Your Cart</h2>
                  <p className="text-[10px] text-primary font-black uppercase tracking-widest">{cartItems.length} Selection(s)</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full text-neutral/40 hover:text-primary transition-all"
              >
                <HiX size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                  <HiOutlineShoppingBag size={80} className="mb-4" />
                  <p className="font-playfair italic text-xl">Your cart is empty.</p>
                  <p className="text-sm mt-2">Start adding some delicious dishes!</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.cartItemId} className="flex gap-4 group">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/20 shrink-0 border border-white/5">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/5 bg-muted/20">
                          <HiOutlineShoppingBag size={32} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-neutral text-sm uppercase">{item.name}</h4>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-neutral/20 hover:text-red-500 transition-colors"
                        >
                          <HiX size={16} />
                        </button>
                      </div>
                      {item.selectedVariant && (
                        <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">
                          {item.selectedVariant.label}
                        </p>
                      )}
                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center gap-3 bg-black/20 rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center text-neutral/40 hover:text-primary"
                          >
                            <HiMinus size={14} />
                          </button>
                          <span className="text-xs font-bold text-neutral w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-neutral/40 hover:text-primary"
                          >
                            <HiPlus size={14} />
                          </button>
                        </div>
                        <span className="text-primary font-black">₱{(item.price * item.quantity).toFixed(0)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-8 border-t border-white/5 bg-black/10">
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-neutral/40 text-sm">
                    <span>Subtotal</span>
                    <span>₱{cartTotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-neutral font-bold text-xl">
                    <span className="font-playfair italic">Total Amount</span>
                    <span className="text-primary font-black">₱{cartTotal.toFixed(0)}</span>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-primary hover:bg-neutral text-secondary font-black py-4 rounded-xl transition-all uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3"
                >
                  Confirm Order Selection
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
