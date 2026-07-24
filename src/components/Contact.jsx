import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaPhone, FaMapMarkerAlt, FaClock, FaFacebook } from 'react-icons/fa';
import { API_BASE_URL } from '../config';

const Contact = () => {
  const [settings, setSettings] = useState({
    restaurant_lat: '12.70535',
    restaurant_lng: '124.03235'
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/get_settings.php`)
      .then(res => res.json())
      .then(data => {
        if (data && data.restaurant_lat && data.restaurant_lng) {
          setSettings(data);
        }
      })
      .catch(err => console.error("Error fetching map settings:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/contact.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: data.message });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({ type: 'error', message: data.message || 'Something went wrong.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to connect to the server.' });
    } finally {
      setIsSubmitting(false);
    }
  };

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
                  <p className="text-neutral/60 leading-relaxed">
                    M.L. Quezon St. (Formerly Beecool Food House), alongside Bher Electronics, Irosin, Sorsogon
                  </p>
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
                  <p className="text-neutral/60">Daily: 10:00 AM – 10:00 PM</p>
                  <p className="text-primary text-[10px] font-black uppercase tracking-widest mt-1">Open Every Day</p>
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
            <form onSubmit={handleSubmit} className="space-y-6">
              {status.message && (
                <div className={`p-4 rounded-lg text-sm ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                  {status.message}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-primary font-bold">Name</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-neutral focus:border-primary outline-none transition-colors"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-primary font-bold">Email</label>
                  <input
                    type="email"
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-neutral focus:border-primary outline-none transition-colors"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-primary font-bold">Subject</label>
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-neutral focus:border-primary outline-none transition-colors"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-primary font-bold">Message</label>
                <textarea
                  rows="4"
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-neutral focus:border-primary outline-none transition-colors"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn-primary w-full disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Map */}
        <div className="mt-24 h-[450px] rounded-3xl overflow-hidden shadow-2xl">
          <iframe
            src={`https://www.google.com/maps?q=${settings.restaurant_lat},${settings.restaurant_lng}&hl=en&z=18&output=embed`}
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
