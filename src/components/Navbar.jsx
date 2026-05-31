import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Download } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Experience', path: '/experience' },
    { name: 'Skills', path: '/skills' },
    { name: 'Contact', path: '/contact' },
  ];

  // Fungsi untuk menutup menu di tampilan Mobile
  const closeMobileMenu = () => setIsOpen(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* LOGO */}
          <Link 
            to="/" 
            onClick={closeMobileMenu}
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <img src="/Tahajjadan.png" alt="Logo" className="h-8 w-auto md:h-10" onError={(e) => e.target.style.display = 'none'} />
          </Link>

          {/* Desktop Menu (Tidak perlu fungsi klik apa-apa di sini) */}
          <div className="hidden md:flex space-x-1 items-center">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            
            <a 
              href="/CV_Tahajjadan.pdf" 
              target="_blank"
              rel="noreferrer"
              className="ml-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-all shadow-md shadow-blue-200 hover:shadow-lg"
            >
              <Download size={16} /> View CV
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50 focus:outline-none transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-100 shadow-lg transition-all duration-300 origin-top ${isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 h-0 overflow-hidden'}`}>
        <div className="px-4 pt-2 pb-6 space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={closeMobileMenu} // Menutup menu setelah link diklik
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <div className="pt-4 border-t border-gray-100 mt-2">
             <a 
              href="/CV_Tahajjadan.pdf" 
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl text-base font-medium active:scale-95 transition-transform"
            >
              <Download size={18} /> View CV
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;