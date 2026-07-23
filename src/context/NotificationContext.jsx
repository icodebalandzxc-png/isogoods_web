import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle, Clock, Utensils, XCircle, Info, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import chefPreparing from '../assets/icons/chef_preparing.png';
import chefDeliver from '../assets/icons/chef_deliver.png';
import { API_BASE_URL } from '../config';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

const NOTIFICATION_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : [];
  });
  const [unreadCount, setUnreadCount] = useState(() => {
    const saved = localStorage.getItem('notifications');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.filter(n => !n.read).length;
    }
    return 0;
  });
  const [toast, setToast] = useState(null);
  const prevOrdersRef = useRef({});
  const audioRef = useRef(new Audio(NOTIFICATION_SOUND_URL));

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const showToast = (title, message, type = 'info', orderId = null) => {
    setToast({ title, message, type, orderId });
    setTimeout(() => setToast(null), 5000);
  };

  const addNotification = (title, message, type = 'info', orderId = null) => {
    const newNotif = {
      id: Date.now(),
      title,
      message,
      type,
      orderId,
      time: new Date(),
      read: false
    };

    // Play sound
    try {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log("Audio play failed", e));
    } catch (e) {}

    setNotifications(prev => [newNotif, ...prev].slice(0, 50)); // Keep last 50
    setUnreadCount(prev => prev + 1);
    showToast(title, message, type, orderId);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const checkOrderUpdates = async () => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;

    const user = JSON.parse(storedUser);
    if (user.role === 'admin') return;

    try {
      const timestamp = new Date().getTime();
      const res = await fetch(`${API_BASE_URL}/get_user_orders.php?user_id=${user.id}&t=${timestamp}`);
      const orders = await res.json();

      if (Array.isArray(orders)) {
        orders.forEach(order => {
          const prevStatus = prevOrdersRef.current[order.id];

          if (prevStatus && prevStatus !== order.status) {
            // Status changed!
            let title = 'Order Update';
            let message = `Your order for ${order.product_name} is now ${order.status.toUpperCase()}!`;
            let type = 'info';

            if (order.status === 'preparing') {
              title = 'Chef is Cooking!';
              message = `Great news! We've started preparing your ${order.product_name}.`;
              type = 'preparing';
            } else if (order.status === 'delivering') {
              title = 'Order Out for Delivery!';
              message = `Your ${order.product_name} is on its way to you!`;
              type = 'delivering';
            } else if (order.status === 'completed') {
              title = 'Order Completed!';
              message = `Your ${order.product_name} is ready or has been delivered. Enjoy!`;
              type = 'success';
            } else if (order.status === 'cancelled') {
              title = 'Order Cancelled';
              message = `Unfortunately, your order for ${order.product_name} was cancelled.`;
              type = 'error';
            }

            addNotification(title, message, type, order.id);
          }

          // Update ref
          prevOrdersRef.current[order.id] = order.status;
        });
      }
    } catch (error) {
      console.error('Error polling for notifications:', error);
    }
  };

  useEffect(() => {
    // Initial load of order statuses to prevent notifying about old orders
    const init = async () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            try {
                const res = await fetch(`${API_BASE_URL}/get_user_orders.php?user_id=${user.id}`);
                const orders = await res.json();
                if (Array.isArray(orders)) {
                    orders.forEach(o => { prevOrdersRef.current[o.id] = o.status; });
                }
            } catch (e) {}
        }
    };
    init();

    const interval = setInterval(checkOrderUpdates, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="text-green-500 w-8 h-8" />;
      case 'preparing': return <img src={chefPreparing} alt="Chef" className="w-14 h-14 object-contain animate-bounce" />;
      case 'delivering': return <img src={chefDeliver} alt="Chef" className="w-14 h-14 object-contain animate-pulse" />;
      case 'error': return <XCircle className="text-red-500 w-8 h-8" />;
      default: return <Bell className="text-primary w-8 h-8" />;
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAllAsRead,
      clearNotifications,
      addNotification
    }}>
      {children}

      <NotificationToast toast={toast} setToast={setToast} getIcon={getIcon} />
    </NotificationContext.Provider>
  );
};

const NotificationToast = ({ toast, setToast, getIcon }) => {
    const navigate = useNavigate();

    const handleToastClick = () => {
        if (toast?.orderId) {
            navigate('/orders');
            setToast(null);
        }
    };

    return (
        <AnimatePresence>
            {toast && (
                <motion.div
                    initial={{ opacity: 0, y: -50, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: -50, x: '-50%' }}
                    onClick={handleToastClick}
                    className={`fixed top-28 left-1/2 z-[300] w-[95%] max-w-[550px] ${toast.orderId ? 'cursor-pointer' : ''}`}
                >
                    <div className="bg-secondary/95 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl flex items-center gap-8 group">
                        <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            {getIcon(toast.type)}
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-black text-primary uppercase tracking-[0.25em] mb-2">{toast.title}</h4>
                            <p className="text-neutral text-base leading-relaxed font-medium">{toast.message}</p>
                            {toast.orderId && (
                                <p className="text-[10px] text-primary/50 font-black uppercase mt-2 tracking-widest">Click to view order status</p>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
