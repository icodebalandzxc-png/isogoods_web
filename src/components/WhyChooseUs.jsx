import { motion } from 'framer-motion';
import { FaLeaf, FaUtensils, FaUserFriends, FaTruck, FaSmile, FaMoneyBillWave } from 'react-icons/fa';

const features = [
  {
    icon: <FaLeaf />,
    title: "Fresh Ingredients",
    desc: "We source only the finest, organic ingredients from local farmers."
  },
  {
    icon: <FaMoneyBillWave />,
    title: "Affordable Prices",
    desc: "Luxury dining experiences at prices that make sense."
  },
  {
    icon: <FaUtensils />,
    title: "Cozy Dining",
    desc: "Elegant atmosphere designed for comfort and intimacy."
  },
  {
    icon: <FaUserFriends />,
    title: "Friendly Staff",
    desc: "Professional service with a warm, personal touch."
  },
  {
    icon: <FaTruck />,
    title: "Fast Service",
    desc: "Timely preparation without compromising on quality."
  },
  {
    icon: <FaSmile />,
    title: "Delicious Meals",
    desc: "Award-winning recipes crafted by world-class chefs."
  }
];

const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-primary font-poppins uppercase tracking-[0.2em] mb-4">Quality First</h2>
          <h3 className="text-4xl md:text-5xl font-playfair font-bold text-neutral">Why Choose Us</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass p-8 rounded-2xl group hover:bg-primary/5 transition-all duration-500"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-3xl mb-6 group-hover:bg-primary group-hover:text-accent transition-all duration-500">
                {feature.icon}
              </div>
              <h4 className="text-xl font-playfair font-bold text-neutral mb-4">{feature.title}</h4>
              <p className="text-neutral/60 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
