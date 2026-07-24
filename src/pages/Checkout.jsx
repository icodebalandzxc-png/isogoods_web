import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';
import { HiOutlineLocationMarker, HiOutlineCreditCard, HiOutlineChevronLeft, HiCheckCircle } from 'react-icons/hi';
import { FaMoneyBillWave, FaWallet } from 'react-icons/fa';
import { CheckCircle, ArrowRight, Package, Truck, Store, Utensils, Calendar, CreditCard as CardIcon, Landmark, Wallet as WalletIcon, Banknote, User, MapPin, Smartphone } from 'lucide-react';
import { API_BASE_URL, getImageUrl } from '../config';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderType, setOrderType] = useState('Delivery');
  const [reservationDate, setReservationDate] = useState('');
  const [reservationTime, setReservationTime] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [landmark, setLandmark] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [isLocating, setIsLocating] = useState(false);
  const [proofFile, setProofFile] = useState(null);
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
    gcash_number: '0995 870 2671',
    gcash_qr_url: '',
    maya_qr_url: '',
    receiver_name: '',
    bank_transfer_details: '',
    maya_details: '',
    maribank_details: ''
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

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIsLocating(false);
        addNotification('Location Pinned', 'Your exact coordinates have been captured!', 'success');
      },
      (error) => {
        setIsLocating(false);
        alert("Unable to retrieve your location. Please ensure GPS is enabled.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (orderType === 'Delivery' && !address) {
      alert("Please provide your delivery address.");
      return;
    }

    if (!phone) {
      alert("Please provide your phone number.");
      return;
    }

    if (orderType === 'Reservation' && (!reservationDate || !reservationTime || !customerName || !address)) {
      alert("Please select reservation date, time, customer name, and address.");
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
              order_type: orderType,
              reservation_date: orderType === 'Reservation' ? reservationDate : null,
              reservation_time: orderType === 'Reservation' ? reservationTime : null,
              address: orderType === 'Reservation'
                ? `Name: ${customerName} | Address: ${address} | Landmark: ${landmark}`
                : (orderType === 'Delivery' ? address : orderType),
              lat: coords.lat,
              lng: coords.lng,
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
                        <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
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

        {/* Right Side: Configuration & Logistics */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-secondary/40 backdrop-blur-3xl border border-white/5 rounded-[3.5rem] p-8 md:p-12 shadow-2xl space-y-12 relative overflow-hidden"
        >
          {/* Subtle Background Accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          {/* Progress Header */}
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${step === 2 ? 'bg-primary text-secondary' : 'bg-white/5 text-white/20'}`}>
                  {step + 1}
                </div>
                <div className={`h-1 w-12 rounded-full ${step < 3 ? 'bg-white/5' : ''}`}></div>
              </div>
            ))}
          </div>

          {/* Service Type Selection */}
          <div className="space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-2xl font-playfair font-bold text-neutral italic">Service <span className="text-primary not-italic">Modality</span></h3>
                <p className="text-[10px] text-neutral/30 uppercase tracking-[0.2em] mt-1">Select how you wish to experience your meal</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'Delivery', icon: Truck, label: 'Delivery', desc: 'To your doorstep' },
                { id: 'Pick Up', icon: Store, label: 'Pick Up', desc: 'At our counter' },
                { id: 'Dine', icon: Utensils, label: 'Dine In', desc: 'In-house feast' },
                { id: 'Reservation', icon: Calendar, label: 'Reserve', desc: 'Schedule ahead' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setOrderType(item.id)}
                  className={`group p-6 rounded-[2.5rem] border transition-all duration-500 flex flex-col items-start gap-4 relative overflow-hidden ${
                    orderType === item.id
                      ? 'bg-primary border-primary shadow-[0_20px_40px_rgba(212,175,55,0.15)]'
                      : 'bg-black/20 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className={`p-3 rounded-2xl transition-colors ${orderType === item.id ? 'bg-secondary text-primary' : 'bg-white/5 text-neutral/40 group-hover:text-primary'}`}>
                    <item.icon size={20} />
                  </div>
                  <div>
                    <span className={`text-xs font-black uppercase tracking-widest block ${orderType === item.id ? 'text-secondary' : 'text-neutral'}`}>{item.label}</span>
                    <span className={`text-[9px] uppercase tracking-tighter opacity-40 ${orderType === item.id ? 'text-secondary' : 'text-neutral'}`}>{item.desc}</span>
                  </div>
                  {orderType === item.id && (
                    <motion.div layoutId="serviceCheck" className="absolute top-6 right-6 text-secondary">
                      <HiCheckCircle size={20} />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Logistics Form */}
          <div className="space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-2xl font-playfair font-bold text-neutral italic">Logistics <span className="text-primary not-italic">Details</span></h3>
                <p className="text-[10px] text-neutral/30 uppercase tracking-[0.2em] mt-1">Required coordinates for fulfillment</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {orderType === 'Reservation' ? (
                <motion.div
                  key="reservation-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl mb-2">
                    <p className="text-[9px] text-primary font-black uppercase tracking-[0.1em] text-center leading-relaxed">
                      Security Deposit Required: 50% downpayment is necessary to lock your reservation slot.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 group">
                      <label className="text-[9px] text-primary font-black uppercase tracking-widest ml-4">Schedule Date</label>
                      <input
                        type="date"
                        value={reservationDate}
                        onChange={(e) => setReservationDate(e.target.value)}
                        className="w-full bg-black/30 border border-white/5 rounded-2xl py-4 px-6 text-neutral focus:border-primary/50 outline-none text-xs transition-all"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="space-y-2 group">
                      <label className="text-[9px] text-primary font-black uppercase tracking-widest ml-4">Desired Time</label>
                      <input
                        type="time"
                        value={reservationTime}
                        onChange={(e) => setReservationTime(e.target.value)}
                        className="w-full bg-black/30 border border-white/5 rounded-2xl py-4 px-6 text-neutral focus:border-primary/50 outline-none text-xs transition-all"
                      />
                    </div>
                  </div>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors" size={16} />
                    <input
                      type="text"
                      placeholder="Full Name for Reservation"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-black/30 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-neutral focus:border-primary/50 outline-none text-xs transition-all"
                    />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="space-y-4">
              {orderType !== 'Pick Up' && orderType !== 'Dine' && (
                <div className="space-y-4">
                  <div className="relative group">
                    <MapPin className="absolute left-5 top-5 text-primary/40 group-focus-within:text-primary transition-colors" size={16} />
                    <textarea
                      placeholder={orderType === 'Reservation' ? "Home Address for Security" : "Exact delivery coordinates and house number..."}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows="2"
                      className="w-full bg-black/30 border border-white/5 rounded-2xl py-5 pl-12 pr-6 text-neutral placeholder:text-neutral/20 focus:border-primary/50 outline-none transition-all resize-none text-xs"
                      required
                    ></textarea>

                    <button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={isLocating}
                      className={`absolute right-4 bottom-4 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                        coords.lat ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-primary/20 text-primary border border-primary/30 hover:bg-primary hover:text-secondary'
                      }`}
                    >
                      {isLocating ? 'Locating...' : coords.lat ? 'Location Captured ✓' : 'Pin My Exact Location'}
                    </button>
                  </div>
                  {orderType === 'Reservation' && (
                    <div className="relative group">
                      <HiOutlineLocationMarker className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors" size={16} />
                      <input
                        type="text"
                        placeholder="Nearest Landmark (e.g. Near Irosin Church)"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        className="w-full bg-black/30 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-neutral focus:border-primary/50 outline-none text-xs transition-all"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="relative group">
                <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors" size={16} />
                <input
                  type="tel"
                  placeholder="Active Phone Number (09XXXXXXXXX)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-black/30 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-neutral focus:border-primary/50 outline-none text-xs transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Methodology */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-playfair font-bold text-neutral italic">Payment <span className="text-primary not-italic">Settlement</span></h3>
              <p className="text-[10px] text-neutral/30 uppercase tracking-[0.2em] mt-1">Select your preferred transaction channel</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { id: 'COD', icon: Banknote, label: 'COD' },
                { id: 'GCash', icon: WalletIcon, label: 'GCash' },
                { id: 'Maya', icon: CardIcon, label: 'Maya' },
                { id: 'Bank Transfer', icon: Landmark, label: 'Bank' },
                { id: 'MariBank', icon: CardIcon, label: 'MariBank' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPaymentMethod(item.id)}
                  className={`p-5 rounded-[2rem] border transition-all flex flex-col items-center gap-3 relative ${
                    paymentMethod === item.id
                      ? 'bg-primary/10 border-primary text-primary shadow-lg'
                      : 'bg-black/20 border-white/5 text-neutral/30 hover:border-white/20'
                  }`}
                >
                  <item.icon size={18} />
                  <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
                  {paymentMethod === item.id && <HiCheckCircle className="absolute top-3 right-3 text-primary" size={14} />}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {paymentMethod !== 'COD' && (
                <motion.div
                  key="payment-details"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="bg-secondary/60 border border-primary/20 p-8 rounded-[3rem] text-center space-y-6 relative group"
                >
                  <div className="space-y-1">
                    <p className="text-neutral/40 text-[9px] uppercase tracking-widest">Payable To Merchant</p>
                    {settings.receiver_name && (
                      <p className="text-neutral font-black text-xs uppercase tracking-[0.3em]">{settings.receiver_name}</p>
                    )}
                  </div>

                  <div className="p-4 bg-black/40 rounded-2xl inline-block border border-white/5">
                    {paymentMethod === 'GCash' && <p className="text-primary font-black text-2xl tracking-[0.2em]">{settings.gcash_number || '09XX XXX XXXX'}</p>}
                    {paymentMethod === 'Maya' && <p className="text-primary font-black text-2xl tracking-[0.2em]">{settings.maya_details || '09XX XXX XXXX'}</p>}
                    {paymentMethod === 'Bank Transfer' && <p className="text-primary font-black text-sm tracking-widest uppercase">{settings.bank_transfer_details || 'Bank Account Info'}</p>}
                    {paymentMethod === 'MariBank' && <p className="text-primary font-black text-2xl tracking-[0.2em]">{settings.maribank_details || 'MariBank Info'}</p>}
                  </div>

                  {paymentMethod === 'GCash' && settings.gcash_qr_url && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-white p-3 rounded-2xl inline-block shadow-2xl mx-auto cursor-zoom-in"
                    >
                      <img src={getImageUrl(settings.gcash_qr_url)} alt="GCash QR" className="w-40 h-40 object-contain" />
                    </motion.div>
                  )}

                  {paymentMethod === 'Maya' && settings.maya_qr_url && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-white p-3 rounded-2xl inline-block shadow-2xl mx-auto cursor-zoom-in"
                    >
                      <img src={getImageUrl(settings.maya_qr_url)} alt="Maya QR" className="w-40 h-40 object-contain" />
                    </motion.div>
                  )}

                  <div className="pt-6 border-t border-white/5">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProofFile(e.target.files[0])}
                      className="hidden"
                      id="proof-upload"
                    />
                    <label
                      htmlFor="proof-upload"
                      className={`w-full flex items-center justify-center gap-4 p-5 rounded-2xl cursor-pointer transition-all border-2 border-dashed ${
                        proofFile ? 'bg-primary/20 border-primary text-primary' : 'bg-black/40 border-white/5 text-neutral/40 hover:border-primary/50'
                      }`}
                    >
                      <CardIcon size={20} />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {proofFile ? 'Update Receipt' : 'Attach Proof of Payment'}
                      </span>
                    </label>
                    {proofFile && <p className="text-[9px] text-primary mt-2 italic">File attached: {proofFile.name}</p>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loading || isSuccess}
            className="w-full bg-primary hover:bg-neutral text-secondary font-black py-7 rounded-[2rem] transition-all duration-500 uppercase text-xs tracking-[0.4em] shadow-2xl shadow-primary/20 flex items-center justify-center gap-4 group relative overflow-hidden"
          >
            <span className="relative z-10">{loading ? 'Processing manifest...' : 'Confirm Order Manifest'}</span>
            {!loading && <ArrowRightIcon className="relative z-10 group-hover:translate-x-2 transition-transform" />}
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
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
