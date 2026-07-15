import { motion } from 'framer-motion';
import chef3d from '../assets/images/isogood_3d.png';
import logo from '../assets/logo.jpg';

const About = () => {
  return (
    <section className="py-24 bg-secondary relative overflow-hidden" id="about">
      {/* Background Decorative Text */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none hidden lg:block">
        <h2 className="text-[25vw] font-black text-white leading-none">CHEF</h2>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative flex justify-center lg:justify-end order-2 lg:order-1"
          >
            <div className="relative w-full max-w-[500px] flex items-center justify-center">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>

              {/* Logo as Background behind the mascot */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                whileInView={{ opacity: 0.15, scale: 1.2, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute z-0 w-[120%] h-[120%] pointer-events-none"
              >
                <img
                  src={logo}
                  alt=""
                  className="w-full h-full object-contain rounded-full grayscale brightness-200"
                />
              </motion.div>

              <img
                src={chef3d}
                alt="Chef Isogood"
                className="relative z-10 w-full h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-500"
              />

              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 md:top-10 md:right-0 z-20 bg-primary text-accent p-4 rounded-2xl shadow-2xl rotate-12 hidden xs:block"
              >
                <p className="font-black text-xl leading-none italic">100%</p>
                <p className="text-[10px] uppercase font-bold tracking-tighter">Premium Taste</p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-primary font-poppins uppercase tracking-[0.2em] mb-4 font-bold">Meet Chef Isogood</h2>
            <h3 className="text-4xl md:text-6xl font-playfair font-bold text-neutral mb-8 leading-tight">
              A Legacy of <br />
              <span className="text-primary italic">Flavor & Passion</span>
            </h3>
            <p className="text-neutral/70 mb-6 text-lg leading-relaxed">
              At Isogoods Diner, our 3D chef mascot embodies our commitment to modern excellence while respecting traditional Filipino warmth. Every dish is a masterpiece crafted with precision and love.
            </p>
            <p className="text-neutral/70 mb-8 leading-relaxed">
              From our famous wings to our hearty silogs, we use only the freshest ingredients to ensure that every bite is "so good talaga!"
            </p>

            <div className="grid grid-cols-2 gap-8 mb-10">
              <div className="border-l-2 border-primary pl-4">
                <h4 className="text-primary font-bold text-3xl mb-1">2010</h4>
                <p className="text-neutral/60 text-xs uppercase tracking-widest">Est. Since</p>
              </div>
              <div className="border-l-2 border-primary pl-4">
                <h4 className="text-primary font-bold text-3xl mb-1">Sorsogon</h4>
                <p className="text-neutral/60 text-xs uppercase tracking-widest">Our Roots</p>
              </div>
            </div>

            <button className="btn-primary group flex items-center gap-3">
              Explore Our Story
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
