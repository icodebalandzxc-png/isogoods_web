import { motion } from 'framer-motion';
import { FaMotorcycle, FaPhoneAlt } from 'react-icons/fa';
import sarappyLogo from '../assets/images/sarappy.jpg';
import moonrideLogo from '../assets/images/moonride.jpg';

const Delivery = () => {
  return (
    <section className="py-20 bg-primary overflow-hidden relative">
      {/* Decorative background text */}
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-5 pointer-events-none select-none">
        <h2 className="text-[20vw] font-black text-accent whitespace-nowrap">WE DELIVER</h2>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2 text-accent"
          >
            <h2 className="text-accent/80 font-poppins uppercase tracking-[0.3em] mb-4 font-bold">
              It's so good talaga!
            </h2>
            <h3 className="text-4xl md:text-6xl font-playfair font-bold mb-6 leading-tight">
              You Stay At Home, <br />
              <span className="text-white italic">We Deliver!</span>
            </h3>
            <p className="text-accent/80 text-lg mb-8 max-w-lg leading-relaxed">
              Craving for your favorites? Get delicious and affordable meals delivered right to your doorstep.
              From heavy silogs to sweet treats, we've got you covered!
            </p>

            <div className="flex flex-wrap gap-6 mb-10">
              <div className="flex items-center gap-3 bg-accent text-primary px-6 py-3 rounded-full font-bold shadow-xl">
                <FaPhoneAlt />
                <span>0995 870 2671</span>
              </div>
              <a
                href="https://www.facebook.com/isogoodsdiner"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline border-accent text-accent hover:bg-accent hover:text-primary"
              >
                Order via Messenger
              </a>
            </div>

            <div className="flex items-center gap-8">
              <p className="font-bold uppercase tracking-widest text-sm opacity-60">Delivery Partners:</p>
              <div className="flex items-center gap-6">
                <img src={sarappyLogo} alt="Sarappy" className="h-12 w-auto object-contain rounded-lg shadow-md hover:scale-105 transition-transform" />
                <img src={moonrideLogo} alt="Moonride" className="h-12 w-auto object-contain rounded-lg shadow-md hover:scale-105 transition-transform" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:w-1/2 relative"
          >
             <div className="relative z-10 bg-accent p-8 rounded-[2rem] shadow-2xl rotate-3 transform hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-accent text-3xl">
                    <FaMotorcycle />
                  </div>
                  <h4 className="text-2xl font-playfair font-bold text-neutral">Fast & Fresh</h4>
                </div>
                <ul className="grid grid-cols-2 gap-4">
                  {[
                    { title: "Breakfast", desc: "Heavy Silogs & Coffee" },
                    { title: "Lunch", desc: "Hearty Rice Meals" },
                    { title: "Snack", desc: "Quick Bites" },
                    { title: "Merienda", desc: "Halo-halo & Pancit" },
                    { title: "Dinner", desc: "Comfort Food" },
                    { title: "Dessert", desc: "Sweet Treats" }
                  ].map((item) => (
                    <li key={item.title} className="border-l-2 border-primary pl-4 py-2">
                      <p className="text-primary font-bold uppercase text-xs tracking-widest">{item.title}</p>
                      <p className="text-neutral/60 text-sm">{item.desc}</p>
                    </li>
                  ))}
                </ul>
             </div>
             {/* Decorative circle */}
             <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Delivery;
