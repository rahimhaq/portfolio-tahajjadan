import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white pt-1 pb-10">
        <div className="mt-8 pt-1 text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Rahiim Tahajjadan Zhaahir Haq. All rights reserved.
          </p>
        </div>
    </footer>
  );
};

export default Footer;