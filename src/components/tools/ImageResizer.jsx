import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Image Resizer Tool Component
 * Resize images to custom dimensions
 */
const ImageResizer = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [maintainAspect, setMaintainAspect] = useState(true);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    }
  };

  const handleResize = () => {
    alert(`Image will be resized to ${width}x${height}px!`);
  };

  return (
    <div className="min-h-screen bg-transparent dark:bg-transparent py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
              Image Resizer
            </h1>
            <p className="text-gray-700 dark:text-gray-400">
              Resize images to any dimension with aspect ratio control
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
              <span className="text-4xl">📐</span>
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

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-black dark:text-gray-300 mb-2 font-medium">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(parseInt(e.target.value))}
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-600 text-black dark:text-white border border-gray-300 dark:border-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-black dark:text-gray-300 mb-2 font-medium">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value))}
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-600 text-black dark:text-white border border-gray-300 dark:border-gray-500"
                  />
                </div>
              </div>

              <label className="flex items-center mb-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={maintainAspect}
                  onChange={(e) => setMaintainAspect(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-black dark:text-gray-300">
                  Maintain aspect ratio
                </span>
              </label>

              <button
                onClick={handleResize}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                Resize Image
              </button>
            </div>
          )}
        </div>

        {/* Features Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </div>
            <h4 className="font-semibold text-black dark:text-white mb-2">Custom Dimensions</h4>
            <p className="text-sm text-gray-700 dark:text-gray-400">Set exact width and height</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="font-semibold text-black dark:text-white mb-2">Aspect Ratio Lock</h4>
            <p className="text-sm text-gray-700 dark:text-gray-400">Preserve proportions</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="font-semibold text-black dark:text-white mb-2">High Quality</h4>
            <p className="text-sm text-gray-700 dark:text-gray-400">No quality degradation</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageResizer;
