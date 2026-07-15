import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { menuItems, menuCategories } from '../data/menu';
import { FaFire, FaArrowRight } from 'react-icons/fa';

const FeaturedMenu = () => {
  const [activeCategory, setActiveCategory] = useState("Best Sellers");

  const filteredItems = activeCategory === "Best Sellers"
    ? menuItems.filter(item => item.isBestSeller)
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <section className="py-24 bg-accent" id="menu">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-poppins uppercase tracking-[0.2em] mb-4"
          >
            Exquisite Taste
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-playfair font-bold text-neutral mb-12"
          >
            Our Featured Menu
          </motion.h3>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {menuCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-sm uppercase tracking-widest transition-all duration-300 relative pb-2 ${
                  activeCategory === cat ? 'text-primary' : 'text-neutral/60 hover:text-neutral'
                }`}
              >
                {cat}
                {activeCategory === cat && (
                  <motion.div
                    layoutId="activeFilter"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group glass rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-500 hover:-translate-y-2"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Price Tag */}
                  <div className="absolute top-4 right-4 bg-primary text-accent px-4 py-1.5 rounded-full text-sm font-black shadow-xl">
                    {item.price}
                  </div>

                  {/* Best Seller Badge */}
                  {item.isBestSeller && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter flex items-center gap-1 shadow-lg">
                      <FaFire /> Best Seller
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h4 className="text-xl font-playfair font-bold text-neutral mb-2 group-hover:text-primary transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-neutral/60 text-sm leading-relaxed mb-6 line-clamp-2">
                    {item.description}
                  </p>
                  <a
                    href={`https://m.me/isogoodsdiner?text=I'd like to order ${item.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-xs uppercase tracking-widest font-bold border-b-2 border-primary/30 pb-1 hover:border-primary transition-all flex items-center gap-2 w-fit"
                  >
                    Order via Messenger <FaArrowRight size={10} />
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View Full Menu CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 text-center"
        >
          <Link to="/menu" className="btn-primary inline-flex items-center gap-4 px-10">
            View Full Menu <FaArrowRight />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedMenu;

