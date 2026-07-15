import { motion } from 'framer-motion';
import { FaFire, FaLeaf, FaHeart } from 'react-icons/fa';
import buffaloImg from '../assets/images/buffalo.jpg';
import honeyImg from '../assets/images/honey.jpg';
import barbequeImg from '../assets/images/barbeque.jpg';
import soyImg from '../assets/images/soy.jpg';
import friedImg from '../assets/images/fried.jpg';

const ManoK = () => {
  const flavors = [
    {
      name: "Buffalo",
      price: "130",
      desc: "Crispy deep-fried chicken wings tossed in a rich, buttery hot sauce with a bold spicy kick.",
      image: buffaloImg
    },
    {
      name: "Honey Butter",
      price: "130",
      desc: "Rich buttery sauce blended with sweet, sticky honey for the perfect balance of flavor.",
      image: honeyImg
    },
    {
      name: "Barbeque",
      price: "130",
      desc: "A sweet and tangy blend of brown sugar, honey, and vinegar with rich, smoky flavor.",
      image: barbequeImg
    },
    {
      name: "Soy Garlic",
      price: "130",
      desc: "Crispy and savory, coated in a rich soy sauce glaze with deep umami flavor.",
      image: soyImg
    },
    {
      name: "Fried",
      price: "130",
      desc: "Golden, crispy fried chicken seasoned to perfection and packed with juicy flavor.",
      image: friedImg
    }
  ];

  return (
    <section className="py-24 bg-[#0a0a0a] text-white overflow-hidden relative">
      {/* Smoking/Fire Background Effect */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1544131232-026880064d50?q=80&w=2000&auto=format&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'contrast(1.5) brightness(0.3)'
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>

        {/* Animated Sparks */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#ff4d00] rounded-full blur-[1px]"
            animate={{
              y: [0, -1000],
              x: [0, (Math.random() - 0.5) * 200],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              bottom: "-5%",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="absolute -top-10 right-10 md:right-20 w-32 h-32 md:w-40 md:h-40 border-4 border-[#ff4d00] rounded-full flex flex-col items-center justify-center rotate-12 hidden sm:flex"
          >
            <span className="text-xs font-bold uppercase">Made Fresh.</span>
            <span className="text-xs font-bold uppercase text-[#ff4d00]">Made</span>
            <span className="text-xs font-bold uppercase">Craveable.</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-6xl sm:text-8xl md:text-[10rem] font-black tracking-tighter text-white/90 leading-none mb-4"
            style={{
              textShadow: '4px 4px 0px #ff4d00',
              backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
            }}
          >
            MANO K
          </motion.h2>
          <div className="flex items-center justify-center gap-2 md:gap-4">
            <div className="h-1 w-8 md:w-12 bg-[#ff4d00] hidden xs:block"></div>
            <p className="text-lg md:text-2xl font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] text-[#ff4d00]">
              5 Flavors. 1 Legendary Experience.
            </p>
            <div className="h-1 w-8 md:w-12 bg-[#ff4d00] hidden xs:block"></div>
          </div>
        </div>

        {/* Flavors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-0 border-y border-white/10 mb-16">
          {flavors.map((flavor, index) => (
            <motion.div
              key={flavor.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group border-x border-white/5 hover:bg-white/5 transition-colors duration-500"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={flavor.image}
                  alt={flavor.name}
                  className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60"></div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-2xl font-black uppercase mb-2 group-hover:text-[#ff4d00] transition-colors">{flavor.name}</h3>
                <div className="inline-block bg-[#ff4d00] text-white font-bold px-4 py-1 rounded-full text-lg mb-4">
                  ₱{flavor.price}
                </div>
                <p className="text-sm text-gray-400 leading-relaxed min-h-[80px]">
                  {flavor.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pricing Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start bg-gradient-to-br from-white/5 to-transparent p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-white/10">
          {/* Ala Carte */}
          <div>
            <h4 className="text-[#ff4d00] font-black text-3xl uppercase mb-6 flex items-center gap-3">
              <span className="w-2 h-8 bg-[#ff4d00]"></span>
              Ala Carte Options
            </h4>
            <p className="italic text-gray-400 mb-8 uppercase tracking-widest text-sm">Pick the perfect portion for your craving!</p>
            <ul className="space-y-4">
              {[
                { qty: "6 pcs", price: "180" },
                { qty: "8 pcs", price: "240" },
                { qty: "12 pcs", price: "325" }
              ].map(item => (
                <li key={item.qty} className="flex justify-between items-center border-b border-white/5 pb-4 group">
                  <span className="text-xl font-bold group-hover:translate-x-2 transition-transform">{item.qty}</span>
                  <span className="text-[#ff4d00] font-black text-2xl">₱{item.price}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bilao */}
          <div>
            <h4 className="text-[#ff4d00] font-black text-3xl uppercase mb-6 flex items-center gap-3">
              <span className="w-2 h-8 bg-[#ff4d00]"></span>
              Bilao
            </h4>
            <p className="italic text-gray-400 mb-8 uppercase tracking-widest text-sm">Wings made for sharing; flavored your way!</p>
            <ul className="space-y-4">
              {[
                { qty: "24 pcs", price: "650" },
                { qty: "35 pcs", price: "950" },
                { qty: "48 pcs", price: "1260" }
              ].map(item => (
                <li key={item.qty} className="flex justify-between items-center border-b border-white/5 pb-4 group">
                  <span className="text-xl font-bold group-hover:translate-x-2 transition-transform">{item.qty}</span>
                  <span className="text-[#ff4d00] font-black text-2xl">₱{item.price}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="mt-16 bg-[#ff4d00] p-4 flex flex-col md:flex-row justify-around items-center gap-6 rounded-2xl shadow-[0_0_50px_rgba(255,77,0,0.3)]">
          <div className="flex items-center gap-3 text-[#0a0a0a] font-black uppercase text-sm md:text-base">
            <FaFire className="text-2xl" />
            Hot. Crispy. Unstoppable.
          </div>
          <div className="hidden md:block w-px h-6 bg-[#0a0a0a]/20"></div>
          <div className="flex items-center gap-3 text-[#0a0a0a] font-black uppercase text-sm md:text-base">
            <FaLeaf className="text-2xl" />
            Freshly Made.
          </div>
          <div className="hidden md:block w-px h-6 bg-[#0a0a0a]/20"></div>
          <div className="flex items-center gap-3 text-[#0a0a0a] font-black uppercase text-sm md:text-base">
            <FaHeart className="text-2xl" />
            Always Satisfying.
          </div>
        </div>

        {/* Order Now CTA */}
        <div className="mt-12 text-center">
            <button className="bg-white text-[#ff4d00] hover:bg-[#ff4d00] hover:text-white px-12 py-4 rounded-full font-black text-xl uppercase tracking-widest transition-all duration-300 transform hover:scale-110 shadow-2xl">
                Order Now!
            </button>
            <p className="text-white/40 mt-4 uppercase tracking-[0.3em] text-xs">Your wings are waiting.</p>
        </div>
      </div>
    </section>
  );
};

export default ManoK;
