import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUtensils, FaCoffee, FaIceCream, FaHamburger, FaSearch, FaShoppingCart, FaPhoneAlt, FaPlus, FaHeart, FaRegHeart, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';
import { API_BASE_URL, getImageUrl } from '../config';

const API_BASE = API_BASE_URL;

const FullMenu = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedProductReviews, setSelectedProductReviews] = useState(null);

  const fetchReviews = async (productId) => {
    try {
        const res = await fetch(`${API_BASE}/get_product_reviews.php?product_id=${productId}`);
        const data = await res.json();
        setSelectedProductReviews({
            productId,
            ...data
        });
    } catch (err) {
        console.error("Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (e, product) => {
    e.stopPropagation();
    if (!user) {
      addNotification('Login Required', 'Please login to add items to your wishlist', 'error');
      return;
    }

    const isFav = wishlist.some(id => id === product.id);
    if (isFav) {
      setWishlist(prev => prev.filter(id => id !== product.id));
    } else {
      setWishlist(prev => [...prev, product.id]);
      addNotification('Added to Wishlist', `${product.name} added to your favorites!`, 'success');
    }
  };

  useEffect(() => {
    // Check for user login
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Add a timestamp to prevent browser caching
    const timestamp = new Date().getTime();
    fetch(`${API_BASE}/get_products.php?t=${timestamp}`)
      .then(res => res.json())
      .then(data => {
        const parsedProducts = data.map(p => ({
          ...p,
          variants: p.variants ? JSON.parse(p.variants) : []
        }));
        setDbProducts(parsedProducts);
      })
      .catch(err => console.error("Error fetching DB products:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (product, variant = null) => {
    addToCart(product, variant);
    // Optional: could show a toast or open the cart drawer
  };

  // Process categories from DB products
  const categoryIcons = {
    "Pasta": <FaUtensils />,
    "Pancit or Bihon": <FaUtensils />,
    "Lomi": <FaUtensils />,
    "Breakfast": <FaUtensils />,
    "Sandwich": <FaHamburger />,
    "Fries": <FaHamburger />,
    "Lutong Bahay": <FaUtensils />,
    "Chix Rice Meal": <FaUtensils />,
    "Sizzling Plates": <FaUtensils />,
    "Takoyaki": <FaUtensils />,
    "Beverages": <FaCoffee />,
    "Cold Brew": <FaCoffee />,
    "Dessert": <FaIceCream />,
    "Shake": <FaCoffee />,
    "Bilao": <FaUtensils />,
  };

  const groupedProducts = dbProducts.reduce((acc, product) => {
    const category = product.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = {
        category: category,
        icon: categoryIcons[category] || <FaUtensils />,
        items: []
      };
    }
    acc[category].items.push({
      id: product.id,
      name: product.name,
      image: product.image_url,
      price: product.price,
      variants: product.variants,
      note: product.note,
      description: product.description,
      average_rating: product.average_rating,
      review_count: product.review_count,
      is_available: parseInt(product.is_available) !== 0
    });
    return acc;
  }, {});

  const menuData = Object.values(groupedProducts);
  const categories = ["All", ...menuData.map(cat => cat.category)];

  const filteredMenu = activeCategory === "All"
    ? menuData
    : menuData.filter(cat => cat.category === activeCategory);

  const searchItems = (data) => {
    if (!searchQuery) return data;
    return data.map(cat => ({
      ...cat,
      items: cat.items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(cat => cat.items.length > 0);
  };

  const finalMenu = searchItems(filteredMenu);

  if (loading) {
      return (
          <div className="min-h-screen bg-accent flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
          </div>
      );
  }

  return (
    <section className="py-12 bg-accent min-h-screen">
      <div className="container mx-auto px-4">
        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-10 relative">
          <input
            type="text"
            placeholder="Search our menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-secondary border border-white/10 rounded-full py-4 px-12 text-neutral focus:border-primary outline-none transition-all"
          />
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" />
        </div>

        {/* Category Scrollbar */}
        <div className="flex overflow-x-auto pb-6 mb-12 no-scrollbar gap-4 sticky top-20 z-30 bg-accent/80 backdrop-blur-sm -mx-4 px-4 py-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-bold transition-all border ${
                activeCategory === cat
                  ? 'bg-primary text-accent border-primary shadow-lg shadow-primary/20'
                  : 'bg-transparent text-neutral/60 border-white/10 hover:border-primary/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="space-y-24">
          <AnimatePresence mode="wait">
            {finalMenu.length > 0 ? (
              finalMenu.map((cat) => (
                <motion.div
                  key={cat.category}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  {/* Category Header */}
                  <div className="flex justify-center mb-16">
                    <div className="relative inline-block">
                       <div className="bg-neutral text-accent px-12 py-3 font-black uppercase text-3xl md:text-4xl tracking-[0.2em] relative z-10 skew-x-[-10deg]">
                        {cat.category}
                      </div>
                      <div className="absolute -inset-2 bg-primary transform rotate-2 z-0 skew-x-[-10deg] opacity-80"></div>
                    </div>
                  </div>

                  <div className={`grid grid-cols-1 ${cat.category === 'Bilao' ? 'max-w-3xl mx-auto' : 'md:grid-cols-2'} gap-x-16 gap-y-12`}>
                    {cat.items.map((item, i) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className={`group flex flex-col ${
                          cat.category === 'Takoyaki'
                            ? 'items-center text-center'
                            : cat.category === 'Bilao'
                              ? i % 2 === 0
                                ? 'sm:flex-row-reverse items-center sm:items-start'
                                : 'sm:flex-row items-center sm:items-start'
                              : 'sm:flex-row items-center sm:items-start'
                        } gap-8`}
                      >
                        {item.image ? (
                          <div className="w-40 h-40 md:w-56 md:h-56 shrink-0 rounded-full overflow-hidden border-2 border-primary/30 p-1 group-hover:border-primary transition-colors duration-500 shadow-xl shadow-black/50 relative">
                            <img
                              src={getImageUrl(item.image)}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-700"
                            />
                            {/* Heart Icon */}
                            <button
                                onClick={(e) => toggleWishlist(e, item)}
                                className="absolute top-4 right-4 z-20 bg-accent/80 p-2 rounded-full border border-white/10 hover:bg-primary hover:text-accent transition-all duration-300"
                            >
                                {wishlist.includes(item.id) ? <FaHeart className="text-primary group-hover:text-accent" /> : <FaRegHeart className="text-neutral/40" />}
                            </button>
                            {!item.is_available && (
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                                    <span className="bg-primary text-accent px-4 py-1 rounded-full font-black uppercase text-xs tracking-widest -rotate-12 border-2 border-accent">Sold Out</span>
                                </div>
                            )}
                          </div>
                        ) : (
                           <div className="w-40 h-40 md:w-56 md:h-56 shrink-0 rounded-full overflow-hidden border-2 border-dashed border-white/10 flex items-center justify-center text-white/5 opacity-50 group-hover:opacity-100 transition-all relative">
                             <FaUtensils size={40} />
                             {/* Heart Icon */}
                             <button
                                onClick={(e) => toggleWishlist(e, item)}
                                className="absolute top-4 right-4 z-20 bg-accent/80 p-2 rounded-full border border-white/10 hover:bg-primary hover:text-accent transition-all duration-300"
                            >
                                {wishlist.includes(item.id) ? <FaHeart className="text-primary group-hover:text-accent" /> : <FaRegHeart className="text-neutral/40" />}
                            </button>
                           </div>
                        )}

                        <div className="flex-grow w-full">
                          <div className={`flex ${cat.category === 'Takoyaki' ? 'flex-col items-center mb-6' : 'justify-between items-end mb-2'} gap-4`}>
                            <h4 className="text-xl md:text-2xl font-black text-neutral group-hover:text-primary transition-colors uppercase tracking-tight">
                              {item.name}
                            </h4>
                            <div className="flex items-center gap-1 ml-4 cursor-pointer" onClick={() => fetchReviews(item.id)}>
                                {item.review_count > 0 ? (
                                    <>
                                        <FaStar className="text-primary text-xs" />
                                        <span className="text-xs font-bold text-neutral">{parseFloat(item.average_rating).toFixed(1)}</span>
                                        <span className="text-[10px] text-neutral/40">({item.review_count})</span>
                                    </>
                                ) : (
                                    <span className="text-[10px] text-neutral/20 italic">No reviews</span>
                                )}
                            </div>
                            {cat.category !== 'Takoyaki' && <div className="flex-grow border-b-2 border-dotted border-white/10 mb-2"></div>}
                            {item.price && (!item.variants || item.variants.length === 0) && (
                              <span className="text-primary font-black text-2xl">₱{parseFloat(item.price).toFixed(0)}</span>
                            )}
                          </div>

                          {item.note && (
                            <p className={`text-neutral/40 text-sm italic mb-4 font-playfair ${cat.category === 'Takoyaki' ? 'text-center' : ''}`}>{item.note}</p>
                          )}

                          {item.variants && item.variants.length > 0 && (
                            <div className="grid grid-cols-1 gap-2 mt-4">
                              {item.variants.map((v, vi) => (
                                <div key={vi} className="flex justify-between items-center text-sm md:text-base group/var">
                                  <div className="flex items-center gap-2">
                                    {user && item.is_available && (
                                      <button
                                        onClick={() => handleAddToCart(item, v)}
                                        className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-accent transition-all"
                                      >
                                        <FaPlus size={10} />
                                      </button>
                                    )}
                                    <span className={`${item.is_available ? 'text-neutral/60 group-hover/var:text-neutral' : 'text-neutral/20'} transition-colors`}>{v.label}</span>
                                  </div>
                                  <div className="flex-grow border-b border-dotted border-white/5 mx-3 opacity-30"></div>
                                  <span className="text-primary/80 font-bold group-hover/var:text-primary transition-colors">₱{v.price}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {user && (
                            <div className="mt-6 flex justify-end">
                               <button
                                  onClick={() => handleAddToCart(item)}
                                  disabled={!item.is_available}
                                  className={`px-6 py-2 ${item.is_available ? 'bg-primary/10 text-primary hover:bg-primary hover:text-accent' : 'bg-neutral/5 text-neutral/20 cursor-not-allowed'} font-black uppercase text-[10px] tracking-widest rounded-lg flex items-center gap-2 transition-all border ${item.is_available ? 'border-primary/20' : 'border-neutral/10'}`}
                                >
                                  <FaShoppingCart /> {!item.is_available ? 'Sold Out' : (item.variants?.length > 0 ? 'Select Base' : 'Add to Cart')}
                                </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20">
                <p className="text-neutral/40 italic">No items found matching your search.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Ordering */}
        <div className="mt-32 p-10 bg-gradient-to-br from-primary/10 to-transparent rounded-[3rem] border border-primary/20 text-center">
            <h3 className="text-3xl font-playfair font-bold text-neutral mb-4">Ready to Taste Excellence?</h3>
            <p className="text-neutral/60 mb-8 max-w-md mx-auto">Call us directly or message us on Facebook for fast delivery in Irosin.</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                <a href="tel:09958702671" className="btn-primary flex items-center gap-3">
                  <FaPhoneAlt /> 0995 870 2671
                </a>
                <a href="https://www.facebook.com/isogoodsdiner" target="_blank" rel="noopener noreferrer" className="btn-outline">
                  Facebook Messenger
                </a>
            </div>
        </div>
      </div>

      {/* Reviews Modal */}
      <AnimatePresence>
          {selectedProductReviews && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-secondary/95 backdrop-blur-xl"
                    onClick={() => setSelectedProductReviews(null)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative z-10 w-full max-w-lg bg-accent border border-white/10 rounded-[3rem] p-8 md:p-10 shadow-2xl flex flex-col max-h-[80vh]"
                  >
                      <h3 className="text-2xl font-playfair font-bold text-neutral italic mb-6">
                        Product <span className="text-primary not-italic">Reviews</span>
                      </h3>

                      <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/5">
                          <div className="text-4xl font-black text-primary">{parseFloat(selectedProductReviews.stats.average_rating || 0).toFixed(1)}</div>
                          <div>
                              <div className="flex text-primary">
                                  {[1, 2, 3, 4, 5].map(star => (
                                      <FaStar key={star} fill={star <= Math.round(selectedProductReviews.stats.average_rating) ? 'currentColor' : 'none'} className="w-4 h-4" />
                                  ))}
                              </div>
                              <p className="text-[10px] text-neutral/40 uppercase tracking-widest mt-1">Based on {selectedProductReviews.stats.review_count} reviews</p>
                          </div>
                      </div>

                      <div className="overflow-y-auto pr-4 no-scrollbar space-y-6 flex-grow">
                          {selectedProductReviews.reviews.length > 0 ? (
                              selectedProductReviews.reviews.map((rev, ri) => (
                                  <div key={ri} className="space-y-2">
                                      <div className="flex justify-between items-start">
                                          <p className="text-sm font-bold text-neutral">{rev.user_name}</p>
                                          <div className="flex text-primary scale-75 origin-right">
                                              {[1, 2, 3, 4, 5].map(star => (
                                                  <FaStar key={star} fill={star <= rev.rating ? 'currentColor' : 'none'} className="w-4 h-4" />
                                              ))}
                                          </div>
                                      </div>
                                      <p className="text-xs text-neutral/60 italic leading-relaxed">"{rev.comment || 'No comment provided.'}"</p>
                                      <p className="text-[9px] text-neutral/20 uppercase tracking-widest">{new Date(rev.created_at).toLocaleDateString()}</p>
                                  </div>
                              ))
                          ) : (
                              <p className="text-center text-neutral/40 italic py-10">No detailed reviews yet.</p>
                          )}
                      </div>

                      <button
                        onClick={() => setSelectedProductReviews(null)}
                        className="w-full mt-8 bg-white/5 text-neutral py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:text-secondary transition-all"
                      >
                          Close Reviews
                      </button>
                  </motion.div>
              </div>
          )}
      </AnimatePresence>
    </section>
  );
};

export default FullMenu;
