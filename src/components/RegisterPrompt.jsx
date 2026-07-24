import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RegisterPrompt = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    const hasSeenPrompt = sessionStorage.getItem('hasSeenRegisterPrompt');

    if (!user && !hasSeenPrompt) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('hasSeenRegisterPrompt', 'true');
  };

  const handleRegister = () => {
    handleClose();
    navigate('/register');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.9 }}
          className="fixed bottom-6 right-4 left-4 md:left-auto md:right-6 z-[400] w-auto md:w-[320px] bg-accent/95 backdrop-blur-xl border border-white/10 rounded-[2rem] p-5 md:p-6 shadow-2xl shadow-black/50"
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-neutral/20 hover:text-primary transition-colors"
          >
            <X size={16} />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 border border-primary/20">
              <UserPlus className="text-primary w-6 h-6" />
            </div>

            <div className="text-left">
              <h3 className="text-sm font-playfair font-bold text-neutral italic mb-1">
                Ready to <span className="text-primary not-italic">order?</span>
              </h3>
              <p className="text-[10px] text-neutral/60 leading-relaxed mb-4">
                Create an account for a <span className="text-neutral font-medium">faster checkout</span> experience!
              </p>

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleRegister}
                  className="w-full bg-primary text-secondary py-2.5 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2"
                >
                  Create Account <ArrowRight size={12} />
                </button>
                <button
                  onClick={handleClose}
                  className="text-[8px] text-neutral/30 uppercase tracking-[0.2em] hover:text-neutral/50 transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RegisterPrompt;
