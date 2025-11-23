import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Image Upscaler Tool Component
 * Enhance and upscale images using AI
 */
const ImageUpscaler = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [scale, setScale] = useState(2);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    }
  };

  const handleUpscale = () => {
    alert(`Image will be upscaled by ${scale}x!`);
  };

  return (
    <div className="min-h-screen bg-transparent dark:bg-transparent py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
              Image Upscaler
            </h1>
            <p className="text-gray-700 dark:text-gray-400">
              Enhance images up to 4x without quality loss
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
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-all">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📈</span>
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
                  Upscale Factor: {scale}x
                </label>
                <input
                  type="range"
                  min="2"
                  max="4"
                  value={scale}
                  onChange={(e) => setScale(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-700 dark:text-gray-400 mt-1">
                  <span>2x</span>
                  <span>3x</span>
                  <span>4x</span>
                </div>
              </div>
              <button
                onClick={handleUpscale}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                Upscale Image
              </button>
            </div>
          )}
        </div>

        {/* Features Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </div>
            <h4 className="font-semibold text-black dark:text-white mb-2">Up to 4x Scale</h4>
            <p className="text-sm text-gray-700 dark:text-gray-400">Increase resolution dramatically</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h4 className="font-semibold text-black dark:text-white mb-2">AI Enhancement</h4>
            <p className="text-sm text-gray-700 dark:text-gray-400">Smart detail recovery</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="font-semibold text-black dark:text-white mb-2">No Quality Loss</h4>
            <p className="text-sm text-gray-700 dark:text-gray-400">Maintain image clarity</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpscaler;
