import { useNavigate } from 'react-router-dom';
import {
  PackageMinus, Scissors, TrendingUp, RefreshCw, Crop, RotateCcw,
  ArrowUpRight, Search
} from 'lucide-react';
import { useState } from 'react';
import RequestFeature from '../components/RequestFeature';

/**
 * Tools Page Component
 * Display all available image editing tools
 */
const Tools = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isRequestFeatureOpen, setIsRequestFeatureOpen] = useState(false);

  const tools = [
    {
      id: 'compressor',
      name: 'Image Compressor',
      description: 'Reduce image file size without losing quality. Perfect for web optimization and faster loading times.',
      icon: <PackageMinus className="w-10 h-10 text-white" />,
      path: '/image-compress',
      category: 'Optimization'
    },
    {
      id: 'background-remover',
      name: 'Background Remover',
      description: 'Remove backgrounds from images instantly with AI-powered precision. Create transparent PNGs easily.',
      icon: <Scissors className="w-10 h-10 text-white" />,
      path: '/background-remover',
      category: 'Editing'
    },
    {
      id: 'upscaler',
      name: 'Image Upscaler',
      description: 'Enhance and upscale images up to 4x without quality loss using advanced AI technology.',
      icon: <TrendingUp className="w-10 h-10 text-white" />,
      path: '/image-upscale',
      category: 'Enhancement'
    },
    {
      id: 'converter',
      name: 'Image Converter',
      description: 'Convert images between formats: JPG, PNG, WEBP, GIF, and BMP. Fast format conversion.',
      icon: <RefreshCw className="w-10 h-10 text-white" />,
      path: '/image-converter',
      category: 'Conversion'
    },
    {
      id: 'cropper',
      name: 'Image Cropper',
      description: 'Crop images with precision. Adjust zoom, rotation, and aspect ratio for perfect results.',
      icon: <Crop className="w-10 h-10 text-white" />,
      path: '/image-cropper',
      category: 'Editing'
    },
    {
      id: 'flip',
      name: 'Flip Image',
      description: 'Flip images horizontally or vertically instantly in one click. Simple and fast.',
      icon: <RotateCcw className="w-10 h-10 text-white" />,
      path: '/image-flip',
      category: 'Transform'
    }
  ];

  const handleToolSelect = (tool) => {
    navigate(tool.path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter tools based on search query
  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="relative z-10 py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8">
        <div className="container mx-auto max-w-7xl">

          {/* Header Section */}
          <div className="text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6 bg-[#008994]/10 text-[#006d76] border border-[#008994]/20 fade-in-up">
              All Tools
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-black leading-tight fade-in-up delay-100">
              Professional Image Tools
              <br />
              <span className="text-[#008994]">All in One Place</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8 fade-in-up delay-200">
              Explore our complete collection of free image editing tools. Everything you need for professional image processing.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto fade-in-up delay-300">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tools by name, category, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-[#008994]/20 focus:border-[#008994] focus:outline-none text-black bg-white/70 backdrop-blur-xl transition-all"
                />
              </div>
            </div>
          </div>

          {/* Tools Count */}
          {searchQuery && (
            <div className="text-center mb-6">
              <p className="text-gray-700">
                Found <span className="font-bold text-[#008994]">{filteredTools.length}</span> tool{filteredTools.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}

          {/* Tools Grid */}
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool, index) => (
                <div
                  key={tool.id}
                  onClick={() => handleToolSelect(tool)}
                  className={`cursor-pointer group bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 fade-in-up delay-${(index % 3 + 1) * 100}`}
                >
                  {/* Category Badge */}
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 bg-[#008994]/10 text-[#006d76] border border-[#008994]/20">
                    {tool.category}
                  </div>

                  {/* Tool Icon */}
                  <div className="mb-4 flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#008994] to-[#006d76] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                      {tool.icon}
                    </div>
                  </div>

                  {/* Tool Name */}
                  <h3 className="text-xl font-bold mb-3 text-black text-center">
                    {tool.name}
                  </h3>

                  {/* Tool Description */}
                  <p className="text-gray-700 text-sm leading-relaxed mb-4 text-center">
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
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">No Tools Found</h3>
              <p className="text-gray-600">
                Try adjusting your search query to find what you're looking for.
              </p>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-20 bg-gradient-to-br from-[#008994] to-[#006d76] rounded-2xl p-8 sm:p-10 text-center shadow-2xl fade-in-up delay-200">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Can't Find What You Need?
            </h2>
            <p className="text-lg text-white/90 mb-6">
              Request a new feature and we'll work on adding it!
            </p>
            <button
              onClick={() => setIsRequestFeatureOpen(true)}
              className="px-8 py-3 bg-white text-[#008994] rounded-full text-lg font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
            >
              Request Feature
            </button>
          </div>


          {/* Features Section */}
          <div className="mt-16 sm:mt-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 text-black fade-in-up">
              Why Our Tools?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-6 text-center shadow-lg">
                <div className="text-4xl font-bold text-[#008994] mb-2">100%</div>
                <p className="text-sm text-gray-700 font-medium">Free Forever</p>
              </div>

              <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-6 text-center shadow-lg">
                <div className="text-4xl font-bold text-[#008994] mb-2">0</div>
                <p className="text-sm text-gray-700 font-medium">Sign-up Required</p>
              </div>

              <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-6 text-center shadow-lg">
                <div className="text-4xl font-bold text-[#008994] mb-2">95%</div>
                <p className="text-sm text-gray-700 font-medium">Quality Output</p>
              </div>

              <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-6 text-center shadow-lg">
                <div className="text-4xl font-bold text-[#008994] mb-2">7+</div>
                <p className="text-sm text-gray-700 font-medium">Image Tools</p>
              </div>
            </div>
          </div>


        </div>
      </div>

      {/* Request Feature Modal */}
      <RequestFeature
        isOpen={isRequestFeatureOpen}
        onClose={() => setIsRequestFeatureOpen(false)}
      />
    </div>
  );
};

export default Tools;
