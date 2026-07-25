import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { testimonials } from '../data/testimonials';
import { FaQuoteLeft, FaStar, FaFacebook } from 'react-icons/fa';

const Testimonials = () => {
  return (
    <section className="py-24 bg-accent relative overflow-hidden" id="testimonials">
      {/* Background Decorative Text */}
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-[0.02] pointer-events-none select-none">
        <span className="text-[20rem] font-playfair font-bold">REVIEWS</span>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-primary font-poppins uppercase tracking-[0.2em] mb-4 flex items-center justify-center gap-3">
            <FaFacebook className="text-[#0084FF]" /> Social Proof
          </h2>
          <h3 className="text-4xl md:text-5xl font-playfair font-bold text-neutral">What Our Guests Say</h3>
          <p className="text-neutral/40 mt-4 italic">Recommended by our community on Facebook</p>
        </div>

        <Swiper
          modules={[Pagination, Autoplay, EffectFade]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          loop={true}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
          className="pb-16"
        >
          {testimonials.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="glass p-10 rounded-3xl h-full flex flex-col items-center text-center relative border border-white/5 hover:border-primary/20 transition-colors">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < item.rating ? "text-primary" : "text-neutral/20"} />
                  ))}
                </div>
                <p className="text-neutral/80 italic mb-8 flex-grow leading-relaxed">
                  "{item.comment}"
                </p>
                <div className="flex items-center gap-4 border-t border-white/10 pt-6 w-full justify-center">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-full border-2 border-[#0084FF]/30 shadow-lg" />
                  <div className="text-left">
                    <h5 className="font-bold text-neutral">
                        {item.name ? (
                            item.name.split(' ').length > 1
                                ? `${item.name.split(' ')[0]} ${item.name.split(' ').pop().charAt(0)}.`
                                : item.name
                        ) : 'Anonymous'}
                    </h5>
                    <div className="flex items-center gap-2">
                       <span className="text-primary text-[10px] uppercase tracking-widest font-bold">{item.role}</span>
                       <span className="text-neutral/30 text-[10px]">•</span>
                       <span className="text-neutral/40 text-[10px]">{item.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
