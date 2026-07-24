import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Utensils,
  Settings,
  Save,
  Plus,
  RefreshCw,
  Trash2,
  PlusCircle,
  LayoutDashboard,
  ClipboardList,
  ChevronRight,
  Edit3,
  Upload,
  Search,
  Filter,
  Sparkles,
  Send,
  Image as ImageIcon,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  PackageCheck,
  PackageX,
  Calendar,
  DollarSign,
  ShoppingCart,
  Users,
  Bell,
  MoreVertical,
  ArrowUpRight,
  Receipt
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, AreaChart, Area } from 'recharts';
import { API_BASE_URL, getImageUrl } from '../config';

const API_BASE = API_BASE_URL;

const MENU_CATEGORIES = [
  "Pasta", "Pancit or Bihon", "Lomi", "Breakfast", "Sandwich", "Fries",
  "Lutong Bahay", "Chix Rice Meal", "Sizzling Plates", "Takoyaki",
  "Beverages", "Cold Brew", "Dessert", "Shake", "Bilao"
];

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [settings, setSettings] = useState({
    gcash_number: '',
    gcash_qr_url: '',
    receiver_name: '',
    bank_transfer_details: '',
    maya_details: '',
    maya_qr_url: '',
    maribank_details: '',
    restaurant_lat: '',
    restaurant_lng: '',
    welcome_title: '',
    welcome_subtitle: '',
    promo_title: '',
    promo_description: '',
    welcome_button_text: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('menu');
  const [activeSettingsTab, setActiveSettingsTab] = useState('payments');
  const adminMapRef = useRef(null);
  const adminMarkerRef = useRef(null);

  // Initialize Map for Admin Pinning
  useEffect(() => {
    if (activeTab === 'settings' && activeSettingsTab === 'location' && window.L) {
      const timer = setTimeout(() => {
        const container = document.getElementById('admin-resto-map');
        if (!container) return;

        if (adminMapRef.current) {
          adminMapRef.current.remove();
          adminMapRef.current = null;
        }

        const initialLat = settings.restaurant_lat ? parseFloat(settings.restaurant_lat) : 12.70535;
        const initialLng = settings.restaurant_lng ? parseFloat(settings.restaurant_lng) : 124.03235;

        const map = window.L.map('admin-resto-map', {
          zoomControl: true,
          attributionControl: false
        }).setView([initialLat, initialLng], 16);

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

        // Marker logic
        const updateMarker = (lat, lng) => {
          if (adminMarkerRef.current) {
            adminMarkerRef.current.setLatLng([lat, lng]);
          } else {
            adminMarkerRef.current = window.L.marker([lat, lng], { draggable: true }).addTo(map);

            adminMarkerRef.current.on('dragend', (event) => {
              const marker = event.target;
              const position = marker.getLatLng();
              setSettings(prev => ({
                ...prev,
                restaurant_lat: position.lat.toFixed(6),
                restaurant_lng: position.lng.toFixed(6)
              }));
            });
          }
        };

        // Add initial marker
        updateMarker(initialLat, initialLng);

        // Handle Map Click to Pin
        map.on('click', (e) => {
          const { lat, lng } = e.latlng;
          updateMarker(lat, lng);
          setSettings(prev => ({
            ...prev,
            restaurant_lat: lat.toFixed(6),
            restaurant_lng: lng.toFixed(6)
          }));
        });

        adminMapRef.current = map;
        setTimeout(() => map.invalidateSize(), 200);
      }, 500);

      return () => {
        if (adminMapRef.current) {
          adminMapRef.current.remove();
          adminMapRef.current = null;
          adminMarkerRef.current = null;
        }
      };
    }
  }, [activeTab, activeSettingsTab]);

  // Menu Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal States
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProof, setSelectedProof] = useState(null);
  const [newsletter, setNewsletter] = useState({ subject: '', message: '' });
  const [sendingNewsletter, setSendingNewsletter] = useState(false);

  const prevOrderCountRef = useRef(0);
  const newOrderSoundRef = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'));

  // Drag to Scroll Ref
  const scrollRef = useRef(null);
  const dragData = useRef({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
    moved: false
  });

  const handleMouseDown = (e) => {
    dragData.current.isDown = true;
    dragData.current.startX = e.pageX - scrollRef.current.offsetLeft;
    dragData.current.scrollLeft = scrollRef.current.scrollLeft;
    dragData.current.moved = false;
    scrollRef.current.style.cursor = 'grabbing';
  };

  const handleMouseLeave = () => {
    dragData.current.isDown = false;
    scrollRef.current.style.cursor = 'grab';
  };

  const handleMouseUp = () => {
    dragData.current.isDown = false;
    scrollRef.current.style.cursor = 'grab';
  };

  const handleMouseMove = (e) => {
    if (!dragData.current.isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - dragData.current.startX) * 2;
    if (Math.abs(walk) > 5) {
      dragData.current.moved = true;
    }
    scrollRef.current.scrollLeft = dragData.current.scrollLeft - walk;
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
        fetchOrdersOnly();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (orders.length > prevOrderCountRef.current && prevOrderCountRef.current !== 0) {
        newOrderSoundRef.current.play().catch(e => console.log(e));
        showMsg('New Order Received!', 'success');
    }
    prevOrderCountRef.current = orders.length;
  }, [orders]);

  const fetchOrdersOnly = async () => {
    try {
        const timestamp = new Date().getTime();
        const res = await fetch(`${API_BASE}/get_orders.php?t=${timestamp}`);
        const data = await res.json();
        if (Array.isArray(data)) {
            setOrders(data);
        }
    } catch (error) {
        console.error('Error polling orders:', error);
    }
  };

  const categories = ['All', ...new Set(products.map(p => p.category))].filter(Boolean);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedProducts = filteredProducts.reduce((acc, p) => {
    const cat = p.category || 'Uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

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

  const fetchData = async () => {
    setLoading(true);
    try {
      const timestamp = new Date().getTime();
      const [prodRes, orderRes, settingsRes] = await Promise.all([
        fetch(`${API_BASE}/get_products.php?t=${timestamp}`),
        fetch(`${API_BASE}/get_orders.php?t=${timestamp}`),
        fetch(`${API_BASE}/get_settings.php?t=${timestamp}`)
      ]);
      const prodData = await prodRes.json();
      const orderData = await orderRes.json();
      const settingsData = await settingsRes.json();
      setProducts(prodData);
      setOrders(orderData);
      setSettings(settingsData);
    } catch (error) {
      showMsg('Error fetching data: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMsg = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch(`${API_BASE}/upload.php`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) return data.url;
      throw new Error(data.message);
    } catch (error) {
      showMsg('Image upload failed: ' + error.message, 'error');
      return null;
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const url = editingProduct.isNew ? 'add_product.php' : 'update_product.php';
    let finalProduct = { ...editingProduct };
    if (Array.isArray(finalProduct.variants)) {
        finalProduct.variants = JSON.stringify(finalProduct.variants);
    }
    if (editingProduct.imageFile) {
      const uploadedUrl = await uploadImage(editingProduct.imageFile);
      if (uploadedUrl) finalProduct.image_url = uploadedUrl;
    }
    try {
      const res = await fetch(`${API_BASE}/${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalProduct)
      });
      const data = await res.json();
      showMsg(data.message || 'Dish saved!');
      setEditingProduct(null);
      fetchData();
    } catch (error) {
      showMsg('Failed to save product', 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`${API_BASE}/delete_product.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      showMsg(data.message || 'Product deleted!');
      fetchData();
    } catch (error) {
      showMsg('Failed to delete product', 'error');
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/update_order_status.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      const data = await res.json();
      showMsg(data.message || 'Status updated!');
      fetchOrdersOnly();
    } catch (error) {
      showMsg('Failed to update status', 'error');
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/update_settings.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      showMsg(data.message || 'Settings updated!');
      fetchData();
    } catch (error) {
      showMsg('Failed to update settings', 'error');
    }
  };

  const handleSendNewsletter = async (e) => {
    e.preventDefault();
    if (!newsletter.subject || !newsletter.message) return;
    setSendingNewsletter(true);
    try {
        const res = await fetch(`${API_BASE}/send_newsletter.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newsletter)
        });
        const data = await res.json();
        if (res.ok) {
            showMsg(data.message);
            setNewsletter({ subject: '', message: '' });
        } else {
            showMsg(data.message || 'Failed to send', 'error');
        }
    } catch (error) {
        showMsg('Network error', 'error');
    } finally {
        setSendingNewsletter(false);
    }
  };

  const handleQRUpload = async (file, type) => {
    const url = await uploadImage(file);
    if (url) {
        if (type === 'maya') {
            setSettings({ ...settings, maya_qr_url: url });
            showMsg('Maya QR Code uploaded. Don\'t forget to Save Settings!');
        } else {
            setSettings({ ...settings, gcash_qr_url: url });
            showMsg('GCash QR Code uploaded. Don\'t forget to Save Settings!');
        }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-poppins pt-20 flex overflow-x-hidden">
      {/* Sidebar - Blue/White Theme */}
      <aside className="w-72 bg-white text-slate-600 hidden lg:flex flex-col fixed top-20 bottom-0 left-0 z-40 border-r border-slate-200 shadow-sm">
        <div className="flex-1 overflow-y-auto no-scrollbar py-8">
          <div className="px-8 mb-8">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Management</p>
          </div>
          <nav className="space-y-1 px-4">
            {[
              { id: 'menu', label: 'Menu Inventory', icon: Utensils },
              { id: 'orders', label: 'Order Records', icon: ClipboardList },
              { id: 'analytics', label: 'Insights', icon: BarChart3 },
              { id: 'settings', label: 'System Config', icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                  activeTab === item.id
                    ? 'text-blue-600 bg-blue-50 font-semibold'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <item.icon size={20} className={activeTab === item.id ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'} />
                <span className="text-[13px] tracking-wide">{item.label}</span>
                {activeTab === item.id && <motion.div layoutId="activePill" className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3 border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">A</div>
            <div className="min-w-0">
              <p className="text-[12px] font-bold text-slate-900 truncate">Admin Dashboard</p>
              <p className="text-[10px] text-slate-400 uppercase font-medium">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Spacer */}
      <div className="hidden lg:block w-72 shrink-0"></div>

      {/* Main Content - Clean Blue/White Design */}
      <main className="flex-1 p-6 md:p-10 lg:p-12 min-w-0">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[1600px] mx-auto"
        >
          <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Admin <span className="text-blue-600">Control Panel</span>
              </h2>
              <p className="text-slate-500 text-sm mt-1">Monitor sales, manage products, and handle customer orders.</p>
            </div>

            <div className="flex items-center gap-3">
               <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">U{i}</div>
                 ))}
               </div>
               <div className="h-8 w-px bg-slate-200 mx-2"></div>
               <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all relative">
                 <Bell size={20} />
                 <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
               </button>
               <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                 <RefreshCw size={16} />
                 <span>Sync Data</span>
               </button>
            </div>
          </header>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl mb-8 flex items-center gap-3 border ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                  : 'bg-rose-50 text-rose-700 border-rose-100'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
              <span className="text-sm font-medium tracking-wide">{message.text}</span>
            </motion.div>
          )}

          {activeTab === 'menu' && (
            <div className="space-y-10">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Products', value: products.length, icon: Utensils, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Active Categories', value: categories.length - 1, icon: Filter, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                  { label: 'Today\'s Orders', value: orders.filter(o => new Date(o.order_date).toDateString() === new Date().toDateString()).length, icon: ShoppingCart, color: 'text-amber-600', bg: 'bg-amber-50' },
                  { label: 'Pending Status', value: orders.filter(o => o.status === 'pending').length, icon: PackageX, color: 'text-rose-600', bg: 'bg-rose-50' },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                        <stat.icon size={22} />
                      </div>
                      <MoreVertical size={16} className="text-slate-300" />
                    </div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Action Bar */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search inventory..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-400 outline-none transition-all text-sm"
                  />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="h-10 w-px bg-slate-200 hidden md:block mx-2"></div>
                  <button
                    onClick={() => setEditingProduct({ name: '', description: '', price: '', category: '', image_url: '', variants: [], note: '', is_available: 1, isNew: true })}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
                  >
                    <Plus size={18} /> New Product
                  </button>
                </div>
              </div>

              {/* Categories Navigation */}
              <div className="relative group">
                <div
                  ref={scrollRef}
                  className="flex overflow-x-auto no-scrollbar gap-3 pb-4 cursor-grab active:cursor-grabbing select-none"
                  onMouseDown={handleMouseDown}
                  onMouseLeave={handleMouseLeave}
                  onMouseUp={handleMouseUp}
                  onMouseMove={handleMouseMove}
                >
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        if (!dragData.current.moved) {
                          setSelectedCategory(cat);
                        }
                      }}
                      onMouseDown={(e) => {
                        // Allow bubbling for parent drag logic, but prevent text selection
                        // e.stopPropagation(); // Don't stop propagation
                      }}
                      className={`px-8 py-3 rounded-full text-xs font-bold transition-all duration-300 whitespace-nowrap border shrink-0 ${
                        selectedCategory === cat
                          ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200'
                          : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                {/* Subtle indicator that more items exist */}
                <div className="absolute right-0 top-0 bottom-4 w-24 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute left-0 top-0 bottom-4 w-24 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Products Display */}
              <div className="space-y-16">
                {Object.keys(groupedProducts).length === 0 ? (
                  <div className="bg-white py-20 rounded-3xl text-center border-2 border-dashed border-slate-200">
                    <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                      <Search size={32} />
                    </div>
                    <p className="text-slate-400 text-sm font-medium">No results found for your search.</p>
                  </div>
                ) : (
                  Object.entries(groupedProducts).map(([category, catProducts]) => (
                    <div key={category} className="space-y-6">
                      <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                          <h3 className="text-xl font-bold text-slate-900">{category}</h3>
                          <span className="text-xs text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded-md">{catProducts.length}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {catProducts.map((product) => (
                          <motion.div
                            key={product.id}
                            layout
                            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
                          >
                            <div className="relative h-48 bg-slate-100 overflow-hidden">
                              {product.image_url ? (
                                <img src={getImageUrl(product.image_url)} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={48} /></div>
                              )}
                              <div className="absolute top-4 left-4 flex gap-2">
                                <div className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${product.is_available ? 'bg-emerald-500/80 text-white' : 'bg-rose-500/80 text-white'}`}>
                                  {product.is_available ? 'In Stock' : 'Sold Out'}
                                </div>
                              </div>
                              <div className="absolute top-4 right-4 flex gap-2">
                                <button
                                  onClick={() => {
                                    const p = { ...product };
                                    if (typeof p.variants === 'string') p.variants = JSON.parse(p.variants);
                                    setEditingProduct(p);
                                  }}
                                  className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-slate-600 shadow-sm hover:bg-blue-600 hover:text-white transition-all"
                                >
                                  <Edit3 size={18} />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-rose-500 shadow-sm hover:bg-rose-500 hover:text-white transition-all"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                              <div className="absolute bottom-4 left-4">
                                <span className="px-3 py-1.5 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold rounded-lg shadow-lg">₱{product.price}</span>
                              </div>
                            </div>

                            <div className="p-6">
                              <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{product.name}</h4>
                              <p className="text-sm text-slate-500 line-clamp-2 h-10 leading-relaxed mb-4">{product.description || 'No detailed description available.'}</p>

                              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                <div className="flex -space-x-2">
                                   {[1,2].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100"></div>)}
                                   <div className="w-6 h-6 rounded-full border-2 border-white bg-blue-50 text-blue-600 text-[8px] font-bold flex items-center justify-center">+{Math.floor(Math.random()*20)}</div>
                                </div>
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Trending Now</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <section className="space-y-6">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-10">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Orders Management</h3>
                  <p className="text-sm text-slate-400 font-medium">Handle real-time customer requests and logistics.</p>
                </div>
                <div className="flex gap-3">
                  <div className="px-4 py-2 bg-amber-50 text-amber-600 border border-amber-100 rounded-xl flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                    <span className="text-xs font-bold uppercase">{ordersToDisplay.filter(o => o.status === 'pending').length} Pending</span>
                  </div>
                  <div className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl flex items-center gap-2">
                    <span className="text-xs font-bold uppercase">{ordersToDisplay.length} Total</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {ordersToDisplay.length === 0 ? (
                  <div className="bg-white py-20 rounded-3xl text-center border border-slate-200">
                    <p className="text-slate-400 font-medium italic">No active orders found.</p>
                  </div>
                ) : (
                  ordersToDisplay.map((order) => {
                    const getItemPrice = (item) => {
                      if (!item.variant_name || item.variant_name === 'Standard') return parseFloat(item.price || 0);
                      try {
                        const variants = typeof item.variants === 'string' ? JSON.parse(item.variants) : item.variants;
                        if (Array.isArray(variants)) {
                          const variant = variants.find(v => v.label === item.variant_name);
                          if (variant) return parseFloat(variant.price);
                        }
                      } catch (e) {}
                      return parseFloat(item.price || 0);
                    };
                    const totalAmount = order.items.reduce((sum, item) => sum + (getItemPrice(item) * parseInt(item.quantity)), 0);

                    return (
                      <motion.div
                        key={order.order_group_id || order.id}
                        layout
                        className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
                      >
                        <div className="grid grid-cols-1 xl:grid-cols-4">
                          {/* Order ID & Customer */}
                          <div className="p-8 border-b xl:border-b-0 xl:border-r border-slate-100 bg-slate-50/50">
                            <div className="flex flex-col h-full">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Manifest #</span>
                              <h4 className="text-sm font-bold text-slate-900 mb-6 truncate">{order.order_group_id || `#ORD-${order.id}`}</h4>

                              <div className="space-y-4">
                                <div>
                                  <p className="text-xs font-bold text-slate-900">{order.customer_name}</p>
                                  <p className="text-[11px] text-slate-500 font-medium">{order.phone_number || 'No contact provided'}</p>
                                </div>
                                <div className="pt-4 border-t border-slate-200">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Timeline</span>
                                  <p className="text-[11px] font-bold text-slate-600">{new Date(order.order_date).toLocaleString()}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Order Items List */}
                          <div className="p-8 xl:col-span-2 border-b xl:border-b-0 xl:border-r border-slate-100">
                             <div className="space-y-4 max-h-60 overflow-y-auto pr-2 no-scrollbar">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                  <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-900">{item.product_name}</p>
                                    <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded-md">{item.variant_name || 'Standard'}</span>
                                  </div>
                                  <div className="flex items-center gap-6">
                                    <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-lg">x{item.quantity}</span>
                                    <span className="text-sm font-bold text-slate-900 min-w-[60px] text-right">₱{(getItemPrice(item) * item.quantity).toFixed(0)}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-6 pt-6 border-t-2 border-dashed border-slate-100 flex justify-between items-center px-3">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Grand Total</span>
                              <span className="text-xl font-bold text-blue-600">₱{totalAmount.toLocaleString()}</span>
                            </div>
                          </div>

                          {/* Delivery & Status */}
                          <div className="p-8 bg-slate-50/50 flex flex-col justify-between items-center gap-6">
                            <div className="w-full text-center xl:text-left">
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Delivery Address</span>
                               <p className="text-xs text-slate-600 font-medium leading-relaxed bg-white p-4 rounded-xl border border-slate-100 shadow-sm break-words" title={order.address}>
                                  {order.address || 'Pickup at Store'}
                               </p>
                            </div>

                            <div className="w-full space-y-4">
                              <select
                                value={order.status}
                                onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wide border shadow-sm outline-none cursor-pointer transition-all ${
                                  order.status === 'pending' ? 'bg-amber-500 text-white border-amber-600' :
                                  order.status === 'preparing' ? 'bg-blue-500 text-white border-blue-600' :
                                  order.status === 'delivering' ? 'bg-indigo-500 text-white border-indigo-600' :
                                  order.status === 'completed' ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-rose-500 text-white border-rose-600'
                                }`}
                              >
                                <option value="pending">⏳ Pending Verification</option>
                                <option value="preparing">🍳 Preparing Dish</option>
                                <option value="delivering">🛵 Out for Delivery</option>
                                <option value="completed">✔ Order Completed</option>
                                <option value="cancelled">❌ Cancelled</option>
                              </select>

                              <div className="flex items-center justify-between px-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">{order.payment_method || 'COD'}</span>
                                {order.proof_of_payment && (
                                  <div className="flex items-center gap-2">
                                    {order.status === 'pending' && (
                                      <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" title="Requires Verification"></span>
                                    )}
                                    <button onClick={() => setSelectedProof(getImageUrl(order.proof_of_payment))} className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1">
                                      <Receipt size={10} /> View Receipt
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </section>
          )}

          {activeTab === 'analytics' && <AnalyticsView orders={orders} />}

          {activeTab === 'settings' && (
            <div className="max-w-6xl space-y-10">
              <header className="mb-10">
                <h3 className="text-2xl font-bold text-slate-900">System Configuration</h3>
                <p className="text-slate-500 text-sm mt-1">Manage global application settings and marketing content.</p>
              </header>

              <div className="flex flex-col lg:flex-row gap-10">
                {/* Internal Settings Navigation */}
                <aside className="lg:w-64 shrink-0">
                  <nav className="flex lg:flex-col gap-2 p-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
                    {[
                      { id: 'payments', label: 'Payments', icon: DollarSign },
                      { id: 'location', label: 'Store Location', icon: ArrowUpRight },
                      { id: 'marketing', label: 'Marketing Modal', icon: Sparkles },
                      { id: 'security', label: 'Security', icon: PackageX },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveSettingsTab(item.id)}
                        className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all whitespace-nowrap ${
                          activeSettingsTab === item.id
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                            : 'text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        <item.icon size={18} />
                        <span className="text-sm font-bold tracking-wide">{item.label}</span>
                      </button>
                    ))}
                  </nav>
                </aside>

                {/* Settings Content Area */}
                <div className="flex-1 min-w-0">
                  <AnimatePresence mode="wait">
                    {activeSettingsTab === 'payments' && (
                      <motion.div
                        key="payments"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                      >
                        <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-sm">
                          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                              <DollarSign size={24} />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-slate-900">Payment Gateways</h4>
                              <p className="text-xs text-slate-400 font-medium">Configure GCash, Maya, and Bank details.</p>
                            </div>
                          </div>

                          <form onSubmit={handleUpdateSettings} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Merchant Name</label>
                                <input
                                  type="text"
                                  value={settings.receiver_name || ''}
                                  onChange={(e) => setSettings({ ...settings, receiver_name: e.target.value })}
                                  placeholder="Full Name"
                                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-400 outline-none transition-all text-slate-900 font-bold"
                                />
                              </div>
                              <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">GCash Number</label>
                                <input
                                  type="text"
                                  value={settings.gcash_number || ''}
                                  onChange={(e) => setSettings({ ...settings, gcash_number: e.target.value })}
                                  placeholder="09XX XXX XXXX"
                                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-400 outline-none transition-all text-slate-900 font-bold"
                                />
                              </div>
                              <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Maya Details</label>
                                <input
                                  type="text"
                                  value={settings.maya_details || ''}
                                  onChange={(e) => setSettings({ ...settings, maya_details: e.target.value })}
                                  placeholder="Account Number"
                                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-400 outline-none transition-all text-slate-900 font-bold"
                                />
                              </div>
                              <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Bank Info</label>
                                <input
                                  type="text"
                                  value={settings.bank_transfer_details || ''}
                                  onChange={(e) => setSettings({ ...settings, bank_transfer_details: e.target.value })}
                                  placeholder="Bank & Account"
                                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-400 outline-none transition-all text-slate-900 font-bold"
                                />
                              </div>
                              <div className="space-y-3 md:col-span-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">MariBank Details</label>
                                <input
                                  type="text"
                                  value={settings.maribank_details || ''}
                                  onChange={(e) => setSettings({ ...settings, maribank_details: e.target.value })}
                                  placeholder="Account Number"
                                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-400 outline-none transition-all text-slate-900 font-bold"
                                />
                              </div>

                              <div className="space-y-4">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">GCash QR Code</label>
                                <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                                  <input type="file" accept="image/*" onChange={(e) => handleQRUpload(e.target.files[0], 'gcash')} className="hidden" id="qr-upload-tab" />
                                  <label htmlFor="qr-upload-tab" className="flex-1 flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all">
                                    <Upload size={20} className="mb-1 text-blue-600" />
                                    <span className="text-[9px] font-bold uppercase text-slate-400">Change</span>
                                  </label>
                                  {settings.gcash_qr_url && (
                                    <div className="w-16 h-16 bg-white p-1 rounded-lg border border-slate-200 flex items-center justify-center shrink-0">
                                      <img src={getImageUrl(settings.gcash_qr_url)} alt="GCash QR" className="max-w-full max-h-full object-contain" />
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-4">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Maya QR Code</label>
                                <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                                  <input type="file" accept="image/*" onChange={(e) => handleQRUpload(e.target.files[0], 'maya')} className="hidden" id="maya-qr-upload-tab" />
                                  <label htmlFor="maya-qr-upload-tab" className="flex-1 flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all">
                                    <Upload size={20} className="mb-1 text-green-600" />
                                    <span className="text-[9px] font-bold uppercase text-slate-400">Change</span>
                                  </label>
                                  {settings.maya_qr_url && (
                                    <div className="w-16 h-16 bg-white p-1 rounded-lg border border-slate-200 flex items-center justify-center shrink-0">
                                      <img src={getImageUrl(settings.maya_qr_url)} alt="Maya QR" className="max-w-full max-h-full object-contain" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3">
                              <Save size={18} /> Update Payment Records
                            </button>
                          </form>
                        </div>
                      </motion.div>
                    )}

                    {activeSettingsTab === 'location' && (
                      <motion.div
                        key="location"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                      >
                        <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-sm">
                           <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                              <ArrowUpRight size={24} />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-slate-900">Store Logistics</h4>
                              <p className="text-xs text-slate-400 font-medium">Pin your exact coordinates for delivery calculations.</p>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div className="relative h-[400px] rounded-3xl overflow-hidden border border-slate-100 shadow-inner group">
                              <div id="admin-resto-map" className="w-full h-full z-0"></div>
                              <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md border border-slate-200 px-4 py-2 rounded-xl shadow-sm">
                                <p className="text-[10px] font-bold text-slate-600 uppercase">Click on map to re-pin restaurant</p>
                              </div>
                            </div>

                            <form onSubmit={handleUpdateSettings} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-blue-600 uppercase">Lat</span>
                                <input
                                  type="text"
                                  value={settings.restaurant_lat || ''}
                                  onChange={(e) => setSettings({ ...settings, restaurant_lat: e.target.value })}
                                  className="w-full pl-16 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-400 outline-none transition-all text-slate-900 font-bold"
                                />
                              </div>
                              <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-blue-600 uppercase">Lng</span>
                                <input
                                  type="text"
                                  value={settings.restaurant_lng || ''}
                                  onChange={(e) => setSettings({ ...settings, restaurant_lng: e.target.value })}
                                  className="w-full pl-16 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-400 outline-none transition-all text-slate-900 font-bold"
                                />
                              </div>
                              <button type="submit" className="md:col-span-2 bg-indigo-600 text-white font-bold py-5 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 mt-4">
                                <Save size={18} /> Update Store Coordinates
                              </button>
                            </form>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeSettingsTab === 'marketing' && (
                      <motion.div
                        key="marketing"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                      >
                        <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-sm">
                           <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                              <Sparkles size={24} />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-slate-900">Welcome Modal</h4>
                              <p className="text-xs text-slate-400 font-medium">Customize the announcement popup for customers.</p>
                            </div>
                          </div>

                          <form onSubmit={handleUpdateSettings} className="space-y-8">
                            <div className="grid grid-cols-1 gap-6">
                              <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Main Headline</label>
                                <input
                                  type="text"
                                  value={settings.welcome_title || ''}
                                  onChange={(e) => setSettings({ ...settings, welcome_title: e.target.value })}
                                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-400 outline-none transition-all text-slate-900 font-bold"
                                />
                              </div>
                              <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Sub-headline</label>
                                <input
                                  type="text"
                                  value={settings.welcome_subtitle || ''}
                                  onChange={(e) => setSettings({ ...settings, welcome_subtitle: e.target.value })}
                                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-400 outline-none transition-all text-slate-900 font-medium"
                                />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Promo Label</label>
                                  <input
                                    type="text"
                                    value={settings.promo_title || ''}
                                    onChange={(e) => setSettings({ ...settings, promo_title: e.target.value })}
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-400 outline-none transition-all text-slate-900 font-black uppercase tracking-wider"
                                  />
                                </div>
                                <div className="space-y-3">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Call to Action (Button)</label>
                                  <input
                                    type="text"
                                    value={settings.welcome_button_text || ''}
                                    onChange={(e) => setSettings({ ...settings, welcome_button_text: e.target.value })}
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-400 outline-none transition-all text-slate-900 font-bold"
                                  />
                                </div>
                              </div>
                              <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Promo Content Details</label>
                                <textarea
                                  value={settings.promo_description || ''}
                                  onChange={(e) => setSettings({ ...settings, promo_description: e.target.value })}
                                  rows="4"
                                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-400 outline-none transition-all text-slate-900 text-sm leading-relaxed"
                                />
                              </div>
                            </div>
                            <button type="submit" className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3">
                              <Save size={18} /> Deploy Modal Updates
                            </button>
                          </form>
                        </div>

                        {/* Newsletter Broadcast */}
                        <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-sm mt-8">
                           <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                              <Bell size={24} />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-slate-900">Newsletter Broadcast</h4>
                              <p className="text-xs text-slate-400 font-medium">Send an email update to all "IsoGoods Circle" subscribers.</p>
                            </div>
                          </div>

                          <form onSubmit={handleSendNewsletter} className="space-y-6">
                            <div className="space-y-3">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Subject</label>
                              <input
                                type="text"
                                value={newsletter.subject}
                                onChange={(e) => setNewsletter({ ...newsletter, subject: e.target.value })}
                                placeholder="e.g. New Seasonal Menu is here!"
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-400 outline-none transition-all text-slate-900 font-bold"
                                required
                              />
                            </div>
                            <div className="space-y-3">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Message Body (HTML allowed)</label>
                              <textarea
                                value={newsletter.message}
                                onChange={(e) => setNewsletter({ ...newsletter, message: e.target.value })}
                                rows="6"
                                placeholder="Write your message here..."
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-400 outline-none transition-all text-slate-900 text-sm leading-relaxed"
                                required
                              />
                            </div>
                            <button
                                type="submit"
                                disabled={sendingNewsletter}
                                className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                              <Send size={18} /> {sendingNewsletter ? 'Sending Broadcast...' : 'Send to All Subscribers'}
                            </button>
                          </form>
                        </div>
                      </motion.div>
                    )}

                    {activeSettingsTab === 'security' && (
                      <motion.div
                        key="security"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-8"
                      >
                         <div className="bg-rose-50 rounded-3xl p-8 md:p-12 border border-rose-100 flex flex-col md:flex-row items-center gap-8 shadow-sm">
                            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-rose-500 shadow-xl shadow-rose-200/50 shrink-0">
                               <PackageX size={40} />
                            </div>
                            <div className="text-center md:text-left">
                               <h4 className="text-xl font-bold text-rose-900">Administrative Security</h4>
                               <p className="text-rose-600/70 text-sm mt-1 mb-6">Changing system settings will reflect globally. Ensure you log out when finished to protect store data.</p>
                               <button
                                  onClick={() => window.confirm('Logout and terminate session?') && (window.location.href = '/login')}
                                  className="px-10 py-4 bg-rose-600 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-200"
                               >
                                 Terminate Admin Session
                               </button>
                            </div>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      {/* Product Modal - Blue/White Theme */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingProduct(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative z-10 bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{editingProduct.isNew ? 'Create New Entry' : 'Modify Record'}</h3>
                    <p className="text-sm text-slate-400">Inventory update for {editingProduct.category || 'General'}</p>
                  </div>
                  <button onClick={() => setEditingProduct(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><PackageX size={24} /></button>
                </div>

                <form onSubmit={handleSaveProduct} className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Product Title</label>
                      <input type="text" value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-400 outline-none transition-all text-slate-900 font-medium" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Assign Category</label>
                      <select value={editingProduct.category} onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-400 outline-none transition-all text-slate-900 font-medium cursor-pointer" required>
                        <option value="" disabled>Select Segment</option>
                        {MENU_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Marketing Copy / Note</label>
                    <textarea rows="3" placeholder="Describe this dish..." value={editingProduct.description} onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-400 outline-none transition-all text-slate-900 text-sm" />
                  </div>

                  <div className="p-6 bg-slate-50 rounded-2xl space-y-4 border border-slate-100">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Price Extensions</label>
                      <button type="button" onClick={() => setEditingProduct({...editingProduct, variants: [...(editingProduct.variants || []), {label: '', price: ''}]})} className="text-[10px] font-bold text-blue-600 uppercase bg-white px-3 py-1 rounded-lg border border-blue-100 hover:bg-blue-600 hover:text-white transition-all">+ Add Extension</button>
                    </div>
                    {(editingProduct.variants || []).map((variant, idx) => (
                      <div key={idx} className="flex gap-3 items-center">
                        <input placeholder="Label (e.g. XL)" value={variant.label} onChange={(e) => {
                          const v = [...editingProduct.variants]; v[idx].label = e.target.value; setEditingProduct({...editingProduct, variants: v});
                        }} className="flex-1 px-4 py-2.5 bg-white rounded-xl text-xs text-slate-900 outline-none border border-slate-200 focus:border-blue-300 shadow-sm" />
                        <input placeholder="₱" type="number" value={variant.price} onChange={(e) => {
                          const v = [...editingProduct.variants]; v[idx].price = e.target.value; setEditingProduct({...editingProduct, variants: v});
                        }} className="w-24 px-4 py-2.5 bg-white rounded-xl text-xs text-slate-900 font-bold outline-none border border-slate-200 focus:border-blue-300 shadow-sm" />
                        <button type="button" onClick={() => {
                          const v = editingProduct.variants.filter((_, i) => i !== idx); setEditingProduct({...editingProduct, variants: v});
                        }} className="text-rose-400 hover:text-rose-600 p-1"><Trash2 size={16} /></button>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Base Valuation (₱)</label>
                      <input type="number" step="0.01" value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-400 outline-none transition-all text-slate-900 font-bold" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Availability Status</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingProduct({...editingProduct, is_available: 1})}
                          className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase transition-all border ${editingProduct.is_available ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-slate-50 text-slate-400 border-slate-200'}`}
                        >
                          Available
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingProduct({...editingProduct, is_available: 0})}
                          className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase transition-all border ${!editingProduct.is_available ? 'bg-rose-500 text-white border-rose-600' : 'bg-slate-50 text-slate-400 border-slate-200'}`}
                        >
                          Sold Out
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Media Upload</label>
                      <div className="relative">
                        <input type="file" accept="image/*" onChange={(e) => setEditingProduct({...editingProduct, imageFile: e.target.files[0]})} className="hidden" id="dish-image-upload" />
                        <label htmlFor="dish-image-upload" className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-white hover:border-blue-200 transition-all text-slate-500 font-bold text-xs">
                          <Upload size={18} className="text-blue-600" /> {editingProduct.imageFile ? editingProduct.imageFile.name : 'Choose Image'}
                        </label>
                      </div>
                    </div>

                  <button type="submit" className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 text-sm tracking-wide">Commit Changes to DB</button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Proof Modal */}
      <AnimatePresence>
        {selectedProof && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-12" onClick={() => setSelectedProof(null)}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl" />
            <motion.img initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} src={selectedProof} alt="Proof" className="relative z-10 max-w-full max-h-[85vh] rounded-3xl shadow-2xl object-contain bg-white p-2" />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AnalyticsView = ({ orders }) => {
    const analyticsData = useMemo(() => {
        const dailyRevenue = {};
        const productSales = {};
        const hourlyStats = new Array(24).fill(0);

        orders.forEach(order => {
            if (order.status === 'completed') {
                const dateObj = new Date(order.order_date);
                const date = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                const amount = parseFloat(order.price || 0) * parseInt(order.quantity || 0);

                dailyRevenue[date] = (dailyRevenue[date] || 0) + amount;

                const prodName = order.product_name || 'Unknown';
                productSales[prodName] = (productSales[prodName] || 0) + parseInt(order.quantity || 0);

                const hour = dateObj.getHours();
                hourlyStats[hour]++;
            }
        });

        const revenueChartData = Object.entries(dailyRevenue).map(([name, value]) => ({ name, value })).slice(-7);
        const productChartData = Object.entries(productSales).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);
        const peakHoursData = hourlyStats.map((orders, hour) => ({
            hour: `${hour}:00`,
            orders
        }));

        return { revenueChartData, productChartData, peakHoursData };
    }, [orders]);

    const COLORS = ['#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#F59E0B'];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Evolution */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h4 className="text-xl font-bold text-slate-900">Revenue Growth</h4>
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">Net Sales Performance (7D)</p>
                        </div>
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><TrendingUp size={20} /></div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analyticsData.revenueChartData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                                <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }} cursor={{ stroke: '#3B82F6', strokeWidth: 2 }} />
                                <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Popularity Distribution */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h4 className="text-xl font-bold text-slate-900">Demand Heatmap</h4>
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">Top Volume Contributors</p>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><BarChart3 size={20} /></div>
                    </div>
                    <div className="h-80 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={analyticsData.productChartData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value">
                                    {analyticsData.productChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4">
                        {analyticsData.productChartData.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                <span className="text-[11px] font-bold text-slate-500 uppercase">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Peak Hours Analysis */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h4 className="text-xl font-bold text-slate-900">Peak Ordering Hours</h4>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">Order Volume per Hour of Day</p>
                    </div>
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Calendar size={20} /></div>
                </div>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.peakHoursData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                            <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94A3B8' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94A3B8' }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                cursor={{ fill: '#F8FAFC' }}
                            />
                            <Bar dataKey="orders" fill="#6366F1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Performance Summary Banner */}
            <div className="bg-blue-600 rounded-[2.5rem] p-12 text-white flex flex-col md:flex-row items-center justify-around gap-12 shadow-2xl shadow-blue-200 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="text-center relative z-10">
                    <p className="text-blue-100 text-xs font-bold uppercase tracking-[0.3em] mb-4 opacity-80">Total Revenue Stream</p>
                    <p className="text-5xl font-black">₱{analyticsData.revenueChartData.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()}</p>
                </div>
                <div className="w-px h-16 bg-white/20 hidden md:block relative z-10"></div>
                <div className="text-center relative z-10">
                    <p className="text-blue-100 text-xs font-bold uppercase tracking-[0.3em] mb-4 opacity-80">Fulfillment Ratio</p>
                    <p className="text-5xl font-black">{((orders.filter(o => o.status === 'completed').length / (orders.length || 1)) * 100).toFixed(1)}%</p>
                </div>
                <div className="w-px h-16 bg-white/20 hidden md:block relative z-10"></div>
                <div className="text-center relative z-10">
                    <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-black/10 hover:scale-105 transition-transform">Download Report</button>
                </div>
            </div>
        </div>
    );
};

export default Admin;
