import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryImages } from '../data/gallery';
import { FaExpandAlt, FaTimes, FaCamera } from 'react-icons/fa';

const Gallery = () => {
  const [filter, setFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);

  // Normalize categories for cleaner UI
  const imageCategoryMap = {
    'Food': 'Dishes',
    'Interior': 'Ambiance',
    'Drinks': 'Beverages'
  };

  const categories = ['All', ...new Set(galleryImages.map(img => imageCategoryMap[img.category] || img.category))];

  const filteredImages = filter === 'All'
    ? galleryImages
    : galleryImages.filter(img => (imageCategoryMap[img.category] || img.category) === filter);

  return (
    <section className="py-24 bg-secondary relative overflow-hidden" id="gallery">
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-primary font-poppins uppercase tracking-[0.3em] mb-4 text-sm font-bold"
          >
            A Visual Journey
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-playfair font-bold text-neutral mb-12"
          >
            Capturing Our <span className="text-primary italic">Essence</span>
          </motion.h3>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`text-xs uppercase tracking-widest transition-all duration-300 px-6 py-2 rounded-full border ${
                  filter === cat
                    ? 'bg-primary border-primary text-accent font-black shadow-lg shadow-primary/20'
                    : 'border-white/10 text-neutral/60 hover:border-primary/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry Grid */}
        <motion.div
          layout
          className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
        >
          <AnimatePresence mode='popLayout'>
            {filteredImages.map((image) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="relative group overflow-hidden rounded-3xl cursor-pointer shadow-xl shadow-black/20"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop';
                  }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-primary uppercase tracking-[0.2em] text-[10px] font-bold mb-2 flex items-center gap-2">
                      <FaCamera /> {imageCategoryMap[image.category] || image.category}
                    </p>
                    <div className="flex justify-between items-center">
                      <h4 className="text-white font-playfair text-2xl font-bold">{image.title}</h4>
                      <div className="w-10 h-10 bg-primary/20 backdrop-blur-md rounded-full flex items-center justify-center text-primary border border-primary/30">
                        <FaExpandAlt size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-accent/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-8 right-8 text-neutral/60 hover:text-primary transition-colors z-20"
              onClick={() => setSelectedImage(null)}
            >
              <FaTimes size={30} />
            </button>

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
              />
              <div className="mt-8 text-center">
                <p className="text-primary uppercase tracking-[0.3em] text-xs font-bold mb-2">
                  {selectedImage.category}
                </p>
                <h2 className="text-3xl md:text-4xl font-playfair font-bold text-neutral">
                  {selectedImage.title}
                </h2>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
