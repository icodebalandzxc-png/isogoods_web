import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUtensils, FaCoffee, FaIceCream, FaHamburger, FaSearch } from 'react-icons/fa';

// Import images
import carbonaraImg from '../assets/images/carbonara_bread.jpg';
import spaghettiImg from '../assets/images/spaghetti_bread.jpg';
import pancitImg from '../assets/images/pancit.jpg';
import lomiImg from '../assets/images/lomi.jpg';
import breakfastImg from '../assets/images/breakfast.jpg';
import friesImg from '../assets/images/fries.jpg';
import sandwichImg from '../assets/images/sandwich.jpg';
import honeyImg from '../assets/images/honey.jpg';
import buffaloImg from '../assets/images/buffalo.jpg';
import barbequeImg from '../assets/images/barbeque.jpg';
import soyImg from '../assets/images/soy.jpg';
import friedImg from '../assets/images/fried.jpg';
import lutongBahayImg from '../assets/images/lutong bahay.jpg';
import chickenSpecialtiesImg from '../assets/images/chicken specialties.jpg';
import lumpiangShanghaiImg from '../assets/images/lumpiang shanghai.jpg';
import sizzlingImg from '../assets/images/sizzling.jpg';
import hamAndCheeseImg from '../assets/images/ham and cheese.jpg';
import baconAndCheeseImg from '../assets/images/bacon and cheese.jpg';
import shrimpWithCheeseImg from '../assets/images/shrimp with cheese.jpg';
import coldBrewImg from '../assets/images/cold brew.jpg';
import desertImg from '../assets/images/desert.png';
import shakeImg from '../assets/images/shake.png';
import bilao1 from '../assets/images/bilao1.jpg';
import bilao2 from '../assets/images/bilao2.jpg';
import bilao3 from '../assets/images/bilao3.jpg';
import bilao4 from '../assets/images/bilao4.png';

