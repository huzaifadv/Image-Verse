import React from 'react';

/**
 * ToolPlaceholder Component
 * Displays a placeholder for the selected tool with close button
 * Props:
 * - tool: object containing tool details
 * - onClose: function to close the tool view
 */
const ToolPlaceholder = ({ tool, onClose }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="mb-6 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Tools
        </button>

        {/* Tool Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          {/* Tool Icon and Title */}
          <div className="text-center mb-8">
            <div
              className={`w-24 h-24 ${tool.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}
            >
              <span className="text-5xl">{tool.icon}</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              {tool.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {tool.description}
            </p>
          </div>

          {/* Placeholder Content */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center">
            <svg
              className="w-20 h-20 text-gray-400 dark:text-gray-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Tool Coming Soon!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              This tool is currently under development. The functionality will be added in future updates.
            </p>
            <div className="mt-6">
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300">
                Upload Image (Placeholder)
              </button>
            </div>
          </div>

          {/* Tool Features */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Fast Processing</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Process images instantly</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">High Quality</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Maintain image quality</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">No Upload</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Process locally in browser</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Free Forever</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">No hidden costs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolPlaceholder;
