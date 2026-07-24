import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, ArrowRight, ShieldCheck, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/register.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setIsVerifying(true);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration Error:', err);
      setError('Connection error. Please check if your backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/verify.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          code: verificationCode
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert('Account verified successfully! You can now log in.');
        navigate('/login');
      } else {
        setError(data.message || 'Verification failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-accent font-poppins py-20 md:py-0">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/70 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2000&auto=format&fit=crop"
          alt="Luxury dining background"
          className="w-full h-full object-cover scale-110 transition-transform duration-[20s] motion-safe:animate-[pulse_20s_infinite]"
        />
        {/* Decorative Gold Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2"></div>
      </div>

      {/* Register Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 w-full max-w-lg px-6"
      >
        <div className="bg-secondary/40 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl overflow-hidden group">
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>

          <AnimatePresence mode="wait">
            {!isVerifying ? (
              <motion.div
                key="register-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center mb-8 md:mb-10">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="inline-block p-3 md:p-4 rounded-full bg-primary/10 mb-4 md:mb-6 border border-primary/20"
                  >
                    <UserPlus className="text-primary w-6 h-6 md:w-8 md:h-8" />
                  </motion.div>
                  <h2 className="text-3xl md:text-4xl font-playfair font-bold text-neutral tracking-tight mb-2 md:mb-3 italic">
                    Join the <span className="text-primary not-italic">Elite</span>
                  </h2>
                  <p className="text-neutral/40 text-[10px] uppercase tracking-[0.3em] font-light">
                    Begin your culinary journey with us
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
                    <label className="text-[10px] text-primary font-black uppercase tracking-[0.2em] ml-2">
                      Patron Name
                    </label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral/30 group-focus-within:text-primary transition-colors" />
                      <input
                        type="text"
                        required
                        placeholder="Full Name"
                        className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-neutral placeholder:text-neutral/20 focus:border-primary/50 focus:bg-black/40 outline-none transition-all duration-300"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-primary font-black uppercase tracking-[0.2em] ml-2">
                      Digital Address
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral/30 group-focus-within:text-primary transition-colors" />
                      <input
                        type="email"
                        required
                        placeholder="name@exclusive.com"
                        className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-neutral placeholder:text-neutral/20 focus:border-primary/50 focus:bg-black/40 outline-none transition-all duration-300"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-primary font-black uppercase tracking-[0.2em] ml-2">
                      Membership Key
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
                      {loading ? 'Processing...' : (
                        <>
                          Create Account <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                        </>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></div>
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="verify-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center mb-8 md:mb-10">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="inline-block p-3 md:p-4 rounded-full bg-primary/10 mb-4 md:mb-6 border border-primary/20"
                  >
                    <ShieldCheck className="text-primary w-6 h-6 md:w-8 md:h-8" />
                  </motion.div>
                  <h2 className="text-3xl md:text-4xl font-playfair font-bold text-neutral tracking-tight mb-2 md:mb-3 italic">
                    Verify <span className="text-primary not-italic">Identity</span>
                  </h2>
                  <p className="text-neutral/40 text-[10px] uppercase tracking-[0.3em] font-light">
                    Enter the 6-digit code sent to your email
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

                <form onSubmit={handleVerify} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-primary font-black uppercase tracking-[0.2em] ml-2">
                      Verification Code
                    </label>
                    <div className="relative group">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral/30 group-focus-within:text-primary transition-colors" />
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="000000"
                        className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-neutral text-center text-2xl tracking-[0.5em] font-bold placeholder:text-neutral/20 focus:border-primary/50 focus:bg-black/40 outline-none transition-all duration-300"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full relative overflow-hidden bg-primary hover:bg-neutral text-secondary font-black py-5 rounded-2xl transition-all duration-500 group/btn"
                  >
                    <div className="relative z-10 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.3em]">
                      {loading ? 'Verifying...' : (
                        <>
                          Verify & Activate <ShieldCheck className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        </>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsVerifying(false)}
                    className="w-full text-neutral/30 text-[10px] uppercase tracking-widest hover:text-primary transition-colors pt-2"
                  >
                    Use different email address
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-10 text-center space-y-4">
            <p className="text-neutral/30 text-[10px] uppercase tracking-widest">
              Existing Member?
              <Link to="/login" className="text-primary font-black hover:text-neutral ml-2 transition-colors">
                SIGN IN HERE
              </Link>
            </p>
            <div className="pt-6 border-t border-white/5">
              <Link to="/" className="text-neutral/20 text-[9px] uppercase tracking-[0.4em] hover:text-primary transition-colors">
                Return to Grand Hall
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <span className="font-playfair text-neutral/10 text-4xl md:text-6xl font-bold tracking-tighter pointer-events-none select-none">
            ISOGOODS
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
