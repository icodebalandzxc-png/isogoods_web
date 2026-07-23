import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';
import { HiOutlineLocationMarker, HiOutlineCreditCard, HiOutlineChevronLeft, HiCheckCircle } from 'react-icons/hi';
import { FaMoneyBillWave, FaWallet } from 'react-icons/fa';
import { CheckCircle, ArrowRight, Package } from 'lucide-react';
import { API_BASE_URL } from '../config';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
    gcash_number: '0995 870 2671',
    gcash_qr_url: ''
  });

  useEffect(() => {
    const fetchSettings = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/get_settings.php`);
            const data = await res.json();
            if (data) setSettings(data);
        } catch (err) {
            console.error("Failed to fetch settings", err);
        }
    };
    fetchSettings();

    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));

    if (cartItems.length === 0) {
      navigate('/menu');
    }
  }, [cartItems, navigate]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!address || !phone) {
      alert("Please provide your delivery address and phone number.");
      return;
    }

    if (paymentMethod === 'GCash' && !proofFile) {
      alert("Please upload your GCash proof of payment.");
      return;
    }

    setLoading(true);
    // Optimistic UI: Immediately show success modal while background processing
    setIsSuccess(true);
    const orderGroupId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    try {
      let proofUrl = null;
      // Background process
      if (paymentMethod === 'GCash' && proofFile) {
        const formData = new FormData();
        formData.append('image', proofFile);
        const uploadRes = await fetch(`${API_BASE_URL}/upload.php`, {
          method: 'POST',
          body: formData
        });
        const uploadText = await uploadRes.text();
        let uploadData;
        try {
            uploadData = JSON.parse(uploadText);
        } catch(e) {
            throw new Error("Upload server returned invalid response");
        }

        if (uploadData.success) {
          proofUrl = uploadData.url;
        } else {
          throw new Error(uploadData.message || "Failed to upload proof of payment.");
        }
      }

      const results = await Promise.all(cartItems.map(async (item) => {
        try {
          const res = await fetch(`${API_BASE_URL}/place_order.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: user.id,
              product_id: item.id,
              order_group_id: orderGroupId,
              variant_name: item.selectedVariant ? item.selectedVariant.label : 'Standard',
              quantity: item.quantity,
              address: address,
              phone_number: phone,
              payment_method: paymentMethod,
              proof_of_payment: proofUrl
            })
          });
          const text = await res.text();
          try {
            return JSON.parse(text);
          } catch (e) {
            return { error: "Server response was not JSON: " + text.substring(0, 100) };
          }
        } catch (e) {
          return { error: "Network error: " + e.message };
        }
      }));

      const error = results.find(r => r.error || (r.message && r.message.includes("Failed")));
      if (error) throw new Error(error.error || error.message);

      addNotification('Order Confirmed', `Order ${orderGroupId} is being processed!`, 'success');
      clearCart();
    } catch (err) {
      console.error(err);
      setIsSuccess(false);
      alert(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-accent pt-32 pb-20 px-4 font-poppins">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Left Side: Order Validation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <button
            onClick={() => navigate('/menu')}
            className="flex items-center gap-2 text-neutral/40 hover:text-primary transition-colors uppercase text-[10px] font-black tracking-[0.2em]"
          >
            <HiOutlineChevronLeft size={16} /> Return to Menu
          </button>

          <div>
            <h1 className="text-5xl font-playfair font-bold text-neutral italic mb-4">
              Validate <span className="text-primary not-italic">Order</span>
            </h1>
            <p className="text-neutral/40 text-sm tracking-widest uppercase">Review your selection before we prepare the feast.</p>
          </div>

          <div className="bg-secondary/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 space-y-6">
            <h3 className="text-lg font-bold text-neutral flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">1</span>
              Review Selection
            </h3>

            <div className="max-h-[400px] overflow-y-auto no-scrollbar space-y-4">
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="flex justify-between items-center p-4 bg-black/20 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted flex items-center justify-center">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <HiCheckCircle className="text-white/10" size={24} />
                      )}
                    </div>
                    <div>
                      <h4 className="text-neutral font-bold text-sm uppercase">{item.name}</h4>
                      <p className="text-[10px] text-primary font-black uppercase tracking-tighter">
                        {item.selectedVariant ? item.selectedVariant.label : 'Standard'} x{item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="text-neutral font-black">₱{(item.price * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-white/5 flex justify-between items-end">
              <div>
                <p className="text-neutral/40 text-[10px] uppercase tracking-widest">Total Investment</p>
                <p className="text-3xl font-black text-primary">₱{cartTotal.toFixed(0)}</p>
              </div>
              <div className="text-right">
                <p className="text-neutral/20 text-[9px] uppercase tracking-widest">Estimated Prep Time</p>
                <p className="text-neutral font-bold">25-40 MINS</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Shipping & Payment */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-secondary/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-10 shadow-2xl space-y-10"
        >
          {/* Address Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-neutral flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">2</span>
              Delivery Destination
            </h3>
            <div className="relative group">
              <HiOutlineLocationMarker className="absolute left-5 top-5 text-primary w-5 h-5 group-focus-within:animate-bounce transition-all" />
              <textarea
                placeholder="Enter your exact house number, street, and landmark in Irosin..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows="4"
                className="w-full bg-black/20 border border-white/5 rounded-[2rem] py-5 pl-14 pr-6 text-neutral placeholder:text-neutral/20 focus:border-primary/50 focus:bg-black/40 outline-none transition-all resize-none text-sm"
                required
              ></textarea>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] ml-2">Contact Details for Rider</p>
              <input
                type="tel"
                placeholder="Active Phone Number (e.g. 09123456789)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 px-6 text-neutral placeholder:text-neutral/20 focus:border-primary/50 focus:bg-black/40 outline-none transition-all text-sm"
                required
              />
              <p className="text-[9px] text-neutral/30 italic ml-2">* Our delivery rider will call this number upon arrival.</p>
            </div>
          </div>

          {/* Payment Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-neutral flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">3</span>
              Payment Method
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`p-6 rounded-[2rem] border transition-all flex flex-col items-center gap-3 ${
                  paymentMethod === 'COD'
                    ? 'bg-primary/10 border-primary text-primary shadow-[0_0_30px_rgba(212,175,55,0.1)]'
                    : 'bg-black/20 border-white/5 text-neutral/40 hover:border-white/20'
                }`}
              >
                <FaMoneyBillWave size={24} />
                <span className="text-[10px] font-black uppercase tracking-widest">Cash on Delivery</span>
                {paymentMethod === 'COD' && <HiCheckCircle className="absolute top-4 right-4 text-primary" />}
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('GCash')}
                className={`p-6 rounded-[2rem] border transition-all flex flex-col items-center gap-3 ${
                  paymentMethod === 'GCash'
                    ? 'bg-primary/10 border-primary text-primary shadow-[0_0_30px_rgba(212,175,55,0.1)]'
                    : 'bg-black/20 border-white/5 text-neutral/40 hover:border-white/20'
                }`}
              >
                <FaWallet size={24} />
                <span className="text-[10px] font-black uppercase tracking-widest">Pay via GCash</span>
                {paymentMethod === 'GCash' && <HiCheckCircle className="absolute top-4 right-4 text-primary" />}
              </button>
            </div>

            {paymentMethod === 'GCash' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-primary/5 border border-primary/20 p-8 rounded-[2.5rem] text-center space-y-4"
              >
                <p className="text-neutral/60 text-xs italic">Send payment to:</p>
                <p className="text-primary font-black text-2xl tracking-widest">{settings.gcash_number}</p>

                {settings.gcash_qr_url && (
                    <div className="bg-white p-4 rounded-3xl inline-block shadow-lg mx-auto">
                        <img src={settings.gcash_qr_url} alt="GCash QR Code" className="w-48 h-48 object-contain" />
                    </div>
                )}

                <div className="pt-4 border-t border-primary/10">
                    <label className="block text-[10px] text-neutral/40 font-black uppercase tracking-widest mb-4">Upload GCash Receipt</label>
                    <div className="relative group">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setProofFile(e.target.files[0])}
                            className="hidden"
                            id="proof-upload"
                        />
                        <label
                            htmlFor="proof-upload"
                            className={`w-full flex flex-col items-center justify-center gap-2 p-6 rounded-[2rem] cursor-pointer transition-all border-2 border-dashed ${
                                proofFile ? 'bg-primary/20 border-primary text-primary' : 'bg-black/20 border-white/5 text-neutral/40 hover:border-primary/30'
                            }`}
                        >
                            <HiOutlineCreditCard size={24} />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                                {proofFile ? proofFile.name : 'Select Receipt Screenshot'}
                            </span>
                        </label>
                    </div>
                </div>

                <p className="text-neutral/40 text-[9px] uppercase tracking-[0.2em]">Verification is required for GCash orders</p>
              </motion.div>
            )}
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loading || isSuccess}
            className="w-full bg-primary hover:bg-neutral text-secondary font-black py-6 rounded-3xl transition-all duration-500 uppercase text-xs tracking-[0.4em] shadow-xl shadow-primary/10 flex items-center justify-center gap-4 group"
          >
            {loading ? 'Finalizing Order...' : (
              <>
                Finalize Order Manifest <ArrowRightIcon className="group-hover:translate-x-2 transition-transform" />
              </>
            )}
          </button>
        </motion.div>
      </div>

      {/* Success Modal (Optimistic UI) */}
      <AnimatePresence>
          {isSuccess && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-secondary/95 backdrop-blur-2xl"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="relative z-10 w-full max-w-lg bg-accent border border-white/10 rounded-[3rem] p-12 text-center shadow-2xl"
                  >
                      <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-primary/20">
                          <CheckCircle size={48} className="text-secondary animate-bounce" />
                      </div>
                      <h2 className="text-4xl font-playfair font-bold text-neutral italic mb-4">Feast <span className="text-primary not-italic">Confirmed!</span></h2>
                      <p className="text-neutral/40 text-sm tracking-widest uppercase mb-10">We've received your manifest. Our chefs are being notified as we speak.</p>

                      <div className="bg-secondary/40 border border-white/5 rounded-3xl p-6 mb-10 flex items-center gap-6 text-left">
                          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                              <Package size={24} />
                          </div>
                          <div>
                              <p className="text-[10px] font-black text-neutral/30 uppercase tracking-widest mb-1">Estimated Prep Start</p>
                              <p className="text-neutral font-bold text-lg">Under 5 Minutes</p>
                          </div>
                      </div>

                      <button
                        onClick={() => navigate('/orders')}
                        className="w-full bg-primary text-secondary py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-white transition-all shadow-lg shadow-primary/20"
                      >
                          Track My Order
                      </button>
                  </motion.div>
              </div>
          )}
      </AnimatePresence>
    </div>
  );
};

const ArrowRightIcon = ({ className }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
);

export default Checkout;