const FullMenu = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const scrollRef = useRef(null);

  const menuData = [
    {
      category: "Pasta",
      icon: <FaUtensils />,
      items: [
        {
          name: "Carbonara",
          image: carbonaraImg,
          variants: [{ label: "W/ toasted bread", price: "99" }, { label: "W/ fries", price: "150" }, { label: "W/ fried chicken", price: "170" }]
        },
        {
          name: "Spaghetti",
          image: spaghettiImg,
          variants: [{ label: "W/ toasted bread", price: "99" }, { label: "W/ fries", price: "150" }, { label: "W/ fried chicken", price: "170" }]
        },
      ]
    },
    {
      category: "Pancit or Bihon",
      icon: <FaUtensils />,
      items: [
        {
          name: "Pancit Bihon",
          image: pancitImg,
          variants: [
            { label: "Regular (Good for sharing)", price: "160" },
            { label: "12\" (Good for 6-8 pax)", price: "410" },
            { label: "14\" (Good for 10-12 pax)", price: "690" },
            { label: "16\" (Good for 14-16 pax)", price: "1040" },
          ]
        },
      ]
    },
    {
      category: "Lomi",
      icon: <FaUtensils />,
      items: [
        {
          name: "Lomi",
          image: lomiImg,
          variants: [
            { label: "Regular (Good for 2-3 pax)", price: "160" },
            { label: "Overload (Good for 2-3 pax)", price: "280" },
          ],
          note: "Overload includes: boiled egg, lechon kawali"
        },
      ]
    },
    {
      category: "Breakfast",
      icon: <FaUtensils />,
      items: [
        {
          name: "Java/plain rice",
          image: breakfastImg,
          variants: [
            { label: "Egg", price: "40" },
            { label: "Siomai", price: "45" },
            { label: "Ham", price: "55" },
            { label: "Hotdog", price: "55" },
            { label: "Spam", price: "60" },
            { label: "Shanghai", price: "70" },
          ]
        },
      ]
    },
    {
      category: "Sandwich",
      icon: <FaHamburger />,
      items: [
        {
          name: "Bang Sandwiches",
          image: sandwichImg,
          variants: [
            { label: "Chick n' Bang", price: "130" },
            { label: "Spam n' Bang", price: "100" },
            { label: "Tuna n' Bang", price: "100" },
            { label: "Ham n' cheese Bang", price: "100" },
            { label: "Bacon n' Bang", price: "110" },
          ]
        },
      ]
    },
    {
      category: "Fries",
      icon: <FaHamburger />,
      items: [
        {
          name: "Fries",
          image: friesImg,
          variants: [
            { label: "Regular", price: "55" },
            { label: "Cheese", price: "65" },
            { label: "Sour Cream", price: "65" },
            { label: "BBQ", price: "65" },
            { label: "Overload (Good for 2-3 pax)", price: "170" },
          ]
        },
      ]
    },
    {
      category: "Lutong Bahay",
      icon: <FaUtensils />,
      items: [
        {
          name: "Pork Specialties",
          image: lutongBahayImg,
          variants: [
            { label: "Nilagang Baboy", price: "260" },
            { label: "Adobong Baboy", price: "260" },
            { label: "Sinigang na Baboy", price: "260" },
            { label: "Pork Menudo", price: "290" },
          ],
          note: "Good for 2-3 pax"
        },
        {
          name: "Chicken Specialties",
          image: chickenSpecialtiesImg,
          variants: [
            { label: "Tinolang Manok", price: "240" },
            { label: "Chicken Afritada", price: "240" },
            { label: "Chicken Adobo", price: "240" },
          ],
          note: "Good for 2-3 pax"
        },
        {
          name: "Extras & Veggies",
          image: lumpiangShanghaiImg,
          variants: [
            { label: "Lumpiang Shanghai (10pcs)", price: "230" },
            { label: "Chopsuey (2-3 pax)", price: "180" },
          ]
        },
      ]
    },
    {
      category: "Chix Rice Meal",
      icon: <FaUtensils />,
      items: [
        {
          name: "Flavored Chix Meal (4pcs)",
          image: honeyImg,
          variants: [
            { label: "Honey Butter", price: "130" },
            { label: "Buffalo", price: "130" },
            { label: "Barbeque", price: "130" },
            { label: "Soy Garlic", price: "130" },
          ],
          note: "Served with rice"
        },
        {
          name: "Fried Chix + Dip",
          image: friedImg,
          variants: [
            { label: "2 PCS chx + rice", price: "65" },
            { label: "4 PCS chx + rice", price: "130" },
          ]
        },
        {
          name: "Meal Extras",
          variants: [
            { label: "Plain Rice", price: "15" },
            { label: "Java Rice", price: "20" },
            { label: "Tinapa (3 pax)", price: "80" }
          ]
        },
      ]
    },
    {
      category: "Sizzling Plates",
      icon: <FaUtensils />,
      items: [
        {
          name: "Sizzling Plates",
          image: sizzlingImg,
          variants: [
            { label: "Lechon Kawali (Solo)", price: "120" },
            { label: "Lechon Kawali (Platter)", price: "310" },
            { label: "Pork Sisig (Solo)", price: "110" },
            { label: "Pork Sisig (Platter)", price: "280" },
            { label: "Chicken (Solo)", price: "110" },
          ]
        },
      ]
    },
    {
      category: "Takoyaki",
      icon: <FaUtensils />,
      items: [
        {
          name: "Ham Takoyaki",
          image: hamAndCheeseImg,
          variants: [
            { label: "4 pcs", price: "40" }, { label: "28 pcs", price: "250" }, { label: "56 pcs", price: "490" },
            { label: "4 pcs w/ Cheese", price: "50" }, { label: "28 pcs w/ Cheese", price: "325" }, { label: "56 pcs w/ Cheese", price: "640" }
          ]
        },
        {
          name: "Cheese Takoyaki",
          variants: [
            { label: "4 pcs", price: "40" }, { label: "28 pcs", price: "250" }, { label: "56 pcs", price: "490" },
            { label: "4 pcs Double Cheese", price: "50" }, { label: "28 pcs Double Cheese", price: "325" }, { label: "56 pcs Double Cheese", price: "640" }
          ]
        },
        {
          name: "Bacon Takoyaki",
          image: baconAndCheeseImg,
          variants: [
            { label: "4 pcs", price: "45" }, { label: "28 pcs", price: "285" }, { label: "56 pcs", price: "550" },
            { label: "4 pcs w/ Cheese", price: "55" }, { label: "28 pcs w/ Cheese", price: "355" }, { label: "56 pcs w/ Cheese", price: "690" }
          ]
        },
        {
          name: "Crab Takoyaki",
          variants: [
            { label: "4 pcs", price: "50" }, { label: "28 pcs", price: "325" }, { label: "56 pcs", price: "640" },
            { label: "4 pcs w/ Cheese", price: "60" }, { label: "28 pcs w/ Cheese", price: "390" }, { label: "56 pcs w/ Cheese", price: "760" }
          ]
        },
        {
          name: "Shrimp Takoyaki",
          image: shrimpWithCheeseImg,
          variants: [
            { label: "4 pcs", price: "50" }, { label: "28 pcs", price: "320" }, { label: "56 pcs", price: "620" },
            { label: "4 pcs w/ Cheese", price: "60" }, { label: "28 pcs w/ Cheese", price: "390" }, { label: "56 pcs w/ Cheese", price: "760" }
          ]
        },
        {
          name: "Octo Takoyaki",
          variants: [
            { label: "4 pcs", price: "60" }, { label: "28 pcs", price: "355" }, { label: "56 pcs", price: "690" },
            { label: "4 pcs w/ Cheese", price: "70" }, { label: "28 pcs w/ Cheese", price: "425" }, { label: "56 pcs w/ Cheese", price: "850" }
          ]
        },
      ]
    },
    {
      category: "Beverages",
      icon: <FaCoffee />,
      items: [
        { name: "Lemonade", variants: [{ label: "Uno", price: "45" }, { label: "Dos", price: "55" }] },
        { name: "Milktea", variants: [{ label: "Uno", price: "39" }, { label: "Dos", price: "49" }] },
        { name: "Fruitsoda", variants: [{ label: "Uno", price: "40" }, { label: "Dos", price: "50" }] },
      ]
    },
    {
      category: "Cold Brew",
      icon: <FaCoffee />,
      items: [
        {
          name: "Cold Brew Selection",
          image: coldBrewImg,
          variants: [
            { label: "Iced Americano", price: "39" },
            { label: "Latte", price: "59" },
            { label: "Mocha", price: "59" },
            { label: "Macchiato", price: "59" },
            { label: "Americano Frappe", price: "59" },
            { label: "Frappuccino", price: "59" },
            { label: "Cafe Late Frappe", price: "59" },
            { label: "Mocchaccino", price: "59" },
          ]
        }
      ]
    },
    {
      category: "Dessert",
      icon: <FaIceCream />,
      items: [
        {
          name: "Sweet Treats",
          image: desertImg,
          variants: [
            { label: "Special Halo-Halo", price: "85" },
            { label: "Leche Flan", price: "100" },
          ]
        }
      ]
    },
    {
      category: "Shake",
      icon: <FaCoffee />,
      items: [
        {
          name: "Fresh Shakes",
          image: shakeImg,
          variants: [
            { label: "Mango Shake", price: "69" },
            { label: "Strawberry Shake", price: "69" },
            { label: "Avocado Shake", price: "69" },
            { label: "Chocolate Shake", price: "69" },
            { label: "Java Chip Shake", price: "69" },
            { label: "Cheesecake Shake", price: "69" },
          ]
        }
      ]
    },
    {
      category: "Bilao",
      icon: <FaUtensils />,
      items: [
        { name: "Flavored Chicken", image: bilao4, variants: [{ label: "24 pcs", price: "650" }, { label: "35 pcs", price: "950" }, { label: "48 pcs", price: "1260" }] },
        { name: "Spaghetti", image: bilao2, variants: [{ label: "Medium (10 pax)", price: "845" }, { label: "Large (14 pax)", price: "1295" }] },
        { name: "Carbonara", image: bilao3, variants: [{ label: "Medium (10 pax)", price: "845" }, { label: "Large (14 pax)", price: "1295" }] },
        { name: "Sotanghon Guisado", image: bilao1, variants: [{ label: "Medium (10 pax)", price: "845" }, { label: "Large (14 pax)", price: "1295" }] },
        { name: "Pancit or Bihon", variants: [{ label: "12\" (6-8 pax)", price: "410" }, { label: "14\" (10-12 pax)", price: "690" }, { label: "16\" (14-16 pax)", price: "1040" }] },
        { name: "Shanghai", variants: [{ label: "25 pcs", price: "410" }, { label: "50 pcs", price: "800" }, { label: "100 pcs", price: "1550" }] },
      ]
    }
  ];

  const categories = ["All", ...menuData.map(cat => cat.category)];

  const filteredMenu = activeCategory === "All"
    ? menuData
    : menuData.filter(cat => cat.category === activeCategory);

  const searchItems = (data) => {
    if (!searchQuery) return data;
    return data.map(cat => ({
      ...cat,
      items: cat.items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(cat => cat.items.length > 0);
  };

  const finalMenu = searchItems(filteredMenu);

  return (
    <section className="py-12 bg-accent min-h-screen">
      <div className="container mx-auto px-4">
        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-10 relative">
          <input
            type="text"
            placeholder="Search our menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-secondary border border-white/10 rounded-full py-4 px-12 text-neutral focus:border-primary outline-none transition-all"
          />
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" />
        </div>

        {/* Category Scrollbar */}
        <div className="flex overflow-x-auto pb-6 mb-12 no-scrollbar gap-4 sticky top-20 z-30 bg-accent/80 backdrop-blur-sm -mx-4 px-4 py-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-bold transition-all border ${
                activeCategory === cat
                  ? 'bg-primary text-accent border-primary shadow-lg shadow-primary/20'
                  : 'bg-transparent text-neutral/60 border-white/10 hover:border-primary/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="space-y-24">
          <AnimatePresence mode="wait">
            {finalMenu.length > 0 ? (
              finalMenu.map((cat, catIdx) => (
                <motion.div
                  key={cat.category}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  {/* Category Header (Brush Stroke Style) */}
                  <div className="flex justify-center mb-16">
                    <div className="relative inline-block">
                       <div className="bg-neutral text-accent px-12 py-3 font-black uppercase text-3xl md:text-4xl tracking-[0.2em] relative z-10 skew-x-[-10deg]">
                        {cat.category}
                      </div>
                      <div className="absolute -inset-2 bg-primary transform rotate-2 z-0 skew-x-[-10deg] opacity-80"></div>
                      <div className="absolute -bottom-4 -right-4 w-12 h-12 text-primary opacity-20 transform rotate-45">
                        <FaUtensils size={40} />
                      </div>
                    </div>
                  </div>

                  <div className={`grid grid-cols-1 ${cat.category === 'Bilao' ? 'max-w-3xl mx-auto' : 'md:grid-cols-2'} gap-x-16 gap-y-12`}>
                    {cat.items.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className={`group flex flex-col ${
                          cat.category === 'Takoyaki'
                            ? 'items-center text-center'
                            : cat.category === 'Bilao'
                              ? i % 2 === 0
                                ? 'sm:flex-row-reverse items-center sm:items-start'
                                : 'sm:flex-row items-center sm:items-start'
                              : 'sm:flex-row items-center sm:items-start'
                        } gap-8`}
                      >
                        {item.image && (
                          <div className="w-40 h-40 md:w-56 md:h-56 shrink-0 rounded-full overflow-hidden border-2 border-primary/30 p-1 group-hover:border-primary transition-colors duration-500 shadow-xl shadow-black/50">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-700"
                            />
                          </div>
                        )}

                        <div className="flex-grow w-full">
                          <div className={`flex ${cat.category === 'Takoyaki' ? 'flex-col items-center mb-6' : 'justify-between items-end mb-2'} gap-4`}>
                            <h4 className="text-xl md:text-2xl font-black text-neutral group-hover:text-primary transition-colors uppercase tracking-tight">
                              {item.name}
                            </h4>
                            {cat.category !== 'Takoyaki' && <div className="flex-grow border-b-2 border-dotted border-white/10 mb-2"></div>}
                            {item.price && (
                              <span className="text-primary font-black text-2xl">₱{item.price}</span>
                            )}
                          </div>

                          {item.note && (
                            <p className={`text-neutral/40 text-sm italic mb-4 font-playfair ${cat.category === 'Takoyaki' ? 'text-center' : ''}`}>{item.note}</p>
                          )}

                          {item.variants && (
                            <div className="grid grid-cols-1 gap-2 mt-4">
                              {item.variants.map((v, vi) => (
                                <div key={vi} className="flex justify-between items-center text-sm md:text-base group/var">
                                  <span className="text-neutral/60 group-hover/var:text-neutral transition-colors">{v.label}</span>
                                  <div className="flex-grow border-b border-dotted border-white/5 mx-3 opacity-30"></div>
                                  <span className="text-primary/80 font-bold group-hover/var:text-primary transition-colors">₱{v.price}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20">
                <p className="text-neutral/40 italic">No items found matching your search.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Ordering */}
        <div className="mt-32 p-10 bg-gradient-to-br from-primary/10 to-transparent rounded-[3rem] border border-primary/20 text-center">
            <h3 className="text-3xl font-playfair font-bold text-neutral mb-4">Ready to Taste Excellence?</h3>
            <p className="text-neutral/60 mb-8 max-w-md mx-auto">Call us directly or message us on Facebook for fast delivery in Irosin.</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                <a href="tel:09958702671" className="btn-primary flex items-center gap-3">
                  <FaPhoneAlt /> 0995 870 2671
                </a>
                <a href="https://www.facebook.com/isogoodsdiner" target="_blank" rel="noopener noreferrer" className="btn-outline">
                  Facebook Messenger
                </a>
            </div>
        </div>
      </div>
    </section>
  );
};

// Add some helper icons if not imported correctly
const FaPhoneAlt = () => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z"></path></svg>
);

export default FullMenu;
