import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud, Download, X, TrendingUp,
  ArrowLeft, Loader2, Sparkles, Image as ImageIcon,
  CheckCircle2, AlertCircle, ZoomIn
} from 'lucide-react';

/**
 * Image Upscaler Tool Component
 * Enhance and upscale images using AI-powered upscaling
 */
const ImageUpscaler = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [originalImage, setOriginalImage] = useState(null);
  const [upscaledImage, setUpscaledImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [imageInfo, setImageInfo] = useState(null);

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      loadImage(file);
    }
  };

  // Load and preview image
  const loadImage = (file) => {
    setError(null);
    setUpscaledImage(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage({
          file: file,
          url: e.target.result,
          name: file.name,
          size: file.size,
          width: img.width,
          height: img.height
        });
        setImageInfo({
          name: file.name,
          size: formatFileSize(file.size),
          dimensions: `${img.width} × ${img.height}`,
          type: file.type
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        loadImage(file);
      }
    }
  };

  // Upscale image using Clipdrop API
  const upscaleImage = async () => {
    if (!originalImage) return;

    setIsProcessing(true);
    setError(null);

    const apiKey = import.meta.env.VITE_CLIPDROP_API_KEY;

    if (!apiKey || apiKey === 'your_api_key_here') {
      setError('API key not configured. Please add your Clipdrop API key to the .env file.');
      setIsProcessing(false);
      return;
    }

    try {
      // Calculate target dimensions (2x upscale)
      const targetWidth = originalImage.width * 2;
      const targetHeight = originalImage.height * 2;

      // Check if dimensions are within limits (max 4096 pixels)
      if (targetWidth > 4096 || targetHeight > 4096) {
        throw new Error('Image is too large. Maximum output dimensions are 4096x4096 pixels.');
      }

      const formData = new FormData();
      formData.append('image_file', originalImage.file);
      formData.append('target_width', targetWidth.toString());
      formData.append('target_height', targetHeight.toString());

      const response = await fetch('https://clipdrop-api.co/image-upscaling/v1/upscale', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to upscale image');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Get image dimensions from the blob
      const img = new Image();
      img.onload = () => {
        setUpscaledImage({
          url: url,
          blob: blob,
          name: `upscaled_2x_${originalImage.name}`,
          size: blob.size,
          width: img.width,
          height: img.height
        });
      };
      img.src = url;

    } catch (err) {
      console.error('Upscaling error:', err);
      setError(err.message || 'Failed to upscale image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Download upscaled image
  const downloadImage = () => {
    if (!upscaledImage) return;

    const link = document.createElement('a');
    link.href = upscaledImage.url;
    link.download = upscaledImage.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset everything
  const reset = () => {
    setOriginalImage(null);
    setUpscaledImage(null);
    setError(null);
    setImageInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

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
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 md:mb-10 gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#008994] flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black">
                    Image Upscaler
                  </h1>
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-700 max-w-2xl">
                Enhance and upscale images up to 4x with AI-powered technology. Perfect for improving low-resolution images.
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white/60 backdrop-blur-xl border border-white/20 text-black rounded-full hover:bg-white/80 transition-all font-medium shadow-lg text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
          </div>

          {/* Upload Area or Image Preview */}
          {!originalImage ? (
            <div
              className={`bg-white/60 backdrop-blur-xl border-2 border-dashed rounded-2xl p-6 sm:p-8 md:p-12 text-center mb-6 sm:mb-8 transition-all ${
                dragActive
                  ? 'border-[#008994] bg-[#008994]/30'
                  : 'border-[#008994] bg-[#008994]/40'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#008994] to-[#006d76] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-black mb-2">
                Upload Your Image
              </h3>
              <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 max-w-md mx-auto">
                Drag and drop your image here, or click to browse. Supports JPG, PNG, and WEBP formats.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-[#008994] to-[#006d76] text-white rounded-full cursor-pointer hover:shadow-lg transition-all font-medium text-sm sm:text-base"
              >
                Choose Image
              </label>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Image Comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Original Image */}
                <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl overflow-hidden shadow-lg">
                  <div className="p-4 border-b border-white/40 bg-white/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-[#008994]" />
                        <h3 className="font-semibold text-black">Original Image</h3>
                      </div>
                      <span className="text-sm text-gray-600">{imageInfo?.dimensions}</span>
                    </div>
                  </div>
                  <div className="relative aspect-square bg-gray-100">
                    <img
                      src={originalImage.url}
                      alt="Original"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="p-3 bg-white/50 border-t border-white/40">
                    <p className="text-xs text-gray-600">Size: {imageInfo?.size}</p>
                  </div>
                </div>

                {/* Upscaled Image */}
                <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl overflow-hidden shadow-lg">
                  <div className="p-4 border-b border-white/40 bg-white/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#008994]" />
                        <h3 className="font-semibold text-black">Upscaled Image (2x)</h3>
                      </div>
                      {upscaledImage && (
                        <span className="text-sm text-gray-600">
                          {upscaledImage.width} × {upscaledImage.height}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="relative aspect-square bg-gray-100">
                    {isProcessing ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
                        <Loader2 className="w-12 h-12 text-[#008994] animate-spin mb-4" />
                        <p className="text-black font-semibold">Upscaling image...</p>
                        <p className="text-sm text-gray-600 mt-2">This may take a few moments</p>
                      </div>
                    ) : upscaledImage ? (
                      <img
                        src={upscaledImage.url}
                        alt="Upscaled"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-gray-500">No upscaled image yet</p>
                      </div>
                    )}
                  </div>
                  {upscaledImage && (
                    <div className="p-3 bg-white/50 border-t border-white/40">
                      <p className="text-xs text-gray-600">Size: {formatFileSize(upscaledImage.size)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-red-900 mb-1">Error</h4>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {upscaledImage && !error && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-900 mb-1">Success!</h4>
                    <p className="text-sm text-green-700">
                      Image upscaled successfully to {upscaledImage.width} × {upscaledImage.height} pixels (2x).
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {!upscaledImage && !isProcessing && (
                  <button
                    onClick={upscaleImage}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 sm:py-4 bg-gradient-to-r from-[#008994] to-[#006d76] text-white rounded-xl font-semibold hover:shadow-lg transition-all text-sm sm:text-base"
                  >
                    <TrendingUp className="w-5 h-5" />
                    Upscale Image (2x)
                  </button>
                )}

                {upscaledImage && (
                  <button
                    onClick={downloadImage}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 sm:py-4 bg-gradient-to-r from-[#008994] to-[#006d76] text-white rounded-xl font-semibold hover:shadow-lg transition-all text-sm sm:text-base"
                  >
                    <Download className="w-5 h-5" />
                    Download Image
                  </button>
                )}

                <button
                  onClick={reset}
                  disabled={isProcessing}
                  className="sm:w-auto flex items-center justify-center gap-2 px-6 py-3 sm:py-4 bg-white/70 backdrop-blur-xl border border-[#008994]/30 text-[#008994] rounded-xl font-semibold hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  <X className="w-5 h-5" />
                  Start Over
                </button>
              </div>
            </div>
          )}

          {/* Features Info */}
          {!originalImage && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-12">
              <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl p-4 sm:p-6 shadow-md text-center">
                <div className="w-12 h-12 bg-[#008994]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-[#008994]" />
                </div>
                <h4 className="font-semibold text-black mb-2 text-sm sm:text-base">Up to 4x Scale</h4>
                <p className="text-xs sm:text-sm text-gray-700">Increase resolution dramatically</p>
              </div>

              <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl p-4 sm:p-6 shadow-md text-center">
                <div className="w-12 h-12 bg-[#008994]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-[#008994]" />
                </div>
                <h4 className="font-semibold text-black mb-2 text-sm sm:text-base">AI Enhancement</h4>
                <p className="text-xs sm:text-sm text-gray-700">Smart detail recovery and enhancement</p>
              </div>

              <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl p-4 sm:p-6 shadow-md text-center">
                <div className="w-12 h-12 bg-[#008994]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ZoomIn className="w-6 h-6 text-[#008994]" />
                </div>
                <h4 className="font-semibold text-black mb-2 text-sm sm:text-base">Preview</h4>
                <p className="text-xs sm:text-sm text-gray-700">Compare before and after results</p>
              </div>

              <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl p-4 sm:p-6 shadow-md text-center">
                <div className="w-12 h-12 bg-[#008994]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="w-6 h-6 text-[#008994]" />
                </div>
                <h4 className="font-semibold text-black mb-2 text-sm sm:text-base">High Quality</h4>
                <p className="text-xs sm:text-sm text-gray-700">Download enhanced images instantly</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpscaler;
