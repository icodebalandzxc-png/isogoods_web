import { Helmet } from 'react-helmet-async';
import ContactComponent from '../components/Contact';
import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <div className="pt-20">
      <Helmet>
        <title>Contact Us | Isogoods Diner</title>
        <meta name="description" content="Book a table or reach out to us for any inquiries." />
      </Helmet>

      <section className="py-20 bg-secondary text-center">
        <div className="container mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-playfair font-bold text-neutral mb-6"
          >
            Visit <span className="text-primary italic">Us</span>
          </motion.h1>
          <p className="text-neutral/60 max-w-2xl mx-auto uppercase tracking-widest text-sm">
            We'd love to hear from you.
          </p>
        </div>
      </section>

      <ContactComponent />
    </div>
  );
};

export default Contact;
