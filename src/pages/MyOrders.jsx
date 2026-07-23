import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Clock, CheckCircle, XCircle, ChevronRight, MapPin, Phone, Receipt, CreditCard, Hash, Calendar, ShoppingBag, Utensils, Truck, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import chefPreparing from '../assets/icons/chef_preparing.png';
import chefDeliver from '../assets/icons/chef_deliver.png';
import { useNotifications } from '../context/NotificationContext';
import { API_BASE_URL } from '../config';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reviewingOrder, setReviewingOrder] = useState(null);
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    // Initial fetch
    fetchOrders(parsedUser.id);

    // Set up polling for real-time updates
    const interval = setInterval(() => {
        fetchOrders(parsedUser.id);
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [navigate]);

  const fetchOrders = async (userId) => {
    try {
      const timestamp = new Date().getTime();
      const res = await fetch(`${API_BASE_URL}/get_user_orders.php?user_id=${userId}&t=${timestamp}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);

        // If the modal is open, update the selectedOrder data too
        if (selectedOrder) {
            const updated = data.find(o => o.id === selectedOrder.id);
            if (updated) setSelectedOrder(updated);
        }
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="text-yellow-500" size={18} />;
      case 'preparing': return <Utensils className="text-blue-500 animate-bounce" size={18} />;
      case 'delivering': return <Truck className="text-purple-500 animate-pulse" size={18} />;
      case 'completed': return <CheckCircle className="text-green-500" size={18} />;
      case 'cancelled': return <XCircle className="text-red-500" size={18} />;
      default: return <Package className="text-blue-500" size={18} />;
    }
  };

  const getETA = (order) => {
    if (order.status === 'completed' || order.status === 'cancelled') return null;
    if (order.status === 'delivering') return 'Arriving soon!';
    if (order.status === 'preparing') return '15-20 mins';
    return 'Pending confirmation';
  };

  const submitReview = (orderId) => {
      addNotification('Review Submitted', 'Thank you for your feedback!', 'success');
      setReviewingOrder(null);
      setRating(0);
  };

  const groupedOrders = orders.reduce((acc, order) => {
    const groupId = order.order_group_id || `SINGLE-${order.id}`;
    if (!acc[groupId]) {
      acc[groupId] = {
        ...order,
        items: []
      };
    }
    acc[groupId].items.push(order);
    return acc;
  }, {});

  const ordersToDisplay = Object.values(groupedOrders);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-accent pt-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-accent pt-32 pb-20 px-4 font-poppins">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-5xl font-playfair font-bold text-neutral italic mb-4">
            Order <span className="text-primary not-italic">History</span>
          </h1>
          <p className="text-neutral/40 text-sm tracking-widest uppercase">Track your feasts and past experiences.</p>
        </header>

        {ordersToDisplay.length === 0 ? (
          <div className="bg-secondary/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-20 text-center">
            <Package size={48} className="text-neutral/10 mx-auto mb-6" />
            <p className="text-neutral/40 italic font-playfair text-xl">You haven't placed any orders yet.</p>
            <button
              onClick={() => navigate('/menu')}
              className="mt-8 btn-primary px-8 py-3 uppercase text-[10px] tracking-widest font-black"
            >
              Start Exploring Menu
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {ordersToDisplay.map((order) => (
              <motion.div
                key={order.order_group_id || order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedOrder(order)}
                className="bg-secondary/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 md:p-8 hover:bg-secondary/60 transition-all group cursor-pointer"
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex items-start gap-6">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-black/20 border border-white/5 relative">
                      {order.status === 'preparing' ? (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center z-10">
                          <img src={chefPreparing} alt="Preparing" className="w-12 h-12 object-contain animate-bounce" />
                        </div>
                      ) : order.status === 'delivering' ? (
                        <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center z-10">
                          <img src={chefDeliver} alt="Delivering" className="w-12 h-12 object-contain animate-pulse" />
                        </div>
                      ) : null}
                      {order.items[0]?.product_image ? (
                        <img src={order.items[0].product_image} alt={order.items[0].product_name} className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${order.status === 'preparing' ? 'opacity-40 blur-[2px]' : ''}`} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral/10"><Package size={32} /></div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{order.order_group_id || `#ORD-${order.id}`}</span>
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 border border-white/5 text-[9px] font-black uppercase tracking-widest ${
                          order.status === 'pending' ? 'text-yellow-500' :
                          order.status === 'preparing' ? 'text-blue-500' :
                          order.status === 'delivering' ? 'text-purple-500' :
                          order.status === 'completed' ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-neutral uppercase tracking-tight">
                        {order.items.length > 1 ? `${order.items[0].product_name} & ${order.items.length - 1} more items` : order.items[0].product_name}
                      </h3>
                      <div className="flex items-center gap-4 text-[10px] text-neutral/40 font-medium">
                        <span className="flex items-center gap-1"><Clock size={12} /> {new Date(order.order_date).toLocaleDateString()}</span>
                        <span className="text-primary font-black uppercase">₱{order.items.reduce((total, item) => total + (item.quantity * (item.price || 0)), 0)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-end border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-8">
                     <div className="text-right space-y-3">
                        <div className="flex items-center justify-end gap-2 text-[10px] text-neutral/40">
                           <MapPin size={12} className="text-primary" />
                           <span className="max-w-[150px] truncate">{order.address}</span>
                        </div>
                        <div className="flex items-center justify-end gap-2 text-[10px] text-neutral/40">
                           <Phone size={12} className="text-primary" />
                           <span>{order.phone_number || 'N/A'}</span>
                        </div>
                     </div>
                     <div className="flex items-center gap-2 text-[9px] font-black text-primary uppercase tracking-[0.2em] mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details <ChevronRight size={14} />
                     </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-secondary/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative z-10 w-full max-w-2xl bg-accent border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 md:p-12 overflow-y-auto max-h-[90vh] no-scrollbar">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Manifest Details</span>
                    <h2 className="text-3xl font-playfair font-bold text-neutral italic mt-1">Order <span className="text-primary not-italic">#ORD-{selectedOrder.id}</span></h2>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] ${
                    selectedOrder.status === 'pending' ? 'text-yellow-500' :
                    selectedOrder.status === 'preparing' ? 'text-blue-500' :
                    selectedOrder.status === 'delivering' ? 'text-purple-500' :
                    selectedOrder.status === 'completed' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {getStatusIcon(selectedOrder.status)}
                    {selectedOrder.status}
                  </div>
                </div>

                {/* Real-time Progress Tracker */}
                <div className="mb-12 px-4">
                  <div className="flex justify-between items-center relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2 z-0"></div>
                    <div className={`absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-1000`} style={{
                      width: selectedOrder.status === 'pending' ? '0%' :
                             selectedOrder.status === 'preparing' ? '33%' :
                             selectedOrder.status === 'delivering' ? '66%' :
                             selectedOrder.status === 'completed' ? '100%' : '0%'
                    }}></div>

                    {[
                      { s: 'pending', i: <Clock size={16} />, l: 'Order Placed' },
                      { s: 'preparing', i: <Utensils size={16} />, l: 'Preparing' },
                      { s: 'delivering', i: <Truck size={16} />, l: 'Out for Delivery' },
                      { s: 'completed', i: <CheckCircle size={16} />, l: 'Delivered' }
                    ].map((step, idx) => {
                      const isActive = selectedOrder.status === step.s;
                      const isPast = ['pending', 'preparing', 'delivering', 'completed'].indexOf(selectedOrder.status) >= idx;

                      return (
                        <div key={step.s} className="relative z-10 flex flex-col items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                            isActive ? 'bg-primary border-primary text-accent scale-125 shadow-lg shadow-primary/30' :
                            isPast ? 'bg-secondary border-primary text-primary' : 'bg-secondary border-white/10 text-neutral/20'
                          }`}>
                            {step.i}
                          </div>
                          <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-primary' : isPast ? 'text-neutral' : 'text-neutral/20'}`}>
                            {step.l}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  {getETA(selectedOrder) && (
                      <div className="mt-8 text-center bg-primary/5 border border-primary/10 py-3 rounded-2xl">
                          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Estimated Arrival: <span className="text-neutral ml-2">{getETA(selectedOrder)}</span></p>
                      </div>
                  )}
                </div>

                <div className="space-y-8">
                  {/* Products Section */}
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-6 p-6 bg-secondary/30 rounded-[2rem] border border-white/5 relative overflow-hidden">
                        {selectedOrder.status === 'preparing' && idx === 0 && (
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 w-24 h-24 opacity-20 pointer-events-none">
                                <img src={chefPreparing} alt="Chef" className="w-full h-full object-contain animate-pulse" />
                            </div>
                        )}
                        {selectedOrder.status === 'delivering' && idx === 0 && (
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 w-24 h-24 opacity-20 pointer-events-none">
                                <img src={chefDeliver} alt="Chef" className="w-full h-full object-contain animate-bounce" />
                            </div>
                        )}
                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-black/20 border border-white/5 relative">
                          {selectedOrder.status === 'preparing' && (
                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center z-10">
                               <img src={chefPreparing} alt="Preparing" className="w-14 h-14 object-contain animate-bounce" />
                            </div>
                          )}
                          {selectedOrder.status === 'delivering' && (
                            <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center z-10">
                               <img src={chefDeliver} alt="Delivering" className="w-14 h-14 object-contain animate-pulse" />
                            </div>
                          )}
                          {item.product_image ? (
                            <img src={item.product_image} alt={item.product_name} className={`w-full h-full object-cover ${selectedOrder.status === 'preparing' ? 'opacity-40 blur-[1px]' : ''}`} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral/10"><ShoppingBag size={32} /></div>
                          )}
                        </div>
                        <div className="relative z-20">
                          <h3 className="text-xl font-bold text-neutral uppercase tracking-tight">{item.product_name}</h3>
                          <span className="text-[9px] text-primary font-black uppercase tracking-tighter block mb-1">{item.variant_name || 'Standard'}</span>
                          <p className="text-primary font-black text-sm uppercase tracking-widest">Qty: {item.quantity} × ₱{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] font-black text-neutral/30 uppercase tracking-widest"><Calendar size={14} className="text-primary" /> Date of Order</label>
                        <p className="text-neutral font-medium text-sm pl-6">{new Date(selectedOrder.order_date).toLocaleString()}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] font-black text-neutral/30 uppercase tracking-widest"><CreditCard size={14} className="text-primary" /> Payment Method</label>
                        <p className="text-neutral font-bold text-sm pl-6 uppercase tracking-widest">{selectedOrder.payment_method}</p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] font-black text-neutral/30 uppercase tracking-widest"><Phone size={14} className="text-primary" /> Contact Number</label>
                        <p className="text-neutral font-medium text-sm pl-6">{selectedOrder.phone_number || 'N/A'}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] font-black text-neutral/30 uppercase tracking-widest"><MapPin size={14} className="text-primary" /> Delivery Address</label>
                        <p className="text-neutral font-medium text-sm pl-6 leading-relaxed">{selectedOrder.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Proof of Payment Section */}
                  {selectedOrder.payment_method === 'GCash' && (
                    <div className="space-y-4 pt-6 border-t border-white/5">
                      <label className="flex items-center gap-2 text-[10px] font-black text-neutral/30 uppercase tracking-widest"><Receipt size={14} className="text-primary" /> Proof of Payment</label>
                      {selectedOrder.proof_of_payment ? (
                        <div className="w-full h-48 rounded-[2rem] overflow-hidden border border-white/5 bg-black/20">
                          <img src={selectedOrder.proof_of_payment} alt="GCash Receipt" className="w-full h-full object-contain p-2" />
                        </div>
                      ) : (
                        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
                          <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">No receipt uploaded for this transaction</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Order Summary */}
                  <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                      <p className="text-neutral/30 text-[10px] uppercase tracking-widest mb-1">Total Amount</p>
                      <p className="text-4xl font-black text-primary tracking-tighter">
                        ₱{selectedOrder.items.reduce((total, item) => total + (item.quantity * item.price), 0)}
                      </p>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        {selectedOrder.status === 'completed' && (
                            <button
                                onClick={() => setReviewingOrder(selectedOrder.id)}
                                className="flex-1 md:flex-none bg-primary text-secondary px-8 py-3 rounded-full transition-all font-black uppercase tracking-widest text-[10px] border border-primary hover:bg-transparent hover:text-primary"
                            >
                                Rate Experience
                            </button>
                        )}
                        <button
                        onClick={() => setSelectedOrder(null)}
                        className="flex-1 md:flex-none bg-white/5 hover:bg-primary text-neutral hover:text-secondary px-8 py-3 rounded-full transition-all font-black uppercase tracking-widest text-[10px] border border-white/10 hover:border-primary"
                        >
                        Close Details
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Review Modal */}
      <AnimatePresence>
          {reviewingOrder && (
              <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-secondary/95 backdrop-blur-xl" onClick={() => setReviewingOrder(null)} />
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative z-10 w-full max-w-md bg-accent border border-white/10 rounded-[3rem] p-10 text-center">
                      <h3 className="text-2xl font-playfair font-bold text-neutral italic mb-2">How was your <span className="text-primary not-italic">feast?</span></h3>
                      <p className="text-neutral/40 text-[10px] uppercase tracking-widest mb-8">Your feedback helps us cook better.</p>

                      <div className="flex justify-center gap-4 mb-8">
                          {[1, 2, 3, 4, 5].map(star => (
                              <button key={star} onClick={() => setRating(star)} className={`transition-all ${rating >= star ? 'text-primary scale-125' : 'text-neutral/10'}`}>
                                  <Star size={32} fill={rating >= star ? 'currentColor' : 'none'} />
                              </button>
                          ))}
                      </div>

                      <textarea
                          placeholder="Share your thoughts (optional)..."
                          className="w-full bg-secondary border border-white/10 rounded-2xl p-4 text-neutral text-sm mb-8 focus:border-primary outline-none min-h-[100px]"
                      />

                      <div className="flex gap-4">
                          <button onClick={() => setReviewingOrder(null)} className="flex-1 py-4 text-neutral/40 font-black uppercase text-[10px] tracking-widest">Cancel</button>
                          <button onClick={() => submitReview(reviewingOrder)} className="flex-1 bg-primary text-secondary py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20">Submit Review</button>
                      </div>
                  </motion.div>
              </div>
          )}
      </AnimatePresence>
    </div>
  );
};

export default MyOrders;
