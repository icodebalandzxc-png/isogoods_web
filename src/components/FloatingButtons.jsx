import { FaPhone, FaFacebookMessenger } from 'react-icons/fa';

const FloatingButtons = () => {
  return (
    <div className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-50 flex flex-col gap-4">
      <a
        href="tel:09958702671"
        className="w-10 h-10 md:w-12 md:h-12 bg-primary text-accent rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
        title="Call Us"
      >
        <FaPhone size={18} />
      </a>
      <a
        href="https://m.me/isogoodsdiner"
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 md:w-12 md:h-12 bg-[#0084FF] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
        title="Message Us"
      >
        <FaFacebookMessenger size={20} />
      </a>
    </div>
  );
};

export default FloatingButtons;
