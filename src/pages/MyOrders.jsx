import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Clock, CheckCircle, XCircle, ChevronRight, MapPin, Phone, Receipt, CreditCard, Hash, Calendar, ShoppingBag, Utensils, Truck, Star, Search, Navigation, Plus, Minus, PhoneCall } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import chefPreparing from '../assets/icons/chef_preparing.png';
import chefDeliver from '../assets/icons/chef_deliver.png';
import { useNotifications } from '../context/NotificationContext';
import { useCart } from '../context/CartContext';
import { API_BASE_URL, getImageUrl } from '../config';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showTracking, setShowTracking] = useState(false);
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const selectedOrderRef = useRef(null);
  const { addToCart, setIsCartOpen } = useCart();

  // Isogoods Location (Near Bher Electronics, Irosin)
  const ISOGOODS_COORDS = [12.70535, 124.03235];

  const [settings, setSettings] = useState(null);

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
  }, []);

  useEffect(() => {
    let mapInstance = null;
    let timer = null;

    // Check if we have the necessary data and the map library is loaded
    if (selectedOrder && window.L && settings) {
      timer = setTimeout(() => {
        if (!mapContainerRef.current) return;

        // Clean up existing map instance
        if (mapRef.current) {
          try {
            mapRef.current.remove();
          } catch (e) {
            console.warn("Error removing map instance:", e);
          }
          mapRef.current = null;
        }

        // Ensure the container is clean
        if (mapContainerRef.current._leaflet_id) {
          mapContainerRef.current._leaflet_id = null;
        }

        // Use dynamic coords from settings or fallback to default
        const RESTO_COORDS = settings.restaurant_lat && settings.restaurant_lng
            ? [parseFloat(settings.restaurant_lat), parseFloat(settings.restaurant_lng)]
            : [12.70535, 124.03235];

        try {
          // Initialize map with luxury settings
          mapInstance = window.L.map(mapContainerRef.current, {
            zoomControl: false,
            attributionControl: false,
            fadeAnimation: true,
            zoomAnimation: true,
            markerZoomAnimation: true,
            trackResize: true
          }).setView(RESTO_COORDS, 13);

          mapRef.current = mapInstance;
        } catch (e) {
          console.error("Failed to initialize map:", e);
          return;
        }

        // Premium Dark Mode Tiles
        window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 20,
            attribution: ''
        }).addTo(mapInstance);

        // Force a resize check immediately after tiles are added
        setTimeout(() => {
          if (mapInstance) mapInstance.invalidateSize();
        }, 100);

        const isogoodsIcon = window.L.divIcon({
          html: `
            <div class="relative">
                <div class="absolute -inset-4 bg-primary/20 rounded-full animate-ping"></div>
                <div class="w-10 h-10 bg-primary rounded-2xl border-2 border-white shadow-[0_0_20px_rgba(212,175,55,0.6)] flex items-center justify-center transform rotate-45 transition-transform hover:rotate-90 duration-700">
                    <div class="transform -rotate-45 font-playfair font-black text-secondary text-xs">ISO</div>
                </div>
            </div>`,
          className: 'custom-div-icon',
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        });

        window.L.marker(RESTO_COORDS, { icon: isogoodsIcon }).addTo(mapInstance).bindPopup('Isogoods Diner').openPopup();

        if (selectedOrder.lat && selectedOrder.lng && parseFloat(selectedOrder.lat) !== 0) {
          const custLat = parseFloat(selectedOrder.lat);
          const custLng = parseFloat(selectedOrder.lng);

          const customerIcon = window.L.divIcon({
            html: `
                <div class="relative">
                    <div class="absolute -inset-3 bg-blue-500/30 rounded-full animate-pulse"></div>
                    <div class="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-[0_0_15px_rgba(59,130,246,0.8)] flex items-center justify-center">
                        <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                </div>`,
            className: 'custom-div-icon',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });

          window.L.marker([custLat, custLng], { icon: customerIcon }).addTo(mapInstance).bindPopup('Your Location');

          // Fetch actual road route from OSRM
          fetch(`https://router.project-osrm.org/route/v1/driving/${RESTO_COORDS[1]},${RESTO_COORDS[0]};${custLng},${custLat}?overview=full&geometries=geojson`)
            .then(response => response.json())
            .then(data => {
              if (data.routes && data.routes.length > 0) {
                const routeCoords = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
                const distanceKm = (data.routes[0].distance / 1000).toFixed(1);

                // Glow Effect Line
                window.L.polyline(routeCoords, {
                  color: '#D4AF37',
                  weight: 12,
                  opacity: 0.1,
                  lineCap: 'round'
                }).addTo(mapInstance);

                // Main Branded Path
                const routeLine = window.L.polyline(routeCoords, {
                  color: '#D4AF37',
                  weight: 4,
                  dashArray: '1, 12',
                  lineCap: 'round',
                  opacity: 0.9
                }).addTo(mapInstance);

                // Floating Distance Badge on Map
                const midPoint = routeCoords[Math.floor(routeCoords.length / 2)];
                const distanceLabel = window.L.divIcon({
                    html: `<div class="bg-accent/80 backdrop-blur-md border border-primary/30 px-3 py-1 rounded-full text-[9px] font-black text-primary uppercase tracking-tighter whitespace-nowrap shadow-2xl">Distance: ${distanceKm} KM</div>`,
                    className: 'distance-label',
                    iconSize: [100, 20],
                    iconAnchor: [50, 40]
                });
                window.L.marker(midPoint, { icon: distanceLabel }).addTo(mapInstance);

                const isMobile = window.innerWidth < 768;
                mapInstance.fitBounds(routeLine.getBounds(), {
                  padding: isMobile ? [40, 40] : [80, 80],
                  animate: false
                });

                // ANIMATION: Rider moving along the road
                if (selectedOrder.status === 'delivering') {
                    const riderIcon = window.L.divIcon({
                        html: `
                            <div class="relative">
                                <div class="absolute -inset-2 bg-primary/40 rounded-full animate-ping"></div>
                                <div class="bg-white p-1.5 rounded-full shadow-2xl border-2 border-primary z-50">
                                    <img src="${chefDeliver}" class="w-6 h-6 object-contain" />
                                </div>
                            </div>`,
                        className: 'rider-icon',
                        iconSize: [32, 32],
                        iconAnchor: [16, 16]
                    });

                    const riderMarker = window.L.marker(RESTO_COORDS, { icon: riderIcon, zIndexOffset: 1000 }).addTo(mapInstance);

                    let posIndex = 0;
                    const moveRider = () => {
                        if (!mapInstance || !riderMarker || !selectedOrder) return;

                        posIndex = (posIndex + 1) % routeCoords.length;
                        const nextPos = routeCoords[posIndex];
                        riderMarker.setLatLng(nextPos);

                        // Slowly move through the route
                        setTimeout(moveRider, 100);
                    };
                    moveRider();
                }

                // Final size check after all layers added
                setTimeout(() => {
                  if (mapInstance) mapInstance.invalidateSize();
                }, 500);
              } else {
                // Fallback to straight line if routing fails
                const path = window.L.polyline([RESTO_COORDS, [custLat, custLng]], {
                  color: '#D4AF37',
                  weight: 3,
                  dashArray: '10, 10',
                  opacity: 0.8
                }).addTo(mapInstance);

                const isMobile = window.innerWidth < 768;
                mapInstance.fitBounds(path.getBounds(), {
                  padding: isMobile ? [30, 30] : [50, 50],
                  animate: false
                });
              }
            })
            .catch(err => {
              console.error("Routing error:", err);
              window.L.polyline([RESTO_COORDS, [custLat, custLng]], { color: '#D4AF37', weight: 3, dashArray: '10, 10' }).addTo(mapInstance);
            });
        }

        mapInstance.invalidateSize();
      }, 800);
    }

    return () => {
      if (timer) clearTimeout(timer);
      if (mapRef.current) {
        try {
          mapRef.current.off();
          mapRef.current.remove();
        } catch (e) {
          console.warn("Map cleanup error:", e);
        }
        mapRef.current = null;
      }
    };
  }, [selectedOrder?.order_group_id || selectedOrder?.id]);

  useEffect(() => {
    selectedOrderRef.current = selectedOrder;
  }, [selectedOrder]);

  const [reviewingOrder, setReviewingOrder] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
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

        // If the modal is open, update the selectedOrder from the fresh data
        if (selectedOrderRef.current) {
          // Re-group the fresh data to find the updated version of the current group
          const freshGroups = data.reduce((acc, order) => {
            const groupId = order.order_group_id || `SINGLE-${order.id}`;
            if (!acc[groupId]) {
              acc[groupId] = { ...order, items: [] };
            }
            acc[groupId].items.push(order);
            return acc;
          }, {});

          const currentGroupId = selectedOrderRef.current.order_group_id || `SINGLE-${selectedOrderRef.current.id}`;
          if (freshGroups[currentGroupId]) {
            setSelectedOrder(freshGroups[currentGroupId]);
          }
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

  const submitReview = async (orderId) => {
      if (rating === 0) {
          alert("Please select a rating.");
          return;
      }

      setSubmittingReview(true);
      try {
          const res = await fetch(`${API_BASE_URL}/submit_review.php`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  user_id: user.id,
                  order_id: orderId,
                  rating,
                  comment
              })
          });
          const data = await res.json();
          if (res.ok) {
              addNotification('Review Submitted', 'Thank you for your feedback!', 'success');
              setReviewingOrder(null);
              setRating(0);
              setComment('');
          } else {
              throw new Error(data.message || 'Failed to submit review');
          }
      } catch (err) {
          console.error(err);
          alert(err.message || "Failed to submit review.");
      } finally {
          setSubmittingReview(false);
      }
  };

  const handleReorder = (order) => {
    order.items.forEach(item => {
      // Create a reconstructed product object for the cart
      const product = {
        id: item.product_id,
        name: item.product_name,
        image: item.product_image,
        price: item.price,
        variants: [] // The item.price already accounts for the variant in the order record
      };

      const variant = item.variant_name && item.variant_name !== 'Standard'
        ? { label: item.variant_name, price: item.price }
        : null;

      // Force quantity from previous order
      for(let i = 0; i < (item.quantity || 1); i++) {
        addToCart(product, variant);
      }
    });
    addNotification('Cart Updated', 'Previous order items added to your cart!', 'success');
    setIsCartOpen(true);
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
                        <img src={getImageUrl(order.items[0].product_image)} alt={order.items[0].product_name} className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${order.status === 'preparing' ? 'opacity-40 blur-[2px]' : ''}`} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral/10"><Package size={32} /></div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{order.order_group_id || `#ORD-${order.id}`}</span>
                        <div className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest border border-primary/20">
                          {order.order_type || 'Delivery'}
                        </div>
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
                        <div className="flex flex-col">
                           <span className="text-primary font-black uppercase">Total: ₱{order.items.reduce((total, item) => total + (item.quantity * (item.price || 0)), 0)}</span>
                           {order.items.reduce((total, item) => total + parseFloat(item.balance_amount || 0), 0) > 0 && (
                             <span className="text-rose-500 font-black uppercase text-[8px] animate-pulse">Balance: ₱{order.items.reduce((total, item) => total + parseFloat(item.balance_amount || 0), 0)}</span>
                           )}
                        </div>
                      </div>

                      {order.status === 'completed' && (
                        <div className="pt-2">
                           <button
                             onClick={(e) => {
                               e.stopPropagation();
                               setReviewingOrder(order.id);
                             }}
                             className="flex items-center gap-2 text-primary hover:text-white transition-colors"
                           >
                             <Star size={14} className="fill-primary" />
                             <span className="text-[10px] font-black uppercase tracking-widest">Rate this experience</span>
                           </button>
                        </div>
                      )}
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

      {/* Order Details & Tracking Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-0 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setSelectedOrder(null); setShowTracking(false); }}
              className="absolute inset-0 bg-secondary/95 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="relative z-10 w-full max-w-lg md:max-w-6xl bg-accent h-full md:h-[85vh] md:rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-6 md:p-8 flex justify-between items-center border-b border-white/5 bg-accent/50 backdrop-blur-md sticky top-0 z-20 shrink-0">
                <button onClick={() => { setSelectedOrder(null); setShowTracking(false); }} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <ChevronRight className="rotate-180" size={24} />
                </button>
                <div className="text-center">
                  <h2 className="text-lg font-bold text-neutral uppercase tracking-widest">Order Tracking</h2>
                  <p className="text-[10px] text-primary font-black tracking-[0.3em] uppercase">Manifest #ORD-{selectedOrder.id}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-white/5 rounded-full transition-colors"><Search size={20} /></button>
                </div>
              </div>

              <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0 relative">
                {/* Left Side: Map (The "Whole" Desktop View) */}
                <div className="w-full md:w-3/5 h-[40vh] md:h-full relative bg-[#0d1117] border-b md:border-b-0 md:border-r border-white/5 overflow-hidden shrink-0">
                   <div ref={mapContainerRef} className="absolute inset-0 z-0 bg-[#0d1117]"></div>
                   {!selectedOrder.lat && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-10 p-10 text-center">
                        <div className="max-w-xs space-y-4">
                          <MapPin size={32} className="text-primary/20 mx-auto" />
                          <p className="text-neutral/40 text-[9px] uppercase font-bold tracking-[0.2em] leading-relaxed">
                            Awaiting precise GPS telemetry.
                          </p>
                        </div>
                      </div>
                   )}

                   {/* Map Floating Status Indicator (Desktop only) */}
                   <div className="hidden md:block absolute top-6 left-6 z-10">
                      <div className="bg-accent/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                         <span className="text-[9px] font-black uppercase text-neutral tracking-widest">Live GPS Signal Active</span>
                      </div>
                   </div>
                </div>

                {/* Right Side: Tracking Details & Timeline */}
                <div className="w-full md:w-2/5 flex flex-col overflow-y-auto no-scrollbar bg-accent/40 relative">

                  {/* Rider Info Card */}
                  <div className="px-6 mt-4 md:mt-8 relative z-30">
                    <div className="bg-primary p-4 md:p-6 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-secondary/20 flex items-center justify-center overflow-hidden border border-white/20">
                          <img src={chefDeliver} alt="Rider" className="w-7 h-7 md:w-10 md:h-10 object-contain" />
                        </div>
                        <div>
                          <h3 className="font-black uppercase text-[10px] md:text-xs tracking-widest text-secondary">Kuya Rider</h3>
                          <p className="text-[8px] md:text-[9px] font-bold text-secondary/60">Express Delivery Partner</p>
                        </div>
                      </div>
                      <a href={`tel:${selectedOrder.phone_number}`} className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl md:rounded-2xl flex items-center justify-center text-secondary hover:bg-white hover:text-primary transition-all backdrop-blur-md border border-white/10">
                        <PhoneCall size={18} />
                      </a>
                    </div>
                  </div>

                  {/* Order Manifest / Items List */}
                  <div className="px-6 mt-6 md:mt-8">
                    <div className="bg-secondary/20 backdrop-blur-md border border-white/5 rounded-[2rem] p-6 overflow-hidden">
                        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                            <h4 className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">Order Manifest</h4>
                            <span className="text-[9px] font-bold text-neutral/40 uppercase">{selectedOrder.items.length} {selectedOrder.items.length === 1 ? 'Item' : 'Items'}</span>
                        </div>
                        <div className="space-y-4 max-h-[250px] overflow-y-auto no-scrollbar">
                            {selectedOrder.items.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between gap-4 group/item">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-black/40 border border-white/5 overflow-hidden shrink-0">
                                            {item.product_image ? (
                                                <img src={getImageUrl(item.product_image)} alt={item.product_name} className="w-full h-full object-cover opacity-80 group-hover/item:opacity-100 transition-opacity" />
                                            ) : <ShoppingBag size={14} className="m-auto mt-3 text-white/10" />}
                                        </div>
                                        <div>
                                            <h5 className="text-[10px] font-bold text-neutral uppercase tracking-wider">{item.product_name}</h5>
                                            <div className="flex flex-col gap-0.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[8px] font-black text-primary uppercase">x{item.quantity}</span>
                                                    {item.variant_name && item.variant_name !== 'Standard' && (
                                                        <span className="text-[8px] text-neutral/40 italic">({item.variant_name})</span>
                                                    )}
                                                </div>
                                                {parseFloat(item.balance_amount) > 0 && (
                                                  <div className="flex gap-2 text-[7px] uppercase font-bold">
                                                    <span className="text-emerald-500">Paid: ₱{parseFloat(item.amount_paid).toFixed(0)}</span>
                                                    <span className="text-rose-500">Bal: ₱{parseFloat(item.balance_amount).toFixed(0)}</span>
                                                  </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-black text-neutral/60">₱{item.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                            <span className="text-[9px] font-black uppercase text-neutral/40 tracking-widest">Subtotal</span>
                            <span className="text-sm font-black text-primary">₱{selectedOrder.items.reduce((total, item) => total + (item.quantity * (item.price || 0)), 0)}</span>
                        </div>
                    </div>
                  </div>

                  {/* Tracking Steps Timeline */}
                  <div className="px-8 md:px-10 py-8 md:py-12 space-y-8 md:space-y-12">
                    {[
                      { s: 'pending', l: 'Order Placed', t: 'We have received your order.', i: <Package size={18} />, active: ['pending', 'preparing', 'delivering', 'completed'].includes(selectedOrder.status) },
                      { s: 'preparing', l: 'Preparing', t: 'Our chefs are crafting your feast.', i: <Utensils size={18} />, active: ['preparing', 'delivering', 'completed'].includes(selectedOrder.status) },
                      { s: 'delivering', l: 'On the way', t: 'Rider is navigating to your coordinates.', i: <Truck size={18} />, active: ['delivering', 'completed'].includes(selectedOrder.status) },
                      { s: 'completed', l: 'Delivered', t: `Arrived at: ${selectedOrder.address}`, i: <CheckCircle size={18} />, active: selectedOrder.status === 'completed' }
                    ].map((step, idx, arr) => (
                      <div key={idx} className="flex gap-4 md:gap-6 relative group">
                        {idx !== arr.length - 1 && (
                          <div className={`absolute left-[19px] md:left-[23px] top-[40px] md:top-[50px] bottom-[-38px] md:bottom-[-48px] w-0.5 border-l-2 border-dashed transition-colors duration-1000 ${step.active && arr[idx+1].active ? 'border-primary' : 'border-white/10'}`}></div>
                        )}

                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-700 shrink-0 ${
                          step.active ? 'bg-primary text-secondary shadow-lg shadow-primary/20 scale-110' : 'bg-secondary/40 text-neutral/10 border border-white/5'
                        }`}>
                          {step.i}
                        </div>

                        <div className="space-y-0.5 md:space-y-1 pt-1">
                          <h4 className={`font-black uppercase text-[10px] md:text-[11px] tracking-widest transition-colors duration-700 ${step.active ? 'text-neutral' : 'text-neutral/20'}`}>{step.l}</h4>
                          <p className={`text-[9px] md:text-[10px] font-medium leading-relaxed transition-colors duration-700 ${step.active ? 'text-neutral/40' : 'text-neutral/10'}`}>{step.t}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Spacer for mobile bottom card */}
                  <div className="h-32 md:h-10" />
                </div>
              </div>

              {/* Order Summary Floating Bar */}
              <div className="p-3 md:p-6 bg-accent/80 backdrop-blur-3xl border-t border-white/5 z-40 shrink-0">
                <div className="bg-secondary/60 border border-white/5 p-4 md:p-5 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-between gap-4 md:gap-6 shadow-2xl">
                   <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-14 md:h-14 bg-accent rounded-xl md:rounded-2xl overflow-hidden border border-white/5 p-1">
                        {selectedOrder.items[0]?.product_image ? (
                           <img src={getImageUrl(selectedOrder.items[0].product_image)} alt="Order" className="w-full h-full object-cover rounded-lg md:rounded-xl" />
                        ) : <ShoppingBag className="w-full h-full p-2 md:p-4 text-white/20" />}
                      </div>
                      <div>
                        <h4 className="font-black uppercase text-[9px] md:text-[11px] text-neutral tracking-widest line-clamp-1">{selectedOrder.items[0]?.product_name}</h4>
                        <p className="text-[8px] md:text-[10px] font-bold text-primary uppercase">Total: ₱{selectedOrder.items.reduce((total, item) => total + (item.quantity * (item.price || 0)), 0)}</p>
                      </div>
                   </div>
                   <div className="flex gap-2 md:gap-3">
                      {selectedOrder.status === 'completed' && (
                        <>
                          <button
                            onClick={() => handleReorder(selectedOrder)}
                            className="hidden sm:block px-4 md:px-6 py-2 md:py-3 bg-white/5 hover:bg-white/10 text-neutral rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all border border-white/5"
                          >
                            Reorder
                          </button>
                          <button
                            onClick={() => setReviewingOrder(selectedOrder.id)}
                            className="px-4 md:px-6 py-2 md:py-3 bg-primary text-secondary rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20 border border-primary hover:bg-transparent hover:text-primary"
                          >
                            Rate
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => { setSelectedOrder(null); setShowTracking(false); }}
                        className="px-4 md:px-6 py-2 md:py-3 bg-white/5 hover:bg-primary text-neutral hover:text-secondary rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all border border-white/5 hover:border-primary"
                      >
                        Close
                      </button>
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
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative z-10 w-full max-w-lg bg-accent border border-white/10 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-12 text-center shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">

                      <div className="mb-6 md:mb-8">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6 border border-primary/20">
                            <Star className="text-primary fill-primary/20" size={32} />
                        </div>
                        <h3 className="text-xl md:text-2xl font-playfair font-bold text-neutral italic mb-2 md:mb-3">Customer <span className="text-primary not-italic">Survey</span></h3>
                        <p className="text-neutral/60 text-[10px] md:text-xs leading-relaxed max-w-[240px] md:max-w-xs mx-auto">
                            We'd love to hear about your experience. Please take a minute to answer our quick survey:
                        </p>
                      </div>

                      <div className="space-y-6 md:space-y-8">
                        {/* Question 1 */}
                        <div className="space-y-3 md:space-y-4">
                            <p className="text-[9px] md:text-[10px] font-black uppercase text-primary tracking-widest flex items-center justify-center gap-2">
                                <span className="w-3 h-px bg-primary/20"></span>
                                ⭐ How would you rate your experience?
                                <span className="w-3 h-px bg-primary/20"></span>
                            </p>
                            <div className="flex justify-center gap-3 md:gap-4">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button key={star} onClick={() => setRating(star)} className={`transition-all duration-300 transform hover:scale-125 ${rating >= star ? 'text-primary' : 'text-neutral/10'}`}>
                                        <Star size={28} md:size={36} fill={rating >= star ? 'currentColor' : 'none'} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Question 2 & 3 */}
                        <div className="space-y-4 text-left">
                            <p className="text-[9px] md:text-[10px] font-black uppercase text-primary tracking-widest text-center flex items-center justify-center gap-2">
                                <span className="w-3 h-px bg-primary/20"></span>
                                ⭐ Expectations & Improvements
                                <span className="w-3 h-px bg-primary/20"></span>
                            </p>

                            <div className="bg-secondary/40 border border-white/5 rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 space-y-4">
                                <div className="space-y-2 text-center">
                                    <p className="text-[8px] md:text-[9px] font-bold text-neutral/40 uppercase tracking-widest leading-relaxed">Did the item meet your expectations? & Anything we can improve?</p>
                                    <textarea
                                        placeholder="Tell us what you loved or how we can do better..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-5 text-neutral text-sm focus:border-primary outline-none min-h-[100px] md:min-h-[120px] transition-all"
                                    />
                                </div>
                            </div>

                            <p className="text-[8px] md:text-[9px] text-neutral/30 italic text-center leading-relaxed">
                                Your feedback helps us improve our products and service.<br/>Thank you for choosing us!
                            </p>
                        </div>
                      </div>

                      <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-4 mt-8 md:mt-10">
                          <button
                            onClick={() => {
                                setReviewingOrder(null);
                                setRating(0);
                                setComment('');
                            }}
                            className="w-full md:flex-1 py-4 text-neutral/40 font-black uppercase text-[10px] tracking-widest hover:text-neutral transition-colors"
                          >
                            Dismiss
                          </button>
                          <button
                            onClick={() => submitReview(reviewingOrder)}
                            disabled={submittingReview || rating === 0}
                            className="w-full md:flex-1 bg-primary text-secondary py-4 rounded-xl md:rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 disabled:opacity-20 transition-all hover:bg-white"
                          >
                            {submittingReview ? 'Sending...' : 'Submit Survey'}
                          </button>
                      </div>
                  </motion.div>
              </div>
          )}
      </AnimatePresence>
    </div>
  );
};

export default MyOrders;
