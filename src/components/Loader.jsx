import { motion } from 'framer-motion';
import logo from '../assets/logo.jpg';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-accent flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="mb-8 flex flex-col items-center"
      >
        <img src={logo} alt="Loading..." className="w-32 h-32 md:w-40 md:h-40 mb-4 rounded-full border-2 border-primary/20 p-2" />
        <h1 className="text-3xl md:text-4xl font-playfair font-bold text-primary tracking-widest text-center">
          ISOGOODS <span className="text-neutral font-light block md:inline">DINER</span>
        </h1>
      </motion.div>

      <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-full h-full bg-primary"
        />
      </div>

      <p className="mt-4 text-primary uppercase tracking-[0.3em] text-xs font-bold">
        Crafting Excellence
      </p>
    </div>
  );
};

export default Loader;
