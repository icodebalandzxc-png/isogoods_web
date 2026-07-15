import { Helmet } from 'react-helmet-async';
import AboutComponent from '../components/About';
import WhyChooseUs from '../components/WhyChooseUs';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="pt-20">
      <Helmet>
        <title>About Us | Isogoods Diner</title>
        <meta name="description" content="Learn more about our heritage, mission, and commitment to culinary excellence." />
      </Helmet>

      <section className="py-20 bg-secondary text-center">
        <div className="container mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-playfair font-bold text-neutral mb-6"
          >
            Our <span className="text-primary italic">Heritage</span>
          </motion.h1>
          <p className="text-neutral/60 max-w-2xl mx-auto uppercase tracking-widest text-sm">
            A tradition of passion and hospitality.
          </p>
        </div>
      </section>

      <AboutComponent />
      <WhyChooseUs />
    </div>
  );
};

export default About;
