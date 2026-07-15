import { Helmet } from 'react-helmet-async';
import GalleryComponent from '../components/Gallery';
import { motion } from 'framer-motion';

const Gallery = () => {
  return (
    <div className="pt-20">
      <Helmet>
        <title>Gallery | Isogoods Diner</title>
        <meta name="description" content="A visual journey through our premium dishes and elegant interior." />
      </Helmet>

      <section className="py-20 bg-secondary text-center">
        <div className="container mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-playfair font-bold text-neutral mb-6"
          >
            Visual <span className="text-primary italic">Feast</span>
          </motion.h1>
          <p className="text-neutral/60 max-w-2xl mx-auto uppercase tracking-widest text-sm">
            Capturing the essence of luxury dining.
          </p>
        </div>
      </section>

      <GalleryComponent />
    </div>
  );
};

export default Gallery;
