import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, X, Sparkles } from 'lucide-react';
import welcomeImg from '../assets/icons/welcome.png';
import { API_BASE_URL } from '../config';

const WelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    welcome_title: 'Welcome to Isogoods!',
    welcome_subtitle: 'Kami ay may espesyal na handog para sa inyo!',
    promo_title: 'Free Delivery Promo',
    promo_description: 'Free delivery para sa mga order na nagkakahalaga ng ₱2,000 pataas sa loob ng Poblacion, at ₱5,000 pataas para sa mga nasa labas ng Poblacion.',
    welcome_button_text: 'Simulan ang Pag-order'
  });

  useEffect(() => {
    // Fetch settings
    fetch(`${API_BASE_URL}/get_settings.php`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setSettings(prev => ({
            ...prev,
            ...data
          }));
        }
      })
      .catch(err => console.error('Error fetching settings:', err));

    const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500); // Show after 1.5 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('hasSeenWelcome', 'true');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-secondary/40 backdrop-blur-lg"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="relative z-[310] w-full max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar bg-accent border border-white/10 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-12 text-center shadow-2xl"
          >
            <button
                onClick={handleClose}
                className="absolute top-5 right-5 text-neutral/20 hover:text-primary transition-colors z-[320]"
            >
                <X size={20} />
            </button>

            <div className="relative w-full mb-6 md:mb-8">
                <img
                    src={welcomeImg}
                    alt="Welcome to Isogoods"
                    className="w-full h-auto max-h-[180px] md:max-h-[300px] object-contain mx-auto"
                />
            </div>

            <h2 className="text-2xl md:text-3xl font-playfair font-bold text-neutral italic mb-4 md:mb-6">
              {settings.welcome_title.split(' ').map((word, i) =>
                word.toLowerCase() === 'isogoods!' || word.toLowerCase() === 'isogoods' ?
                <span key={i} className="text-primary not-italic">{word} </span> : word + ' '
              )}
            </h2>

            <div className="space-y-4 md:space-y-6 mb-8 md:mb-10">
                <p className="text-neutral/80 text-base md:text-lg font-medium leading-relaxed">
                    {settings.welcome_subtitle}
                </p>
                <div className="space-y-3 md:space-y-4">
                    <div className="text-neutral/60 text-xs md:text-sm leading-relaxed">
                        <span className="text-primary font-black uppercase tracking-wider block mb-1 md:mb-2">{settings.promo_title}</span>
                        <div dangerouslySetInnerHTML={{ __html: settings.promo_description.replace(/₱[\d,]+/g, match => `<span class="text-neutral font-bold">${match}</span>`) }} />
                    </div>
                </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full bg-primary text-secondary py-4 md:py-5 rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-[0.3em] hover:bg-white transition-all shadow-lg shadow-primary/20"
            >
              {settings.welcome_button_text}
            </button>

            <p className="mt-6 text-[10px] text-neutral/20 uppercase tracking-[0.2em]">
                Terms and conditions apply.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeModal;
