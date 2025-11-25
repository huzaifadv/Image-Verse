import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud, Download, X, RotateCcw,
  ArrowLeft, Loader2, FlipHorizontal, FlipVertical,
  CheckCircle2, AlertCircle, RefreshCw
} from 'lucide-react';

/**
 * Image Flip Tool Component
 * Flip images horizontally or vertically
 */
const ImageFlip = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [image, setImage] = useState(null);
  const [flippedImage, setFlippedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [flipState, setFlipState] = useState({
    horizontal: false,
    vertical: false,
  });

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      addImage(file);
    }
  };

  // Add image
  const addImage = (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImage({
          file: file,
          url: e.target.result,
          name: file.name,
          width: img.width,
          height: img.height,
        });
        setFlippedImage(null);
        setFlipState({ horizontal: false, vertical: false });
        setError(null);
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
      addImage(e.dataTransfer.files[0]);
    }
  };

  // Helper to create image element
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.src = url;
    });

  // Flip image
  const flipImage = async (horizontal, vertical) => {
    if (!image) return;

    setIsProcessing(true);
    setError(null);

    try {
      const img = await createImage(image.url);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.save();

      // Apply transformations
      if (horizontal && vertical) {
        // Flip both
        ctx.translate(img.width, img.height);
        ctx.scale(-1, -1);
      } else if (horizontal) {
        // Flip horizontal
        ctx.translate(img.width, 0);
        ctx.scale(-1, 1);
      } else if (vertical) {
        // Flip vertical
        ctx.translate(0, img.height);
        ctx.scale(1, -1);
      }

      ctx.drawImage(img, 0, 0);
      ctx.restore();

      canvas.toBlob((blob) => {
        if (blob) {
          const flippedUrl = URL.createObjectURL(blob);
          setFlippedImage({
            url: flippedUrl,
            blob: blob,
            size: blob.size,
          });
        }
        setIsProcessing(false);
      }, 'image/png', 0.95);
    } catch (error) {
      console.error('Error flipping image:', error);
      setError('Failed to flip image. Please try again.');
      setIsProcessing(false);
    }
  };

  // Handle flip horizontal
  const handleFlipHorizontal = () => {
    const newHorizontal = !flipState.horizontal;
    setFlipState({ ...flipState, horizontal: newHorizontal });
    flipImage(newHorizontal, flipState.vertical);
  };

  // Handle flip vertical
  const handleFlipVertical = () => {
    const newVertical = !flipState.vertical;
    setFlipState({ ...flipState, vertical: newVertical });
    flipImage(flipState.horizontal, newVertical);
  };

  // Reset flip
  const resetFlip = () => {
    setFlipState({ horizontal: false, vertical: false });
    setFlippedImage(null);
  };

  // Download flipped image
  const downloadFlippedImage = () => {
    if (!flippedImage) return;

    const link = document.createElement('a');
    link.href = flippedImage.url;
    const baseName = image.name.replace(/\.[^/.]+$/, '');
    const flipText = [];
    if (flipState.horizontal) flipText.push('h');
    if (flipState.vertical) flipText.push('v');
    link.download = `${baseName}_flipped_${flipText.join('')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Clear all
  const clearAll = () => {
    setImage(null);
    setFlippedImage(null);
    setFlipState({ horizontal: false, vertical: false });
    setError(null);
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
                  <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black">
                    Flip Image
                  </h1>
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-700 max-w-2xl">
                Flip your images horizontally or vertically with one click. Fast and easy image flipping.
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

          {/* Upload Area */}
          {!image ? (
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
                Upload Your Image to Flip
              </h3>
              <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 max-w-md mx-auto">
                Drag and drop your image here, or click to browse. All major formats supported.
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
              {/* Image Info */}
              <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-4 sm:p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-black mb-1">
                      {image.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {image.width} x {image.height} px
                    </p>
                  </div>
                  <button
                    onClick={clearAll}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-all text-sm"
                  >
                    <X className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>

              {/* Flip Controls */}
              <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-4 sm:p-6 shadow-lg">
                <h3 className="text-base sm:text-lg font-semibold text-black mb-4">
                  Flip Controls
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <button
                    onClick={handleFlipHorizontal}
                    disabled={isProcessing}
                    className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all text-sm sm:text-base ${
                      flipState.horizontal
                        ? 'bg-gradient-to-r from-[#008994] to-[#006d76] text-white shadow-lg'
                        : 'bg-white border-2 border-[#008994]/30 text-[#008994] hover:bg-[#008994]/10'
                    }`}
                  >
                    <FlipHorizontal className="w-5 h-5" />
                    Flip Horizontal
                  </button>

                  <button
                    onClick={handleFlipVertical}
                    disabled={isProcessing}
                    className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all text-sm sm:text-base ${
                      flipState.vertical
                        ? 'bg-gradient-to-r from-[#008994] to-[#006d76] text-white shadow-lg'
                        : 'bg-white border-2 border-[#008994]/30 text-[#008994] hover:bg-[#008994]/10'
                    }`}
                  >
                    <FlipVertical className="w-5 h-5" />
                    Flip Vertical
                  </button>

                  <button
                    onClick={resetFlip}
                    disabled={isProcessing || (!flipState.horizontal && !flipState.vertical)}
                    className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Reset
                  </button>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                  <p className="text-xs text-blue-800">
                    <span className="font-semibold">Tip:</span> Click on Flip Horizontal or Flip Vertical buttons to flip your image. You can apply both flips together!
                  </p>
                </div>
              </div>

              {/* Preview Section */}
              <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-4 sm:p-6 shadow-lg">
                <h3 className="text-base sm:text-lg font-semibold text-black mb-4">
                  Preview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Original Image */}
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Original</p>
                    <div className="bg-gray-100 rounded-lg border-2 border-gray-300 p-4 flex items-center justify-center min-h-[300px]">
                      <img
                        src={image.url}
                        alt="Original"
                        className="max-w-full max-h-[400px] object-contain rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Flipped Image */}
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Flipped</p>
                    <div className="bg-gray-100 rounded-lg border-2 border-[#008994]/30 p-4 flex items-center justify-center min-h-[300px]">
                      {flippedImage ? (
                        <img
                          src={flippedImage.url}
                          alt="Flipped"
                          className="max-w-full max-h-[400px] object-contain rounded-lg"
                        />
                      ) : (
                        <div className="text-center text-gray-500">
                          <RotateCcw className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Click flip buttons to see result</p>
                        </div>
                      )}
                    </div>
                  </div>
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

              {/* Download Button */}
              {flippedImage && (
                <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-4 sm:p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <h3 className="text-base sm:text-lg font-semibold text-black">
                        Ready to Download
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Size: {formatFileSize(flippedImage.size)}
                    </p>
                  </div>
                  <button
                    onClick={downloadFlippedImage}
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#008994] to-[#006d76] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        Download Flipped Image
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Features Info */}
          {!image && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-12">
              <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl p-4 sm:p-6 shadow-md text-center">
                <div className="w-12 h-12 bg-[#008994]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FlipHorizontal className="w-6 h-6 text-[#008994]" />
                </div>
                <h4 className="font-semibold text-black mb-2 text-sm sm:text-base">Horizontal Flip</h4>
                <p className="text-xs sm:text-sm text-gray-700">Mirror image left to right</p>
              </div>

              <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl p-4 sm:p-6 shadow-md text-center">
                <div className="w-12 h-12 bg-[#008994]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FlipVertical className="w-6 h-6 text-[#008994]" />
                </div>
                <h4 className="font-semibold text-black mb-2 text-sm sm:text-base">Vertical Flip</h4>
                <p className="text-xs sm:text-sm text-gray-700">Mirror image top to bottom</p>
              </div>

              <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl p-4 sm:p-6 shadow-md text-center">
                <div className="w-12 h-12 bg-[#008994]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <RefreshCw className="w-6 h-6 text-[#008994]" />
                </div>
                <h4 className="font-semibold text-black mb-2 text-sm sm:text-base">Instant Process</h4>
                <p className="text-xs sm:text-sm text-gray-700">One-click flipping</p>
              </div>

              <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl p-4 sm:p-6 shadow-md text-center">
                <div className="w-12 h-12 bg-[#008994]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="w-6 h-6 text-[#008994]" />
                </div>
                <h4 className="font-semibold text-black mb-2 text-sm sm:text-base">High Quality</h4>
                <p className="text-xs sm:text-sm text-gray-700">95% quality output</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageFlip;
