import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, BellRing } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { API_BASE_URL } from '../config';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotifications();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/subscribe_newsletter.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();

      if (res.ok) {
        addNotification('Subscribed!', data.message, 'success');
        setEmail('');
      } else {
        addNotification('Subscription failed', data.message, 'error');
      }
    } catch (err) {
      addNotification('Error', 'Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-secondary/20 relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto bg-accent/40 backdrop-blur-xl border border-white/5 rounded-[3.5rem] p-8 md:p-16 text-center shadow-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/20">
              <BellRing className="text-primary w-8 h-8" />
            </div>

            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-neutral italic">
              Makasama sa <span className="text-primary not-italic">IsoGoods Circle</span>
            </h2>
            <p className="text-neutral/40 text-sm md:text-base uppercase tracking-[0.2em] max-w-2xl mx-auto leading-relaxed">
              Maging updated sa aming mga bagong menu, promos, at special announcements.
              Maging isa sa mga unang makakatanggap ng IsoGoods updates!
            </p>

            <form onSubmit={handleSubscribe} className="mt-12 max-w-lg mx-auto relative group">
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral/20 group-focus-within:text-primary transition-colors" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ilagay ang iyong email address"
                  className="w-full bg-black/20 border border-white/10 rounded-full py-6 pl-16 pr-32 text-neutral placeholder:text-neutral/20 focus:border-primary/50 outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary hover:bg-neutral text-secondary font-black px-6 py-3.5 rounded-full transition-all flex items-center gap-2 group/btn disabled:opacity-50"
                >
                  <span className="text-[10px] uppercase tracking-widest">{loading ? '...' : 'Subscribe'}</span>
                  <Send size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </button>
              </div>
            </form>

            <p className="mt-8 text-[10px] text-neutral/20 uppercase tracking-[0.3em]">
              Walang spam, puro masasarap na balita lang.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
