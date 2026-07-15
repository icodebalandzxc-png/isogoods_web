import { motion } from 'framer-motion';
import { FaPhone, FaMapMarkerAlt, FaClock, FaFacebook } from 'react-icons/fa';

const Contact = () => {
  return (
    <section className="py-24 bg-accent" id="contact">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-primary font-poppins uppercase tracking-[0.2em] mb-4">Get In Touch</h2>
            <h3 className="text-4xl md:text-5xl font-playfair font-bold text-neutral mb-8">Contact Us</h3>

            <div className="space-y-8 mb-12">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h4 className="text-neutral font-bold mb-1">Our Location</h4>
                  <p className="text-neutral/60">San Julian, Irosin, Sorsogon, Sorsogon, Philippines, 4707</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                  <FaPhone />
                </div>
                <div>
                  <h4 className="text-neutral font-bold mb-1">Phone Number</h4>
                  <p className="text-neutral/60">0995 870 2671</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                  <FaClock />
                </div>
                <div>
                  <h4 className="text-neutral font-bold mb-1">Business Hours</h4>
                  <p className="text-neutral/60">Mon - Fri: 11 AM - 11 PM</p>
                  <p className="text-neutral/60">Sat - Sun: 9 AM - 12 AM</p>
                </div>
              </div>
            </div>

            <a
              href="https://www.facebook.com/isogoodsdiner"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline flex items-center justify-center gap-3 w-fit"
            >
              <FaFacebook /> Follow Us on Facebook
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass p-8 md:p-12 rounded-3xl"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-primary font-bold">Name</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-neutral focus:border-primary outline-none transition-colors" placeholder="Your Name" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-primary font-bold">Email</label>
                  <input type="email" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-neutral focus:border-primary outline-none transition-colors" placeholder="Your Email" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-primary font-bold">Subject</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-neutral focus:border-primary outline-none transition-colors" placeholder="Subject" />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-primary font-bold">Message</label>
                <textarea rows="4" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-neutral focus:border-primary outline-none transition-colors" placeholder="Your Message"></textarea>
              </div>
              <button type="submit" className="btn-primary w-full">Send Message</button>
            </form>
          </motion.div>
        </div>

        {/* Map */}
        <div className="mt-24 h-[450px] rounded-3xl overflow-hidden shadow-2xl">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3891.9566275465243!2d124.03061!3d12.705!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a0c49987817e99%3A0x6b696f0592931a7!2sSan%20Julian%2C%20Irosin%2C%20Sorsogon!5e0!3m2!1sen!2sph!4v1700000000000!5m2!1sen!2sph"
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Contact;
