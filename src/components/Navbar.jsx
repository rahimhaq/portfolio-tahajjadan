import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Download } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Skills', path: '/skills' },
    { name: 'Contact', path: '/contact' },
  ];

  // Fungsi untuk scroll ke atas dengan halus
  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setIsOpen(false); // Tutup menu mobile jika sedang terbuka
  };

  return (
    <nav className="fixed top-0 w-full z-40 bg-white/40 backdrop-blur-md transition-all duration-400">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between items-center h-16">
          
          {/* LOGO: Klik scroll ke atas */}
          <Link 
            to="/" 
            onClick={handleScrollTop}
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <img src="/Tahajjadan.png" alt="Logo" className="h-10 w-auto" onError={(e) => e.target.style.display = 'none'} />
            {/* <span className="font-bold text-xl text-blue-900">Tahajjadan.</span> */}
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                // Jika link adalah Home, tambahkan fungsi scroll top
                onClick={link.path === '/' ? handleScrollTop : undefined}
                className={({ isActive }) =>
                  `text-base font-medium transition-colors duration-200 ${
                    isActive ? 'text-blue-600' : 'text-black hover:text-blue-500'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            
            <a 
              href="/CV_Tahajjadan.pdf" 
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              <Download size={16} /> View CV
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-blue-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={handleScrollTop} // Scroll top saat klik menu mobile
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;