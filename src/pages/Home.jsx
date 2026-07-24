import { Helmet } from 'react-helmet-async';
import Hero from '../components/Hero';
import About from '../components/About';
import ManoK from '../components/ManoK';
import Delivery from '../components/Delivery';
import SignatureSpotlight from '../components/SignatureSpotlight';
import WhyChooseUs from '../components/WhyChooseUs';
import Gallery from '../components/Gallery';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Newsletter from '../components/Newsletter';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Isogoods Diner | Fine Dining & Premium Cuisine</title>
        <meta name="description" content="Experience the finest culinary journey at Isogoods Diner. Premium ingredients, elegant atmosphere, and exceptional service." />
      </Helmet>

      <Hero />
      <About />
      <ManoK />
      <Delivery />
      <SignatureSpotlight />
      <WhyChooseUs />
      <Gallery />
      <Testimonials />
      <Newsletter />
      <Contact />
    </>
  );
};

export default Home;
