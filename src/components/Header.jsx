import { Link } from 'react-router-dom';
import { useState } from 'react';
import { X, Send, Mail, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';
import RequestFeature from './RequestFeature';

/**
 * Header Component
 * Navigation header with glassmorphism effect and responsive mobile menu
 */
const Header = () => {
  const [isRequestFeatureOpen, setIsRequestFeatureOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    feedback: '',
  });

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const openFeedbackModal = () => {
    setIsFeedbackOpen(true);
    setSubmitSuccess(false);
    closeMobileMenu();
  };

  const closeFeedbackModal = () => {
    setIsFeedbackOpen(false);
    setFormData({ email: '', feedback: '' });
    setSubmitSuccess(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
         access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY, // Replace with your actual Web3Forms access key
          email: formData.email,
          message: formData.feedback,
          subject: 'New Feedback from ImageVerse',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitSuccess(true);
        setFormData({ email: '', feedback: '' });
        setTimeout(() => {
          closeFeedbackModal();
        }, 2000);
      } else {
        alert('Failed to send feedback. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to send feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
              <Link
                to="/"
                className="hover:text-[#008994] font-medium transition-colors"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/about"
                className="hover:text-[#008994] font-medium transition-colors"
              >
                About
              </Link>
            </li>

            <li>
              <Link
                to="/tools"
                className="hover:text-[#008994] font-medium transition-colors"
              >
                Tools
              </Link>
            </li>

          </ul>

          <button
            isOpen={isRequestFeatureOpen}
            onClick={() => setIsRequestFeatureOpen(true)}
            className="px-8 cursor-pointer py-3 bg-[#008994] text-white rounded-full text-[15px] font-medium hover:bg-[#006d76] transition-colors duration-300 md:block hidden"
          >
            Request Feature
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
                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className="block py-3 px-4 rounded-lg text-gray-900 hover:bg-[#008994]/10 hover:text-[#008994] font-medium transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  onClick={closeMobileMenu}
                  className="block py-3 px-4 rounded-lg text-gray-900 hover:bg-[#008994]/10 hover:text-[#008994] font-medium transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/tools"
                  onClick={closeMobileMenu}
                  className="block py-3 px-4 rounded-lg text-gray-900 hover:bg-[#008994]/10 hover:text-[#008994] font-medium transition-colors"
                >
                  Tools
                </Link>
              </li>

            <button
              onClick={openFeedbackModal}
              className="px-5 ml-2 mt-2 cursor-pointer py-2 bg-[#008994] text-white rounded-full text-[14px] font-medium hover:bg-[#006d76] transition-colors duration-300"
            >
              Give Feedback
            </button>
            </ul>


          </nav>
        </div>
      </aside>

      {/* Feedback Modal */}
      {isFeedbackOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            onClick={closeFeedbackModal}
          >
            {/* Modal Content */}
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#008994] flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-black">Give Feedback</h2>
                </div>
                <button
                  onClick={closeFeedbackModal}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {submitSuccess ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-black mb-2">
                      Thank You!
                    </h3>
                    <p className="text-gray-600">
                      Your feedback has been submitted successfully.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitFeedback} className="space-y-4">
                    {/* Email Input */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Your Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="your@email.com"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008994] focus:border-transparent transition-all text-black"
                        />
                      </div>
                    </div>

                    {/* Feedback Textarea */}
                    <div>
                      <label
                        htmlFor="feedback"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Your Feedback
                      </label>
                      <textarea
                        id="feedback"
                        name="feedback"
                        value={formData.feedback}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        placeholder="Tell us what you think about ImageVerse..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008994] focus:border-transparent transition-all resize-none text-black"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#008994] to-[#006d76] text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Submit Feedback
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Request Feature Modal */}
      <RequestFeature
        isOpen={isRequestFeatureOpen}
        onClose={() => setIsRequestFeatureOpen(false)}
      />
    </>
  );
};

export default Header;
