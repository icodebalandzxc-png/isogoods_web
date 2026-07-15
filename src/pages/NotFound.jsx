import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-accent px-6 text-center">
      <motion.h1
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-[10rem] md:text-[15rem] font-playfair font-bold text-primary/20 leading-none"
      >
        404
      </motion.h1>
      <div className="absolute">
        <h2 className="text-3xl md:text-5xl font-playfair font-bold text-neutral mb-6">Page Not Found</h2>
        <p className="text-neutral/60 mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed or is temporarily unavailable.
        </p>
        <Link to="/" className="btn-primary inline-block">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
