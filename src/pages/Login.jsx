import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNotifications } from '../context/NotificationContext';
import { API_BASE_URL } from '../config';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('auth-change'));

        addNotification(
          'Welcome Back',
          `Successfully logged in as ${data.user.name}`,
          'success'
        );

        if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-accent font-poppins py-20 md:py-0">
      {/* Back to Home Button */}
      <Link
        to="/"
        className="absolute top-8 left-8 z-30 flex items-center gap-2 text-neutral/40 hover:text-primary transition-all group font-poppins text-[10px] uppercase tracking-[0.3em]"
      >
        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
          <ArrowRight className="w-4 h-4 rotate-180" />
        </div>
        <span className="hidden md:block">Back to Hall</span>
      </Link>

      {/* Premium Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2000&auto=format&fit=crop"
          alt="Luxury background"
          className="w-full h-full object-cover scale-110 transition-transform duration-[20s] motion-safe:animate-[pulse_20s_infinite] will-change-transform"
        />
        {/* Decorative Gold Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2"></div>
      </div>

      {/* Login Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 w-full max-w-md px-6"
      >
        <div className="bg-secondary/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl overflow-hidden group">
          {/* Subtle light sweep animation */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>

          <div className="text-center mb-8 md:mb-10">
             <motion.div
               initial={{ scale: 0.8 }}
               animate={{ scale: 1 }}
               className="inline-block p-3 md:p-4 rounded-full bg-primary/10 mb-4 md:mb-6 border border-primary/20"
             >
               <LogIn className="text-primary w-6 h-6 md:w-8 md:h-8" />
             </motion.div>
             <h2 className="text-3xl md:text-4xl font-playfair font-bold text-neutral tracking-tight mb-2 md:mb-3 italic">
               Welcome <span className="text-primary not-italic">Back</span>
             </h2>
             <p className="text-neutral/40 text-xs md:text-sm uppercase tracking-[0.2em] font-light">
               The height of dining awaits
             </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs mb-8 text-center backdrop-blur-md"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs text-primary font-black uppercase tracking-[0.2em] ml-2">
                Email Portfolio
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral/30 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  required
                  placeholder="name@isogoods.com"
                  className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-neutral placeholder:text-neutral/20 focus:border-primary/50 focus:bg-black/40 outline-none transition-all duration-300"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-primary font-black uppercase tracking-[0.2em] ml-2">
                Secure Key
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral/30 group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-neutral placeholder:text-neutral/20 focus:border-primary/50 focus:bg-black/40 outline-none transition-all duration-300"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative overflow-hidden bg-primary hover:bg-neutral text-secondary font-black py-5 rounded-2xl transition-all duration-500 group/btn"
            >
              <div className="relative z-10 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.3em]">
                {loading ? 'Authenticating...' : (
                  <>
                    Sign In <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                  </>
                )}
              </div>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></div>
            </button>
          </form>

          <div className="mt-10 text-center space-y-4">
            <p className="text-neutral/30 text-xs uppercase tracking-widest">
              Exclusive Member?
              <Link to="/register" className="text-primary font-black hover:text-neutral ml-2 transition-colors">
                REGISTER MEMBERSHIP
              </Link>
            </p>
            <div className="pt-6 border-t border-white/5">
              <Link to="/" className="text-neutral/40 text-[11px] uppercase tracking-[0.4em] hover:text-primary transition-all font-bold">
                Return to Grand Hall
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Brand */}
        <div className="mt-8 text-center">
          <span className="font-playfair text-neutral/10 text-4xl md:text-6xl font-bold tracking-tighter pointer-events-none select-none">
            ISOGOODS
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
