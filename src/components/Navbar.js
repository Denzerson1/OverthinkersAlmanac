import React, { useEffect, useState } from 'react';

const Navbar = () => {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const maxScroll = 200; // Adjust this value to control when opacity reaches 100%
      const newOpacity = Math.min(1, scrollPosition / maxScroll);
      setOpacity(newOpacity);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50">
      <div
        className="max-w-7xl mx-auto rounded-lg px-6 py-3 flex items-center bg-gradient-to-r from-[white] to-[gray-100] text-white transition-opacity duration-300"
        style={{ opacity }}
      >
        <div className="flex items-center">
          <img src="/logo.png" alt="Logo" className="h-12 w-18" />
        </div>
        <div className="flex-1 flex justify-center space-x-6">
          <a href="#" className="hover:underline">Download</a>
          <a href="#" className="hover:underline">Pricing</a>
          <a href="#" className="hover:underline">Team</a>
          <a href="#" className="hover:underline">Blog</a>
          <a href="#" className="hover:underline">Contact</a>
        </div>
        <button className="ml-4 bg-white text-black px-4 py-2 rounded-md flex items-center">
          What is this?<svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;