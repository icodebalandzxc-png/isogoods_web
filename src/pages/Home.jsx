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
        <title>Isogoods Diner | Fine Dining & Premium Cuisine in Irosin</title>
        <meta name="description" content="Experience the finest culinary journey at Isogoods Diner. Premium ingredients, elegant atmosphere, and exceptional service in Irosin, Sorsogon." />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Restaurant",
              "name": "Isogoods Diner",
              "image": "https://isogoods-web.vercel.app/logo.jpg",
              "url": "https://isogoods-web.vercel.app/",
              "telephone": "09958702671",
              "priceRange": "$$",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Near Bher Electronics",
                "addressLocality": "Irosin",
                "addressRegion": "Sorsogon",
                "postalCode": "4707",
                "addressCountry": "PH"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 12.70535,
                "longitude": 124.03235
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday"
                ],
                "opens": "09:00",
                "closes": "21:00"
              },
              "servesCuisine": ["Filipino", "Pasta", "Japanese", "Comfort Food"]
            }
          `}
        </script>
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
