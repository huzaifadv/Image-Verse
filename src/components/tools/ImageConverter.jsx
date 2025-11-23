import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Image Converter Tool Component
 * Convert images between different formats
 */
const ImageConverter = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [outputFormat, setOutputFormat] = useState('png');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    }
  };

  const handleConvert = () => {
    alert(`Image will be converted to ${outputFormat.toUpperCase()}!`);
  };

  return (
    <div className="min-h-screen bg-transparent dark:bg-transparent py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
              Image Converter
            </h1>
            <p className="text-gray-700 dark:text-gray-400">
              Convert images between JPG, PNG, WEBP formats
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all font-medium"
          >
            Back to Home
          </button>
        </div>

        {/* Upload Area */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center hover:border-purple-500 dark:hover:border-purple-400 transition-all">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🔄</span>
            </div>
            <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
              Upload Your Image
            </h3>
            <p className="text-gray-700 dark:text-gray-400 mb-6">
              Drag and drop or click to browse
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg cursor-pointer hover:shadow-lg transition-all font-medium"
            >
              Choose Image
            </label>
          </div>

          {selectedFile && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-black dark:text-gray-300 mb-4">
                <span className="font-semibold">Selected:</span> {selectedFile.name}
              </p>
              <div className="mb-4">
                <label className="block text-black dark:text-gray-300 mb-2 font-medium">
                  Convert to:
                </label>
                <div className="flex gap-4">
                  {['png', 'jpg', 'webp'].map((format) => (
                    <button
                      key={format}
                      onClick={() => setOutputFormat(format)}
                      className={`px-6 py-2 rounded-lg font-medium transition-all ${
                        outputFormat === format
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-600 text-black dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                      }`}
                    >
                      {format.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleConvert}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                Convert Image
              </button>
            </div>
          )}
        </div>

        {/* Features Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h4 className="font-semibold text-black dark:text-white mb-2">Multiple Formats</h4>
            <p className="text-sm text-gray-700 dark:text-gray-400">JPG, PNG, WEBP support</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="font-semibold text-black dark:text-white mb-2">Instant Convert</h4>
            <p className="text-sm text-gray-700 dark:text-gray-400">Quick conversion process</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-semibold text-black dark:text-white mb-2">Quality Options</h4>
            <p className="text-sm text-gray-700 dark:text-gray-400">Control output quality</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageConverter;
