import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenuAlt3, HiX, HiOutlineShoppingBag, HiOutlineClipboardList, HiOutlineBell } from 'react-icons/hi';
import { User, LogOut, LayoutDashboard, Package, Bell } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';
import CartDrawer from './CartDrawer';
import logo from '../assets/logo.jpg';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [showNotifs, setShowNotifs] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();
  const { notifications, unreadCount, markAllAsRead, clearNotifications } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Check for user in localStorage
    const checkUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    checkUser();
    window.addEventListener('auth-change', checkUser);
    window.addEventListener('storage', checkUser);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('auth-change', checkUser);
      window.removeEventListener('storage', checkUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.dispatchEvent(new Event('auth-change'));
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isAdminPage = location.pathname.startsWith('/admin');
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isAdminPage
          ? 'bg-white py-4 shadow-sm border-b border-slate-200'
          : scrolled || isAuthPage
            ? 'bg-accent/95 backdrop-blur-md py-4 shadow-xl border-b border-white/5'
            : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 md:px-12 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Isogoods Diner" className="h-12 w-12 md:h-16 md:w-16 object-contain rounded-full" />
          <span className={`hidden sm:block text-xl md:text-2xl font-playfair font-bold tracking-wider md:tracking-widest uppercase ${isAdminPage ? 'text-blue-600' : 'text-primary'}`}>
            ISOGOODS <span className={`${isAdminPage ? 'text-slate-900' : 'text-neutral'} font-light`}>DINER</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center">
          {!isAdminPage && navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`font-poppins text-sm uppercase tracking-widest hover:text-primary transition-colors ${
                location.pathname === link.path ? 'text-primary border-b border-primary' : 'text-neutral'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Cart Icon */}
          {!isAdminPage && user && (
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifs(!showNotifs);
                    if (!showNotifs) markAllAsRead();
                  }}
                  className="p-2 text-neutral hover:text-primary transition-colors relative"
                >
                  <HiOutlineBell size={24} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-primary text-secondary text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-accent">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotifs && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowNotifs(false)}
                        className="fixed inset-0 z-[-1]"
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-4 w-80 bg-secondary border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden z-50"
                      >
                        <div className="p-5 border-b border-white/5 bg-white/5 flex justify-between items-center">
                          <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Notifications</h4>
                          <div className="flex items-center gap-4">
                            {notifications.length > 0 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  clearNotifications();
                                }}
                                className="text-[8px] font-black text-red-400 hover:text-red-500 uppercase tracking-widest transition-colors"
                              >
                                Clear All
                              </button>
                            )}
                            <span className="text-[9px] text-neutral/40 uppercase">{notifications.length} Total</span>
                          </div>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                          {notifications.length === 0 ? (
                            <div className="p-10 text-center">
                              <p className="text-neutral/20 text-xs italic">No notifications yet.</p>
                            </div>
                          ) : (
                            notifications.map(n => (
                              <div key={n.id} className={`p-5 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors ${!n.read ? 'bg-primary/5' : ''}`}>
                                <h5 className="text-[10px] font-bold text-neutral uppercase mb-1">{n.title}</h5>
                                <p className="text-xs text-neutral/50 leading-relaxed mb-2">{n.message}</p>
                                <span className="text-[8px] text-primary/40 uppercase font-bold">{new Date(n.time).toLocaleTimeString()}</span>
                              </div>
                            ))
                          )}
                        </div>
                        {notifications.length > 0 && (
                          <Link
                            to="/orders"
                            onClick={() => setShowNotifs(false)}
                            className="block p-4 text-center text-[9px] font-black text-primary uppercase tracking-[0.2em] bg-white/5 hover:bg-primary hover:text-secondary transition-all"
                          >
                            View All Orders
                          </Link>
                        )}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <Link
                to="/orders"
                className="p-2 text-neutral hover:text-primary transition-colors flex items-center gap-2 group"
                title="My Orders"
              >
                <HiOutlineClipboardList size={24} />
                <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity">Orders</span>
              </Link>
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-neutral hover:text-primary transition-colors"
              >
              <HiOutlineShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-secondary text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-accent animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
          )}

          {user ? (
            <div className="flex items-center gap-6">
              {user.role === 'admin' && (
                <Link to="/admin" className={`${isAdminPage ? 'text-blue-600' : 'text-primary'} hover:scale-110 transition-all`} title="Admin Dashboard">
                  <LayoutDashboard size={20} />
                </Link>
              )}
              <div className={`flex items-center gap-2 ${isAdminPage ? 'text-slate-900' : 'text-neutral'} group cursor-pointer relative`}>
                <User size={20} className={isAdminPage ? 'text-blue-600' : 'text-primary'} />
                <span className="text-xs uppercase tracking-tighter font-bold">{user.name.split(' ')[0]}</span>
                <button
                  onClick={handleLogout}
                  className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn-primary py-2 px-6 text-xs uppercase tracking-widest"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-primary text-3xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-secondary border-t border-white/10"
          >
            <div className="flex flex-col p-6 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <img src={logo} alt="Logo" className="w-16 h-16 rounded-full border border-primary/20 p-1" />
                {user && (
                  <div className="flex gap-4">
                    <Link
                      to="/orders"
                      onClick={() => setIsOpen(false)}
                      className="p-2 text-primary"
                    >
                      <HiOutlineClipboardList size={28} />
                    </Link>
                    <button
                      onClick={() => { setIsCartOpen(true); setIsOpen(false); }}
                      className="relative p-2 text-primary"
                    >
                      <HiOutlineShoppingBag size={28} />
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-white text-secondary text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-primary">
                          {cartCount}
                        </span>
                      )}
                    </button>
                  </div>
                )}
              </div>
              {!location.pathname.startsWith('/admin') && navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-poppins uppercase tracking-widest ${
                    location.pathname === link.path ? 'text-primary' : 'text-neutral'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {user ? (
                <div className="flex flex-col space-y-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-3 text-primary font-poppins">
                    <User size={24} />
                    <span className="uppercase tracking-widest">{user.name}</span>
                  </div>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setIsOpen(false)} className="text-neutral flex items-center gap-3">
                      <LayoutDashboard size={20} /> Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-red-400 font-poppins uppercase tracking-widest"
                  >
                    <LogOut size={20} /> Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="btn-primary text-center"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
