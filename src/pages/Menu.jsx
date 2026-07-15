import { Helmet } from 'react-helmet-async';
import FullMenu from '../components/FullMenu';
import { motion } from 'framer-motion';

const Menu = () => {
  return (
    <div className="pt-20">
      <Helmet>
        <title>Menu | Isogoods Diner</title>
        <meta name="description" content="Explore our extensive menu featuring Pasta, Lutong Bahay, Breakfast, and more." />
      </Helmet>

      <section className="py-20 bg-secondary text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2000&auto=format&fit=crop"
            alt="background"
            className="w-full h-full object-cover grayscale"
          />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-playfair font-bold text-neutral mb-6"
          >
            Our Complete <span className="text-primary italic">Menu</span>
          </motion.h1>
          <p className="text-neutral/60 max-w-2xl mx-auto uppercase tracking-widest text-sm">
            Delicious and affordable meals for everyone.
          </p>
        </div>
      </section>

      <FullMenu />
    </div>
  );
};

export default Menu;
