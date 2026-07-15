import { motion } from 'framer-motion';
import { FaStar, FaFire, FaArrowRight, FaLeaf } from 'react-icons/fa';
import honeyImg from '../assets/images/honey.jpg';
import carbonaraImg from '../assets/images/carbonara_bread.jpg';
import bilaoImg from '../assets/images/bilao4.png';

const SignatureSpotlight = () => {
  const specials = [
    {
      id: 1,
      name: "Honey Butter Chix",
      category: "Legendary Classic",
      price: "₱130",
      description: "Our signature 4-piece chicken wings, double-fried for maximum crunch and glazed in our secret honey-butter reduction. A perfect balance of sweet, salty, and savory.",
      image: honeyImg,
      tags: ["Chef's Choice", "Local Honey"],
      rating: 5
    },
    {
      id: 2,
      name: "Premium Carbonara",
      category: "Pasta Excellence",
      price: "₱99",
      description: "Rich, velvety white sauce made with real cream and parmesan, topped with crispy bacon bits and served with our signature golden toasted bread.",
      image: carbonaraImg,
      tags: ["Creamy", "House-made Bread"],
      rating: 5
    },
    {
      id: 3,
      name: "The Grand Bilao",
      category: "Family Favorites",
      price: "₱650",
      description: "The ultimate Irosin feast. A massive spread of our best-selling chicken, pancit, and more. Designed for sharing stories and creating memories together.",
      image: bilaoImg,
      tags: ["Good for 10+", "Party Favorite"],
      rating: 4
    }
  ];

  return (
    <section className="py-24 bg-accent overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-primary font-poppins uppercase tracking-[0.3em] mb-4 text-sm font-bold"
          >
            The Masterpieces
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-playfair font-bold text-neutral"
          >
            Signature <span className="text-primary italic">Spotlight</span>
          </motion.h3>
        </div>

        <div className="space-y-32">
          {specials.map((item, index) => (
            <div
              key={item.id}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}
            >
              {/* Image Side */}
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="w-full lg:w-1/2 relative group"
              >
                <div className="relative aspect-[4/5] md:aspect-[16/9] lg:aspect-square overflow-hidden rounded-[2rem] shadow-2xl">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>

                {/* Floating Price Tag */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-6 -right-6 bg-primary text-accent w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-2xl z-10 border-4 border-accent"
                >
                  <span className="text-xs font-bold uppercase opacity-80">Only</span>
                  <span className="text-xl font-black">{item.price}</span>
                </motion.div>
              </motion.div>

              {/* Content Side */}
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="w-full lg:w-1/2 space-y-6"
              >
                <div className="flex items-center gap-4 text-primary">
                  <div className="flex gap-1">
                    {[...Array(item.rating)].map((_, i) => <FaStar key={i} size={14} />)}
                  </div>
                  <span className="text-xs uppercase tracking-widest font-bold opacity-60 border-l border-primary/30 pl-4">
                    {item.category}
                  </span>
                </div>

                <h4 className="text-4xl md:text-5xl font-playfair font-bold text-neutral leading-tight">
                  {item.name}
                </h4>

                <p className="text-neutral/60 text-lg leading-relaxed max-w-xl">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-3">
                  {item.tags.map(tag => (
                    <span key={tag} className="bg-white/5 border border-white/10 text-neutral/80 px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-2">
                      <FaLeaf size={10} className="text-primary" /> {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-8 flex flex-col sm:flex-row gap-6">
                  <a
                    href={`https://m.me/isogoodsdiner?text=I'd like to try the ${item.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary px-10 py-4 flex items-center justify-center gap-3"
                  >
                    Experience It Now <FaArrowRight />
                  </a>
                  <button className="text-neutral font-bold uppercase tracking-widest text-xs hover:text-primary transition-colors flex items-center justify-center gap-2">
                    View Nutrition Info
                  </button>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SignatureSpotlight;
