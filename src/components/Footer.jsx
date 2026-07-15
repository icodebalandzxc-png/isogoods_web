import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import logo from '../assets/logo.jpg';

const Footer = () => {
  return (
    <footer className="bg-accent border-t border-white/5 pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-4">
              <img src={logo} alt="Isogoods Diner" className="h-16 w-16 object-contain rounded-full border border-primary/20 p-1" />
              <span className="text-2xl font-playfair font-bold text-primary tracking-widest">
                ISOGOODS <br /><span className="text-neutral font-light">DINER</span>
              </span>
            </Link>
            <p className="text-neutral/60 leading-relaxed">
              Elevating the art of dining with premium ingredients and exceptional service. Join us for a journey of flavors.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/isogoodsdiner" target="_blank" rel="noopener noreferrer" className="w-10 h-10 glass rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-accent transition-all duration-300">
                <FaFacebook />
              </a>
              <a href="#" className="w-10 h-10 glass rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-accent transition-all duration-300">
                <FaInstagram />
              </a>
              <a href="#" className="w-10 h-10 glass rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-accent transition-all duration-300">
                <FaTwitter />
              </a>
              <a href="#" className="w-10 h-10 glass rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-accent transition-all duration-300">
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-neutral font-bold text-lg mb-8 uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-4">
              {['Home', 'Menu', 'Gallery', 'About', 'Contact'].map((link) => (
                <li key={link}>
                  <Link to={`/${link.toLowerCase() === 'home' ? '' : link.toLowerCase()}`} className="text-neutral/60 hover:text-primary transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className="text-neutral font-bold text-lg mb-8 uppercase tracking-widest">Hours</h4>
            <ul className="space-y-4 text-neutral/60">
              <li className="flex justify-between">
                <span>Mon - Thu:</span>
                <span className="text-neutral">11:00 - 23:00</span>
              </li>
              <li className="flex justify-between">
                <span>Fri - Sat:</span>
                <span className="text-neutral">11:00 - 00:00</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday:</span>
                <span className="text-neutral">09:00 - 22:00</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-neutral font-bold text-lg mb-8 uppercase tracking-widest">Location</h4>
            <address className="not-italic text-neutral/60 space-y-4">
              <p>San Julian, Irosin, Sorsogon, Sorsogon, Philippines, 4707</p>
              <p>Email: info@isogoodsdiner.com</p>
              <p>Phone: 0995 870 2671</p>
            </address>
          </div>
        </div>

        <div className="border-t border-white/10 pt-12 text-center text-neutral/40 text-sm">
          <p>© {new Date().getFullYear()} Isogoods Diner. All rights reserved. Designed for Excellence.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
