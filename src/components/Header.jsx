import { Link } from 'react-router-dom';
import { useState } from 'react';

/**
 * Header Component
 * Navigation header with glassmorphism effect and responsive mobile menu
 */
const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/40 backdrop-blur-md  border-b border-gray-200/60 transition-colors duration-300">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: '#008994' }}
            >
              <span className="text-white text-xl font-bold">IV</span>
            </div>
            <h1 className="text-2xl font-bold text-black transition-colors duration-300">
              ImageVerse
            </h1>
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="hidden md:flex space-x-10 text-gray-900 transition-colors duration-300">

            <li>
              <a
                href="/"
                className="hover:text-[#008994] font-medium transition-colors"
              >
                Home
              </a>
            </li>

            <li>
              <a
                href="#about"
                className="hover:text-[#008994] font-medium transition-colors"
              >
                About
              </a>
            </li>

            <li>
              <a
                href="#tools"
                className="hover:text-[#008994] font-medium transition-colors"
              >
                Tools
              </a>
            </li>

            <li>
              <a
                href="#tools"
                className="hover:text-[#008994] font-medium transition-colors"
              >
                Contact
              </a>
            </li>

          </ul>

          <button className="px-8 cursor-pointer py-3 bg-[#008994] text-white rounded-full text-[15px] font-medium hover:bg-[#006d76] transition-colors duration-300 md:block hidden">
            Give Feedback
          </button>

          {/* Mobile Menu Button (Hamburger) */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5 focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            <span
              className={`block w-6 h-0.5 bg-gray-900 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-gray-900 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''
                }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-gray-900 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
            ></span>
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
          onClick={closeMobileMenu}
        ></div>
      )}

      {/* Mobile Menu Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-70 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">ImageVerse</h2>
            <button
              onClick={closeMobileMenu}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6 text-gray-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Links */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-2 px-4">
              <li>
                <a
                  href="#home"
                  onClick={closeMobileMenu}
                  className="block py-3 px-4 rounded-lg text-gray-900 hover:bg-[#008994]/10 hover:text-[#008994] font-medium transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={closeMobileMenu}
                  className="block py-3 px-4 rounded-lg text-gray-900 hover:bg-[#008994]/10 hover:text-[#008994] font-medium transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#tools"
                  onClick={closeMobileMenu}
                  className="block py-3 px-4 rounded-lg text-gray-900 hover:bg-[#008994]/10 hover:text-[#008994] font-medium transition-colors"
                >
                  Tools
                </a>
              </li>

              <li>
                <a
                  href="#contact"
                  onClick={closeMobileMenu}
                  className="block py-3 px-4 rounded-lg text-gray-900 hover:bg-[#008994]/10 hover:text-[#008994] font-medium transition-colors"
                >
                  Contact
                </a>
              </li>

            <button className="px-5 ml-2 mt-2 cursor-pointer py-2 bg-[#008994] text-white rounded-full text-[14px] font-medium hover:bg-[#006d76] transition-colors duration-300">
              Give Feedback
            </button>
            </ul>


          </nav>
        </div>
      </aside>
    </>
  );
};

export default Header;
