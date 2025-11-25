import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  PackageMinus, Scissors, TrendingUp, RefreshCw, Crop, RotateCcw,
  ArrowUpRight, UploadCloud, Settings, Download, Sparkles, ChevronDown
} from "lucide-react";



const Home = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const tools = [
    {
      id: 'compressor',
      name: 'Image Compressor',
      description: 'Reduce image file size without losing quality. Perfect for web optimization.',
      icon: (
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#008994] flex items-center justify-center">
          <PackageMinus className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>
      ),
      path: '/image-compress',
       category: 'Optimization'
    },
    {
      id: 'background-remover',
      name: 'Background Remover',
      description: 'Remove backgrounds from images instantly with AI-powered precision.',
      icon: (
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#008994] flex items-center justify-center">
          <Scissors className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>
      ),
      path: '/background-remover',
       category: 'Editing'
    },
    {
      id: 'upscaler',
      name: 'Image Upscaler',
      description: 'Enhance and upscale images up to 4x without quality loss using AI.',
      icon: (
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#008994] flex items-center justify-center">
          <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>
      ),
      path: '/image-upscale',
      category: 'Enhancement'
    },
    {
      id: 'converter',
      name: 'Image Converter',
      description: 'Convert images between formats: JPG, PNG, WEBP, and more.',
      icon: (
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#008994] flex items-center justify-center">
          <RefreshCw className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>
      ),
      path: '/image-converter',
      category: 'Conversion'
    },

    {
      id: 'flip',
      name: 'Flip Image',
      description: 'Flip images horizontally or vertically instantly in one click try it now.',
      icon: (
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#008994] flex items-center justify-center">
          <RotateCcw className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>
      ),
      path: '/image-flip',
      category: 'Editing'
    },
    {
      id: 'cropper',
      name: 'Image Cropper',
      description: 'Crop images with precision. Adjust zoom, rotation, and aspect ratio perfectly.',
      icon: (
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#008994] flex items-center justify-center">
          <Crop className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>
      ),
      path: '/image-cropper',
      category: 'Transform'
    },
  ];



  const handleToolSelect = (tool) => {
    navigate(tool.path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full relative">
      {/* Light Theme Gradient Background */}
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

      {/* Main Content */}
      <div className="relative z-10">

        {/* Hero Section */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-25 px-4 sm:px-6 md:px-8 text-center">
          <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-5 bg-[#008994]/10 text-[#006d76] border border-[#008994]/20 fade-in-up">
            100% Free • No Sign-up Required • Privacy First
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[80px] font-bold mb-4 sm:mb-5 md:mb-6 text-black leading-tight px-2 fade-in-up delay-100">
            Discover <span className="font-bold" style={{ color: '#008994' }}>ImageVerse</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg lg:text-[17px] mb-6 sm:mb-7 md:mb-8 max-w-xl md:max-w-2xl mx-auto text-gray-700 px-4 leading-relaxed fade-in-up delay-200">
            Here you can use image tools including Image Compression, Image Upscaling, Background Removal, Format Conversion, and Image Resizing.
          </p>

          <button
            onClick={() => navigate('/tools')}
            className="px-8 sm:px-10 md:px-12 cursor-pointer py-2.5 sm:py-3 bg-[#008994] text-white rounded-full text-sm sm:text-base md:text-[17px] font-medium hover:bg-[#006d76] transition-colors duration-300 shadow-lg hover:shadow-xl fade-in-up delay-300"
          >
            Explore Tools
          </button>


        </section>

        {/* Tool Section */}
        <section id="tools" className="px-4 sm:px-6 md:px-8 pb-20 sm:pb-28 md:pb-40">
          <div className="container mx-auto">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
              {tools.map((tool, index) => (
                <div
                  key={tool.id}
                  onClick={() => handleToolSelect(tool)}
                  className={`cursor-pointer p-5 sm:p-6 md:p-7 rounded-xl border border-white/10 bg-white/50 backdrop-blur-xl shadow-lg hover:shadow-xl hover:bg-white/60 transition-all duration-300 fade-in-up delay-${(index % 3 + 1) * 100}`}
                >

                  {/* Category Badge */}
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 bg-[#008994]/10 text-[#006d76] border border-[#008994]/20">
                    {tool.category}
                  </div>

                  {/* Tool Icon */}
                   {/* Tool Icon */}
                  <div className="mb-4 flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#008994] to-[#006d76] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                      {tool.icon}
                    </div>
                  </div>

                  {/* Tool Name */}
                  <h3 className="text-lg text-center sm:text-xl font-bold mb-2 text-black tracking-wide">
                    {tool.name}
                  </h3>

                  {/* Tool Description */}
                  <p className="text-gray-700 text-center text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 px-2">
                    {tool.description}
                  </p>

                  {/* Try Now Link */}
                  <div className="mt-3 sm:mt-4 flex justify-center">
                    <a
                      href="#"
                      className="flex items-center underline gap-1 text-[#008994] text-sm sm:text-base font-bold transition"
                    >
                      Get Started
                      <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 font-bold text-[#008994]" />
                    </a>
                  </div>

                </div>
              ))}
            </div>

          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 sm:px-6 md:px-8 pb-16 sm:pb-24 md:pb-30">
          <div className="container mx-auto max-w-5xl">
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#008994] to-[#006d76] p-6 sm:p-8 md:p-10 lg:p-12 text-center shadow-2xl fade-in-up delay-200">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mb-4 sm:mb-5 md:mb-6 bg-white/20 rounded-full backdrop-blur-sm">
                  <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-white leading-tight px-2">
                  Ready to Transform Your Images?
                </h2>

                <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-7 md:mb-8 text-white/90 max-w-xs sm:max-w-md md:max-w-2xl mx-auto px-2 leading-relaxed">
                  Join thousands of users who trust ImageVerse for their image editing needs.
                  100% free, no signup required.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-2">
                  <button
                    onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full sm:w-auto px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 bg-white text-[#008994] rounded-full text-sm sm:text-base md:text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Start Editing Now
                  </button>
                  <button
                    onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full sm:w-auto px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 bg-transparent border-2 border-white text-white rounded-full text-sm sm:text-base md:text-lg font-semibold hover:bg-white/10 transition-all duration-300"
                  >
                    Learn How It Works
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="px-4 sm:px-6 md:px-8 pb-16 sm:pb-24 md:pb-30">
          <div className="container mx-auto text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 sm:mb-4 text-black fade-in-up">
              How It Works?
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-xl md:max-w-2xl mx-auto px-4 fade-in-up delay-100">
              Simple steps to edit your images instantly using ImageVerse.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
            {/* Step 1 */}
            <div className="cursor-pointer p-5 sm:p-6 md:p-7 rounded-xl border border-white/10 bg-white/60 backdrop-blur-xl shadow-lg hover:shadow-xl hover:bg-white/70 transition-all duration-300 text-center relative fade-in-up delay-200">
              <div className="my-3 sm:my-4 md:my-5 flex justify-center">
                <UploadCloud className="w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 text-white bg-[#008994] p-2.5 sm:p-3 rounded-full" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-black tracking-wide">
                Upload Your Image
              </h3>
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 px-2">
                Choose the image you want to edit directly from your device.
              </p>
            </div>

            {/* Step 2 */}
            <div className="cursor-pointer p-5 sm:p-6 md:p-7 rounded-xl border border-white/10 bg-white/60 backdrop-blur-xl shadow-lg hover:shadow-xl hover:bg-white/70 transition-all duration-300 text-center relative fade-in-up delay-300">
              <div className="my-3 sm:my-4 md:my-5 flex justify-center">
                <Settings className="w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 text-white bg-[#008994] p-2.5 sm:p-3 rounded-full" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-black tracking-wide">
                Select a Tool
              </h3>
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 px-2">
                Pick from our suite of tools like compression, upscaling, background removal, and more.
              </p>
            </div>

            {/* Step 3 */}
            <div className="cursor-pointer p-5 sm:p-6 md:p-7 rounded-xl border border-white/10 bg-white/60 backdrop-blur-xl shadow-lg hover:shadow-xl hover:bg-white/70 transition-all duration-300 text-center relative fade-in-up delay-400">
              <div className="my-3 sm:my-4 md:my-5 flex justify-center">
                <Download className="w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 text-white bg-[#008994] p-2.5 sm:p-3 rounded-full" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-black tracking-wide">
                Download Instantly
              </h3>
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 px-2">
                Save your edited image instantly in your preferred format.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-4 sm:px-6 md:px-8 pb-16 sm:pb-24 md:pb-30">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 sm:mb-4 text-black fade-in-up">
                Frequently Asked Questions
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-xl md:max-w-2xl mx-auto px-4 fade-in-up delay-100">
                Some FAQ everything you need to know about ImageVerse tools.
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {/* FAQ Item 1 */}
              <div className="rounded-xl border border-white/10 bg-white/70 backdrop-blur-xl shadow-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
                  className="w-full cursor-pointer px-4 sm:px-5 md:px-6 py-4 sm:py-5 flex justify-between items-center text-left hover:bg-white/70 transition-all duration-300"
                >
                  <span className="text-sm sm:text-base md:text-lg font-semibold text-black pr-2">Is ImageVerse really free to use?</span>
                  <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 text-[#008994] flex-shrink-0 transition-transform duration-300 ${openFaq === 1 ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === 1 && (
                  <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">
                    Yes, ImageVerse is 100% free to use. All our tools are available without any subscription, signup, or hidden fees. We believe in making image editing accessible to everyone.
                  </div>
                )}
              </div>

              {/* FAQ Item 2 */}
              <div className="rounded-xl border border-white/10 bg-white/60 backdrop-blur-xl shadow-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
                  className="w-full px-4 sm:px-5 md:px-6 py-4 sm:py-5 cursor-pointer flex justify-between items-center text-left hover:bg-white/70 transition-all duration-300"
                >
                  <span className="text-sm sm:text-base md:text-lg font-semibold text-black pr-2">Do I need to create an account?</span>
                  <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 text-[#008994] flex-shrink-0 transition-transform duration-300 ${openFaq === 2 ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === 2 && (
                  <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">
                    No account is required. Simply visit ImageVerse, select your tool, upload your image, and start editing. Your privacy is our priority.
                  </div>
                )}
              </div>

              {/* FAQ Item 3 */}
              <div className="rounded-xl border border-white/10 bg-white/60 backdrop-blur-xl shadow-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}
                  className="w-full px-4 sm:px-5 md:px-6 py-4 sm:py-5 cursor-pointer flex justify-between items-center text-left hover:bg-white/70 transition-all duration-300"
                >
                  <span className="text-sm sm:text-base md:text-lg font-semibold text-black pr-2">What image formats are supported?</span>
                  <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 text-[#008994] flex-shrink-0 transition-transform duration-300 ${openFaq === 3 ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === 3 && (
                  <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">
                    We support all major image formats including JPG, PNG, WEBP, GIF, and more. Our converter tool allows you to switch between these formats effortlessly.
                  </div>
                )}
              </div>

              {/* FAQ Item 4 */}
              <div className="rounded-xl border border-white/10 bg-white/60 backdrop-blur-xl shadow-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === 4 ? null : 4)}
                  className="w-full px-4 sm:px-5 md:px-6 py-4 sm:py-5 cursor-pointer flex justify-between items-center text-left hover:bg-white/70 transition-all duration-300"
                >
                  <span className="text-sm sm:text-base md:text-lg font-semibold text-black pr-2">Is my data safe and private?</span>
                  <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 text-[#008994] flex-shrink-0 transition-transform duration-300 ${openFaq === 4 ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === 4 && (
                  <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">
                    Absolutely. All image processing happens in your browser or on secure servers. We don't store your images permanently. Your files are automatically deleted after processing.
                  </div>
                )}
              </div>

              {/* FAQ Item 5 */}
              <div className="rounded-xl border border-white/10 bg-white/60 backdrop-blur-xl shadow-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === 5 ? null : 5)}
                  className="w-full cursor-pointer px-4 sm:px-5 md:px-6 py-4 sm:py-5 flex justify-between items-center text-left hover:bg-white/70 transition-all duration-300"
                >
                  <span className="text-sm sm:text-base md:text-lg font-semibold text-black pr-2">What is the maximum file size I can upload?</span>
                  <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 text-[#008994] flex-shrink-0 transition-transform duration-300 ${openFaq === 5 ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === 5 && (
                  <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">
                    You can upload images up to 10MB in size. For best performance, we recommend keeping files under 5MB when possible.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Footer */}


    </div>
  );
};

export default Home;
