import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import {
  UploadCloud, Download, X, Crop,
  ArrowLeft, Loader2,
  CheckCircle2, AlertCircle, RotateCw, ZoomIn, Lock, Unlock
} from 'lucide-react';

/**
 * Image Cropper Tool Component
 * Crop images with zoom, rotation, and aspect ratio controls
 */
const ImageCropper = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [image, setImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  // Cropper states
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(undefined);
  const [lockAspectRatio, setLockAspectRatio] = useState(false);

  const aspectRatios = [
    { label: 'Free', value: undefined },
    { label: '1:1', value: 1 },
    { label: '4:3', value: 4 / 3 },
    { label: '16:9', value: 16 / 9 },
    { label: '3:2', value: 3 / 2 },
  ];

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
        setCroppedImage(null);
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

  // Callback when crop area changes
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Create cropped image
  const createCroppedImage = async (imageSrc, pixelCrop, rotation = 0) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const maxSize = Math.max(image.width, image.height);
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

    canvas.width = safeArea;
    canvas.height = safeArea;

    ctx.translate(safeArea / 2, safeArea / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-safeArea / 2, -safeArea / 2);

    ctx.drawImage(
      image,
      safeArea / 2 - image.width * 0.5,
      safeArea / 2 - image.height * 0.5
    );

    const data = ctx.getImageData(0, 0, safeArea, safeArea);

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.putImageData(
      data,
      Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
      Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
    );

    return canvas;
  };

  // Helper to create image element
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.src = url;
    });

  // Apply crop
  const applyCrop = async () => {
    if (!croppedAreaPixels || !image) return;

    setIsProcessing(true);
    setError(null);

    try {
      const canvas = await createCroppedImage(image.url, croppedAreaPixels, rotation);

      canvas.toBlob((blob) => {
        if (blob) {
          const croppedUrl = URL.createObjectURL(blob);
          setCroppedImage({
            url: croppedUrl,
            blob: blob,
            size: blob.size,
          });
        }
        setIsProcessing(false);
      }, 'image/png', 0.95);
    } catch (error) {
      console.error('Error cropping image:', error);
      setError('Failed to crop image. Please try again.');
      setIsProcessing(false);
    }
  };

  // Download cropped image
  const downloadCroppedImage = () => {
    if (!croppedImage) return;

    const link = document.createElement('a');
    link.href = croppedImage.url;
    const baseName = image.name.replace(/\.[^/.]+$/, '');
    link.download = `${baseName}_cropped.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset all
  const resetAll = () => {
    setImage(null);
    setCroppedImage(null);
    setZoom(1);
    setRotation(0);
    setCrop({ x: 0, y: 0 });
    setAspectRatio(undefined);
    setLockAspectRatio(false);
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
                  <Crop className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black">
                    Image Cropper
                  </h1>
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-700 max-w-2xl">
                Crop your images with precision. Adjust zoom, rotation, and aspect ratio for perfect results.
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
                Upload Your Image to Crop
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
                    onClick={resetAll}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-all text-sm"
                  >
                    <X className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>

              {/* Aspect Ratio Selector */}
              <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-4 sm:p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-black">
                    Aspect Ratio
                  </h3>
                  <button
                    onClick={() => {
                      setLockAspectRatio(!lockAspectRatio);
                      if (!lockAspectRatio) {
                        setAspectRatio(1);
                      } else {
                        setAspectRatio(undefined);
                      }
                    }}
                    className={`p-2 rounded-lg transition-all ${
                      lockAspectRatio
                        ? 'bg-[#008994] text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {lockAspectRatio ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      <Unlock className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
                  {aspectRatios.map((ratio) => (
                    <button
                      key={ratio.label}
                      onClick={() => setAspectRatio(ratio.value)}
                      disabled={isProcessing}
                      className={`px-3 py-2 rounded-lg font-semibold transition-all text-xs sm:text-sm ${
                        aspectRatio === ratio.value
                          ? 'bg-gradient-to-r from-[#008994] to-[#006d76] text-white shadow-lg'
                          : 'bg-white border border-[#008994]/30 text-[#008994] hover:bg-[#008994]/10'
                      }`}
                    >
                      {ratio.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cropper Area */}
              <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-4 sm:p-6 shadow-lg">
                <h3 className="text-base sm:text-lg font-semibold text-black mb-4">
                  Crop Area
                </h3>
                <div className="relative w-full h-[400px] sm:h-[500px] bg-gray-900 rounded-lg overflow-hidden">
                  <Cropper
                    image={image.url}
                    crop={crop}
                    zoom={zoom}
                    rotation={rotation}
                    aspect={aspectRatio}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onRotationChange={setRotation}
                    onCropComplete={onCropComplete}
                  />
                </div>

                {/* Cropper Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {/* Zoom Control */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <ZoomIn className="w-4 h-4 text-[#008994]" />
                      <label className="text-sm font-medium text-black">Zoom</label>
                    </div>
                    <input
                      type="range"
                      value={zoom}
                      min={1}
                      max={3}
                      step={0.1}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <p className="text-xs text-gray-600 text-center">{zoom.toFixed(1)}x</p>
                  </div>

                  {/* Rotation Control */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <RotateCw className="w-4 h-4 text-[#008994]" />
                      <label className="text-sm font-medium text-black">Rotation</label>
                    </div>
                    <input
                      type="range"
                      value={rotation}
                      min={0}
                      max={360}
                      step={1}
                      onChange={(e) => setRotation(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <p className="text-xs text-gray-600 text-center">{rotation}°</p>
                  </div>

                  {/* Reset Button */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-black block">Reset</label>
                    <button
                      onClick={() => {
                        setZoom(1);
                        setRotation(0);
                        setCrop({ x: 0, y: 0 });
                      }}
                      className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-all"
                    >
                      Reset Controls
                    </button>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                  <p className="text-xs text-blue-800">
                    <span className="font-semibold">Tip:</span> Drag to move the crop area, use mouse wheel or pinch to zoom, and adjust rotation with the slider.
                  </p>
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

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={applyCrop}
                  disabled={isProcessing || !croppedAreaPixels}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 sm:py-4 bg-gradient-to-r from-[#008994] to-[#006d76] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Cropping...
                    </>
                  ) : (
                    <>
                      <Crop className="w-5 h-5" />
                      Apply Crop
                    </>
                  )}
                </button>

                {croppedImage && (
                  <button
                    onClick={downloadCroppedImage}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 sm:py-4 bg-white/70 backdrop-blur-xl border border-[#008994]/30 text-[#008994] rounded-xl font-semibold hover:bg-white/90 transition-all text-sm sm:text-base"
                  >
                    <Download className="w-5 h-5" />
                    Download Cropped Image
                  </button>
                )}
              </div>

              {/* Cropped Preview */}
              {croppedImage && (
                <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-4 sm:p-6 shadow-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <h3 className="text-base sm:text-lg font-semibold text-black">
                      Cropped Result
                    </h3>
                  </div>
                  <div className="bg-gray-100 rounded-lg border-2 border-green-500/30 p-4 flex items-center justify-center">
                    <img
                      src={croppedImage.url}
                      alt="Cropped preview"
                      className="max-w-full max-h-[400px] object-contain rounded-lg"
                    />
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-sm text-gray-600">
                      Size: {formatFileSize(croppedImage.size)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Features Info */}
          {!image && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-12">
              <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl p-4 sm:p-6 shadow-md text-center">
                <div className="w-12 h-12 bg-[#008994]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Crop className="w-6 h-6 text-[#008994]" />
                </div>
                <h4 className="font-semibold text-black mb-2 text-sm sm:text-base">Precision Crop</h4>
                <p className="text-xs sm:text-sm text-gray-700">Drag and resize crop area</p>
              </div>

              <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl p-4 sm:p-6 shadow-md text-center">
                <div className="w-12 h-12 bg-[#008994]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ZoomIn className="w-6 h-6 text-[#008994]" />
                </div>
                <h4 className="font-semibold text-black mb-2 text-sm sm:text-base">Zoom Control</h4>
                <p className="text-xs sm:text-sm text-gray-700">Zoom up to 3x for details</p>
              </div>

              <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl p-4 sm:p-6 shadow-md text-center">
                <div className="w-12 h-12 bg-[#008994]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <RotateCw className="w-6 h-6 text-[#008994]" />
                </div>
                <h4 className="font-semibold text-black mb-2 text-sm sm:text-base">Rotate Image</h4>
                <p className="text-xs sm:text-sm text-gray-700">360° rotation support</p>
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

export default ImageCropper;
