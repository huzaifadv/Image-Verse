import { useNavigate } from 'react-router-dom';
import {
  Target, Users, Zap, Shield, Heart,
  Sparkles, CheckCircle2, Award
} from 'lucide-react';

/**
 * About Page Component
 * Information about ImageVerse platform and its mission
 */
const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Lightning Fast',
      description: 'All image processing happens instantly in your browser. No waiting, no delays.'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: '100% Secure',
      description: 'Your images never leave your device. Complete privacy and security guaranteed.'
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Completely Free',
      description: 'All tools are free forever. No hidden fees, no subscriptions, no sign-ups required.'
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'High Quality',
      description: 'Professional-grade image processing with 95% quality output for best results.'
    }
  ];

  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Our Mission',
      description: 'To make professional image editing tools accessible to everyone, everywhere, for free.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Our Community',
      description: 'Join thousands of users who trust ImageVerse for their daily image editing needs.'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Our Commitment',
      description: 'We are committed to providing the best user experience with constant updates and improvements.'
    }
  ];

  const stats = [
    { number: '7+', label: 'Image Tools' },
    { number: '100%', label: 'Free Forever' },
    { number: '0', label: 'Sign-up Required' },
    { number: '95%', label: 'Quality Output' }
  ];

  return (
    <div className="min-h-screen w-full relative pb-20">
      {/* Background Gradient */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 30%, rgba(0, 137, 148, 0.12), transparent 40%),
            radial-gradient(ellipse 70% 50% at 80% 70%, rgba(173, 216, 230, 0.18), transparent 55%),
            radial-gradient(ellipse 90% 70% at 50% 50%, rgba(0, 137, 148, 0.06), transparent 40%),
            transparent
          `,
        }}
      />

      {/* Content */}
      <div className="relative z-10 py-8 sm:py-12 md:py-20 px-4 sm:px-6 md:px-8">
        <div className="container mx-auto max-w-7xl">

          {/* Hero Section */}
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6 bg-[#008994]/10 text-[#006d76] border border-[#008994]/20 fade-in-up">
              About ImageVerse
            </div>
            <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-black leading-tight fade-in-up delay-100">
              Your Free Image Editing
              <br />
              <span className="text-[#008994]">Powerhouse</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed fade-in-up delay-200">
              ImageVerse is a free, powerful, and easy-to-use online image editing platform.
              We believe everyone should have access to professional-grade image tools without any barriers.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-30">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all fade-in-up delay-${(index + 1) * 100}`}
              >
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#008994] mb-2">
                  {stat.number}
                </div>
                <div className="text-sm sm:text-base text-gray-700 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Features Section */}
          <div className="mb-12 sm:mb-16 md:mb-30">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 text-black fade-in-up">
              Why Choose ImageVerse?
            </h2>
            <p className="text-center text-gray-700 mb-10 max-w-2xl mx-auto fade-in-up delay-100">
              We provide everything you need for professional image editing, all in one place.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all fade-in-up delay-${(index + 2) * 100}`}
                >
                  <div className="w-12 h-12 bg-[#008994]/10 rounded-full flex items-center justify-center mb-4 text-[#008994]">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-black mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-700">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-br from-[#008994] to-[#006d76] rounded-2xl p-8 sm:p-10 md:p-12 text-center shadow-2xl mb-25 fade-in-up delay-200">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Editing?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust ImageVerse for their image editing needs.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-white text-[#008994] rounded-full text-lg font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Explore All Tools
            </button>
          </div>

          {/* Values Section */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 text-black fade-in-up">
              What We Stand For
            </h2>
            <p className="text-center text-gray-700 mb-10 max-w-2xl mx-auto fade-in-up delay-100">
              Our core values guide everything we do at ImageVerse.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl border border-white/40 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all text-center fade-in-up delay-${(index + 2) * 100}`}
                >
                  <div className="w-16 h-16 bg-[#008994] rounded-full flex items-center justify-center mb-4 mx-auto text-white">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-black mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-700">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        

        </div>
      </div>
    </div>
  );
};

export default About;
