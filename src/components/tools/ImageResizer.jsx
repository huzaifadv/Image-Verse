import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud, Download, X, Maximize2,
  ArrowLeft, Loader2, Image as ImageIcon,
  CheckCircle2, AlertCircle, Lock, Unlock
} from 'lucide-react';

/**
 * Image Resizer Tool Component
 * Resize images to custom dimensions with aspect ratio control
 */
const ImageResizer = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [originalImage, setOriginalImage] = useState(null);
  const [resizedImage, setResizedImage] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [imageInfo, setImageInfo] = useState(null);

  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(1);

  // Crop/resize box state
  const [cropBox, setCropBox] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragHandle, setDragHandle] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialBox, setInitialBox] = useState({ width: 0, height: 0 });

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      loadImage(file);
    }
  };

  // Load and preview image
  const loadImage = (file) => {
    setResizedImage(null);

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

        // Set default dimensions to original
        setWidth(img.width.toString());
        setHeight(img.height.toString());
        setAspectRatio(img.width / img.height);

        // Set initial crop box (smaller preview - 80% of original)
        const previewWidth = Math.min(400, img.width * 0.8);
        const previewHeight = maintainAspectRatio ? previewWidth / (img.width / img.height) : Math.min(400, img.height * 0.8);
        setCropBox({ width: previewWidth, height: previewHeight });
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

  // Handle crop box resize - mouse down
  const handleMouseDown = (e, handle) => {
    e.preventDefault();
    setIsDragging(true);
    setDragHandle(handle);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialBox({ width: cropBox.width, height: cropBox.height });
  };

  // Handle crop box resize - mouse move
  const handleMouseMove = (e) => {
    if (!isDragging || !dragHandle) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    let newWidth = initialBox.width;
    let newHeight = initialBox.height;

    // Calculate new dimensions based on drag handle
    if (dragHandle.includes('right')) {
      newWidth = Math.max(50, initialBox.width + deltaX);
    }
    if (dragHandle.includes('left')) {
      newWidth = Math.max(50, initialBox.width - deltaX);
    }
    if (dragHandle.includes('bottom')) {
      newHeight = Math.max(50, initialBox.height + deltaY);
    }
    if (dragHandle.includes('top')) {
      newHeight = Math.max(50, initialBox.height - deltaY);
    }

    // Maintain aspect ratio if locked
    if (maintainAspectRatio && aspectRatio) {
      if (dragHandle.includes('right') || dragHandle.includes('left')) {
        newHeight = newWidth / aspectRatio;
      } else {
        newWidth = newHeight * aspectRatio;
      }
    }

    // Limit to max preview size
    if (originalImage) {
      newWidth = Math.min(newWidth, 600); // Max preview width
      newHeight = Math.min(newHeight, 600); // Max preview height
    }

    setCropBox({ width: newWidth, height: newHeight });

    // Update dimensions based on crop box - calculate actual output dimensions
    if (originalImage) {
      // Scale to actual image dimensions (maintain ratio between preview and actual)
      const previewRatio = Math.min(400, originalImage.width * 0.8) / originalImage.width;
      const actualWidth = Math.round(newWidth / previewRatio);
      const actualHeight = Math.round(newHeight / previewRatio);
      setWidth(actualWidth.toString());
      setHeight(actualHeight.toString());
    }
  };

  // Handle mouse up - auto resize when drag ends
  const handleMouseUp = () => {
    setIsDragging(false);
    setDragHandle(null);

    // Auto-resize after dragging
    if (originalImage && width && height) {
      resizeImageAuto();
    }
  };

  // Add event listeners for mouse move/up
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  // Auto-resize image (called after drag ends)
  const resizeImageAuto = () => {
    if (!originalImage || !width || !height) return;

    const targetWidth = parseInt(width);
    const targetHeight = parseInt(height);

    if (targetWidth <= 0 || targetHeight <= 0 || targetWidth > 10000 || targetHeight > 10000) {
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Use high quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);

            setResizedImage({
              url: url,
              blob: blob,
              name: `resized_${targetWidth}x${targetHeight}_${originalImage.name}`,
              size: blob.size,
              width: targetWidth,
              height: targetHeight
            });
          }
        }, originalImage.file.type, 0.95);
      };

      img.src = originalImage.url;
    } catch (err) {
      console.error('Resize error:', err);
    }
  };

  // Download resized image
  const downloadImage = () => {
    if (!resizedImage) return;

    const link = document.createElement('a');
    link.href = resizedImage.url;
    link.download = resizedImage.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset everything
  const reset = () => {
    setOriginalImage(null);
    setResizedImage(null);
    setImageInfo(null);
    setWidth('');
    setHeight('');
    setMaintainAspectRatio(true);
    setCropBox({ width: 0, height: 0 });
    setIsDragging(false);
    setDragHandle(null);
    setInitialBox({ width: 0, height: 0 });
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
                  <Maximize2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black">
                    Image Resizer
                  </h1>
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-700 max-w-2xl">
                Resize images to custom dimensions with aspect ratio control. Perfect for social media, websites, and more.
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
              {/* Interactive Resize Area - Single Image */}
              <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-4 sm:p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-black flex items-center gap-2">
                    <Maximize2 className="w-5 h-5 text-[#008994]" />
                    Drag Corners to Resize
                  </h3>
                  <button
                    onClick={() => setMaintainAspectRatio(!maintainAspectRatio)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      maintainAspectRatio
                        ? 'bg-[#008994] text-white'
                        : 'bg-white border border-[#008994]/30 text-[#008994]'
                    }`}
                  >
                    {maintainAspectRatio ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    {maintainAspectRatio ? 'Locked' : 'Free'}
                  </button>
                </div>

                {/* Interactive Resize Box */}
                <div className="relative flex items-center justify-center bg-gray-100 rounded-lg p-8 min-h-[400px]">
                  <div
                    className="relative border-2 border-dashed border-[#008994] bg-white/50 shadow-lg"
                    style={{
                      width: `${cropBox.width}px`,
                      height: `${cropBox.height}px`,
                      maxWidth: '100%',
                      maxHeight: '500px',
                    }}
                  >
                    {/* Image Preview inside */}
                    {originalImage && (
                      <img
                        src={originalImage.url}
                        alt="Resize Preview"
                        className="w-full h-full object-contain pointer-events-none"
                      />
                    )}

                    {/* Corner Handles */}
                    {/* Top Left */}
                    <div
                      onMouseDown={(e) => handleMouseDown(e, 'top-left')}
                      className="absolute -top-2 -left-2 w-4 h-4 bg-[#008994] border-2 border-white rounded-full cursor-nw-resize hover:scale-125 transition-transform z-10"
                    />
                    {/* Top Right */}
                    <div
                      onMouseDown={(e) => handleMouseDown(e, 'top-right')}
                      className="absolute -top-2 -right-2 w-4 h-4 bg-[#008994] border-2 border-white rounded-full cursor-ne-resize hover:scale-125 transition-transform z-10"
                    />
                    {/* Bottom Left */}
                    <div
                      onMouseDown={(e) => handleMouseDown(e, 'bottom-left')}
                      className="absolute -bottom-2 -left-2 w-4 h-4 bg-[#008994] border-2 border-white rounded-full cursor-sw-resize hover:scale-125 transition-transform z-10"
                    />
                    {/* Bottom Right */}
                    <div
                      onMouseDown={(e) => handleMouseDown(e, 'bottom-right')}
                      className="absolute -bottom-2 -right-2 w-4 h-4 bg-[#008994] border-2 border-white rounded-full cursor-se-resize hover:scale-125 transition-transform z-10"
                    />

                    {/* Edge Handles */}
                    {/* Top */}
                    <div
                      onMouseDown={(e) => handleMouseDown(e, 'top')}
                      className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-[#008994] border border-white rounded cursor-n-resize hover:scale-110 transition-transform z-10"
                    />
                    {/* Right */}
                    <div
                      onMouseDown={(e) => handleMouseDown(e, 'right')}
                      className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-8 bg-[#008994] border border-white rounded cursor-e-resize hover:scale-110 transition-transform z-10"
                    />
                    {/* Bottom */}
                    <div
                      onMouseDown={(e) => handleMouseDown(e, 'bottom')}
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-[#008994] border border-white rounded cursor-s-resize hover:scale-110 transition-transform z-10"
                    />
                    {/* Left */}
                    <div
                      onMouseDown={(e) => handleMouseDown(e, 'left')}
                      className="absolute top-1/2 -translate-y-1/2 -left-1 w-2 h-8 bg-[#008994] border border-white rounded cursor-w-resize hover:scale-110 transition-transform z-10"
                    />
                  </div>
                </div>

                <div className="mt-4 p-3 bg-[#008994]/10 rounded-lg">
                  <p className="text-sm text-gray-700 text-center">
                    <span className="font-semibold">Output Size:</span> {width || originalImage?.width} × {height || originalImage?.height} pixels
                    {resizedImage && (
                      <span className="ml-2 text-green-600 font-semibold">✓ Ready</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={downloadImage}
                  disabled={!resizedImage}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 sm:py-4 bg-gradient-to-r from-[#008994] to-[#006d76] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  <Download className="w-5 h-5" />
                  Download Resized Image
                </button>

                <button
                  onClick={reset}
                  className="sm:w-auto flex items-center justify-center gap-2 px-6 py-3 sm:py-4 bg-white/70 backdrop-blur-xl border border-[#008994]/30 text-[#008994] rounded-xl font-semibold hover:bg-white/90 transition-all text-sm sm:text-base"
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
                  <Maximize2 className="w-6 h-6 text-[#008994]" />
                </div>
                <h4 className="font-semibold text-black mb-2 text-sm sm:text-base">Custom Size</h4>
                <p className="text-xs sm:text-sm text-gray-700">Set exact width and height</p>
              </div>

              <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl p-4 sm:p-6 shadow-md text-center">
                <div className="w-12 h-12 bg-[#008994]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-6 h-6 text-[#008994]" />
                </div>
                <h4 className="font-semibold text-black mb-2 text-sm sm:text-base">Aspect Ratio</h4>
                <p className="text-xs sm:text-sm text-gray-700">Lock or unlock proportions</p>
              </div>

              <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl p-4 sm:p-6 shadow-md text-center">
                <div className="w-12 h-12 bg-[#008994]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ImageIcon className="w-6 h-6 text-[#008994]" />
                </div>
                <h4 className="font-semibold text-black mb-2 text-sm sm:text-base">Preview</h4>
                <p className="text-xs sm:text-sm text-gray-700">Compare before and after</p>
              </div>

              <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl p-4 sm:p-6 shadow-md text-center">
                <div className="w-12 h-12 bg-[#008994]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="w-6 h-6 text-[#008994]" />
                </div>
                <h4 className="font-semibold text-black mb-2 text-sm sm:text-base">High Quality</h4>
                <p className="text-xs sm:text-sm text-gray-700">Smooth, high-quality output</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageResizer;
