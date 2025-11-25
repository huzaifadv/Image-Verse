import { Mail } from 'lucide-react';

/**
 * Footer Component
 * Displays copyright information and contact email
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 bg-gradient-to-br from-[#008994] to-[#006d76] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Brand */}
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold">ImageVerse</h3>
              <p className="text-white/80 text-sm mt-1">Transform your images, instantly.</p>
            </div>

            {/* Contact Email */}
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-white/80" />
              <span className="text-white/80">Contact:</span>
              <a
                href="mailto:ihuzaifa.dev@gmail.com"
                className="text-white hover:underline transition-colors font-medium"
              >
                ihuzaifa.dev@gmail.com
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-6 pt-6 border-t border-white/20 text-center text-sm text-white/80">
            <p>&copy; {currentYear} ImageVerse | Built By Huzaifa</p>
          </div>
        </div>
      </footer>
  );
};

export default Footer;
