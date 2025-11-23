/**
 * Footer Component
 * Displays copyright information and useful links
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

            {/* Links */}
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-white/80 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">Contact</a>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-6 pt-6 border-t border-white/20 text-center text-sm text-white/80">
            <p>&copy; {new Date().getFullYear()} ImageVerse | Built By Huzaifa</p>
          </div>
        </div>
      </footer>
  );
};

export default Footer;
