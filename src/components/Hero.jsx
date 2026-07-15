import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';

const Hero = () => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2000&auto=format&fit=crop")',
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img src={logo} alt="Logo" className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 rounded-full border-2 border-primary/30 p-1" />
          <h2 className="text-primary font-poppins uppercase tracking-[0.2em] md:tracking-[0.3em] mb-4 text-xs md:text-lg">
            Welcome to Isogoods Diner
          </h2>
          <h1 className="text-3xl sm:text-4xl md:text-7xl font-playfair font-bold text-neutral mb-8 leading-tight">
            Experience Great Food, <br />
            <span className="text-primary italic">Warm Hospitality</span>
          </h1>
          <p className="text-neutral/80 max-w-2xl mx-auto mb-10 text-lg font-light leading-relaxed">
            Indulge in a premium culinary journey where every dish tells a story of passion,
            freshness, and elegance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/menu" className="btn-primary w-full sm:w-auto">
              View Menu
            </Link>
            <Link to="/contact" className="btn-outline w-full sm:w-auto">
              Visit Us
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Floating Elements (Decorative) */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute top-1/4 right-10 w-24 h-24 bg-primary/10 rounded-full blur-3xl hidden md:block"
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute bottom-1/4 left-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl hidden md:block"
      />
    </section>
  );
};

export default Hero;
