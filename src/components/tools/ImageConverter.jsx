import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import heic2any from 'heic2any';
import {
  UploadCloud, Download, X, RefreshCw,
  ArrowLeft, Loader2, Image as ImageIcon,
  CheckCircle2, AlertCircle, FileType, Crop, RotateCw, ZoomIn
} from 'lucide-react';

/**
 * Image Converter Tool Component
 * Convert images between different formats (JPG, PNG, WEBP, GIF, BMP, HEIC)
 */
const ImageConverter = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [images, setImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [outputFormat, setOutputFormat] = useState('png');

  // Cropper states
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  const formats = [
    { value: 'png', label: 'PNG', mime: 'image/png' },
    { value: 'jpeg', label: 'JPG', mime: 'image/jpeg' },
    { value: 'webp', label: 'WEBP', mime: 'image/webp' },
    { value: 'gif', label: 'GIF', mime: 'image/gif' },
    { value: 'bmp', label: 'BMP', mime: 'image/bmp' },
    { value: 'heic', label: 'HEIC', mime: 'image/heic' }
  ];

  // Handle file selection (multiple)
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    addImages(files);
  };

  // Add images to the list
  const addImages = async (files) => {
    const imageFiles = files.filter(file =>
      file.type.startsWith('image/') || file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')
    );

    for (const file of imageFiles) {
      try {
        let processedFile = file;

        // Convert HEIC to PNG for preview and processing
        if (file.type === 'image/heic' || file.type === 'image/heif' ||
            file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')) {
          try {
            const convertedBlob = await heic2any({
              blob: file,
              toType: 'image/png',
              quality: 0.95
            });
            processedFile = new File([convertedBlob], file.name.replace(/\.(heic|heif)$/i, '.png'), {
              type: 'image/png'
            });
          } catch (heicError) {
            console.error('Error converting HEIC:', heicError);
            setError('Failed to process HEIC file. Please try another image.');
            continue;
          }
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const fileType = file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')
              ? 'heic'
              : (file.type.split('/')[1] || 'unknown');

            const newImage = {
              id: Date.now() + Math.random(),
              file: file,
              url: e.target.result,
              name: file.name,
              size: file.size,
              format: fileType,
              width: img.width,
              height: img.height,
              isConverted: false,
              convertedBlob: null,
              convertedSize: null
            };

            setImages(prev => [...prev, newImage]);
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(processedFile);
      } catch (error) {
        console.error('Error processing file:', error);
        setError('Failed to process one or more files.');
      }
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
      const files = Array.from(e.dataTransfer.files);
      addImages(files);
    }
  };

  // Convert all images with crop
  const convertAllImages = async () => {
    if (images.length === 0) return;

    setIsProcessing(true);
    setError(null);

    const selectedFormat = formats.find(f => f.value === outputFormat);
    const mimeType = selectedFormat.mime;

    for (const image of images) {
      if (!image.isConverted) {
        await convertSingleImage(image.id, image.url, mimeType);
      }
    }

    setIsProcessing(false);
    setShowCropper(false);
  };

  // Convert single image with crop
  const convertSingleImage = async (imageId, imageUrl, mimeType) => {
    try {
      let canvas;

      // If user has cropped, use cropped image
      if (croppedAreaPixels) {
        canvas = await createCroppedImage(imageUrl, croppedAreaPixels, rotation);
      } else {
        // Otherwise use original image
        canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = await createImage(imageUrl);
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      }

      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            setImages(prev =>
              prev.map(img =>
                img.id === imageId
                  ? {
                      ...img,
                      isConverted: true,
                      convertedBlob: blob,
                      convertedSize: blob.size
                    }
                  : img
              )
            );
            resolve();
          } else {
            reject(new Error('Failed to convert image'));
          }
        }, mimeType, 0.95);
      });
    } catch (error) {
      console.error('Error converting image:', error);
      throw error;
    }
  };

  // Download single converted image
  const downloadImage = (image) => {
    if (!image.convertedBlob) return;

    const url = URL.createObjectURL(image.convertedBlob);
    const extension = outputFormat === 'jpeg' ? 'jpg' : outputFormat;
    const baseName = image.name.replace(/\.[^/.]+$/, '');

    const link = document.createElement('a');
    link.href = url;
    link.download = `${baseName}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download all converted images as ZIP
  const downloadAllAsZip = async () => {
    const convertedImages = images.filter(img => img.isConverted);
    if (convertedImages.length === 0) return;

    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    const folder = zip.folder('converted_images');

    const extension = outputFormat === 'jpeg' ? 'jpg' : outputFormat;

    convertedImages.forEach(image => {
      const baseName = image.name.replace(/\.[^/.]+$/, '');
      folder.file(`${baseName}.${extension}`, image.convertedBlob);
    });

    const zipBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipBlob);
    link.download = `converted_images_${Date.now()}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Remove image from list
  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  // Clear all images
  const clearAll = () => {
    setImages([]);
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
                  <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black">
                    Image Converter
                  </h1>
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-700 max-w-2xl">
                Convert images between different formats with cropping support - JPG, PNG, WEBP, GIF, BMP, and HEIC. Fast and easy conversion.
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
          {images.length === 0 ? (
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
                Drag and drop your image here, or click to browse. Supports all major image formats.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.heic,.heif"
                multiple
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
              {/* Format Selector */}
              <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-4 sm:p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <FileType className="w-5 h-5 text-[#008994]" />
                  <h3 className="text-base sm:text-lg font-semibold text-black">
                    Convert to:
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {formats.map((format) => (
                    <button
                      key={format.value}
                      onClick={() => setOutputFormat(format.value)}
                      disabled={isProcessing}
                      className={`px-4 py-3 rounded-lg font-semibold transition-all text-sm sm:text-base ${
                        outputFormat === format.value
                          ? 'bg-gradient-to-r from-[#008994] to-[#006d76] text-white shadow-lg'
                          : 'bg-white border border-[#008994]/30 text-[#008994] hover:bg-[#008994]/10'
                      }`}
                    >
                      {format.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Cropper */}
              <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-4 sm:p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Crop className="w-5 h-5 text-[#008994]" />
                    <h3 className="text-base sm:text-lg font-semibold text-black">
                      Crop Image
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowCropper(!showCropper)}
                    className="px-4 py-2 bg-[#008994] text-white rounded-lg text-sm font-medium hover:bg-[#006d76] transition-all"
                  >
                    {showCropper ? 'Hide Cropper' : 'Open Cropper'}
                  </button>
                </div>

                {showCropper && images.length > 0 && (
                  <div className="space-y-4">
                    {/* Cropper Area */}
                    <div className="relative w-full h-[400px] bg-gray-900 rounded-lg overflow-hidden">
                      <Cropper
                        image={images[0].url}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        aspect={undefined}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onRotationChange={setRotation}
                        onCropComplete={onCropComplete}
                      />
                    </div>

                    {/* Cropper Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                          Reset All
                        </button>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs text-blue-800">
                        <span className="font-semibold">Tip:</span> Drag to move the crop area, use mouse wheel or pinch to zoom, and adjust rotation with the slider.
                      </p>
                    </div>
                  </div>
                )}

                {!showCropper && (
                  <div className="text-center py-8 text-gray-500">
                    <Crop className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Click "Open Cropper" to start cropping your image</p>
                  </div>
                )}
              </div>

              {/* Uploaded Images Thumbnails */}
              <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-4 sm:p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-black">
                    Uploaded Images ({images.length})
                  </h3>
                  <p className="text-sm text-gray-600">
                    {images.filter(img => img.isConverted).length} converted
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className="relative bg-white rounded-lg border border-white/40 shadow-md hover:shadow-lg transition-all overflow-hidden"
                    >
                      {/* Thumbnail */}
                      <div className="aspect-square bg-gray-100 relative">
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-full h-full object-cover"
                        />
                        {image.isConverted && (
                          <div className="absolute top-1 right-1 bg-green-500 rounded-full p-1">
                            <CheckCircle2 className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <button
                          onClick={() => removeImage(image.id)}
                          className="absolute top-1 left-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Image Info */}
                      <div className="p-2">
                        <p className="text-xs font-medium text-black truncate mb-1">{image.name}</p>
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>{image.format.toUpperCase()}</span>
                          <span>{formatFileSize(image.size)}</span>
                        </div>

                        {/* Download button for converted images */}
                        {image.isConverted && (
                          <button
                            onClick={() => downloadImage(image)}
                            className="mt-2 w-full flex items-center justify-center gap-1 px-2 py-1 bg-[#008994] text-white rounded text-xs font-medium hover:bg-[#006d76] transition-all"
                          >
                            <Download className="w-3 h-3" />
                            Download
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Add More Images Box */}
                  <label
                    htmlFor="add-more-upload"
                    className="relative bg-white/50 rounded-lg border-2 border-dashed border-[#008994]/40 shadow-md hover:shadow-lg hover:bg-white/70 hover:border-[#008994] transition-all overflow-hidden cursor-pointer flex items-center justify-center"
                  >
                    <div className="flex flex-col items-center justify-center p-4">
                      <div className="w-12 h-12 bg-[#008994]/10 rounded-full flex items-center justify-center mb-2">
                        <UploadCloud className="w-6 h-6 text-[#008994]" />
                      </div>
                      <p className="text-xs font-semibold text-[#008994]">Add More</p>
                    </div>
                    <input
                      id="add-more-upload"
                      type="file"
                      accept="image/*,.heic,.heif"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
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
                  onClick={convertAllImages}
                  disabled={isProcessing || images.every(img => img.isConverted)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 sm:py-4 bg-gradient-to-r from-[#008994] to-[#006d76] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-5 h-5" />
                      Crop & Convert to {outputFormat.toUpperCase()}
                    </>
                  )}
                </button>

                {images.some(img => img.isConverted) && (
                  <button
                    onClick={downloadAllAsZip}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 sm:py-4 bg-white/70 backdrop-blur-xl border border-[#008994]/30 text-[#008994] rounded-xl font-semibold hover:bg-white/90 transition-all text-sm sm:text-base"
                  >
                    <Download className="w-5 h-5" />
                    Download All as ZIP
                  </button>
                )}

                <button
                  onClick={clearAll}
                  disabled={isProcessing}
                  className="sm:w-auto flex items-center justify-center gap-2 px-6 py-3 sm:py-4 bg-red-50 border border-red-200 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  <X className="w-5 h-5" />
                  Clear All
                </button>
              </div>
            </div>
          )}

          {/* Features Info */}
          {images.length === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-12">
              <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl p-4 sm:p-6 shadow-md text-center">
                <div className="w-12 h-12 bg-[#008994]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileType className="w-6 h-6 text-[#008994]" />
                </div>
                <h4 className="font-semibold text-black mb-2 text-sm sm:text-base">6 Formats</h4>
                <p className="text-xs sm:text-sm text-gray-700">JPG, PNG, WEBP, GIF, BMP, HEIC</p>
              </div>

              <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl p-4 sm:p-6 shadow-md text-center">
                <div className="w-12 h-12 bg-[#008994]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <RefreshCw className="w-6 h-6 text-[#008994]" />
                </div>
                <h4 className="font-semibold text-black mb-2 text-sm sm:text-base">Instant Convert</h4>
                <p className="text-xs sm:text-sm text-gray-700">Fast client-side conversion</p>
              </div>

              <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl p-4 sm:p-6 shadow-md text-center">
                <div className="w-12 h-12 bg-[#008994]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ImageIcon className="w-6 h-6 text-[#008994]" />
                </div>
                <h4 className="font-semibold text-black mb-2 text-sm sm:text-base">Preview</h4>
                <p className="text-xs sm:text-sm text-gray-700">See before and after results</p>
              </div>

              <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl p-4 sm:p-6 shadow-md text-center">
                <div className="w-12 h-12 bg-[#008994]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="w-6 h-6 text-[#008994]" />
                </div>
                <h4 className="font-semibold text-black mb-2 text-sm sm:text-base">High Quality</h4>
                <p className="text-xs sm:text-sm text-gray-700">95% quality conversion</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageConverter;
