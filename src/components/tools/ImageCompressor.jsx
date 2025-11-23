import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import JSZip from 'jszip';
import {
  UploadCloud, Download, X, FileImage, Trash2,
  Settings, ChevronDown, ZoomIn, PackageMinus,
  ArrowLeft, Check, Loader2, FolderArchive
} from 'lucide-react';

/**
 * Image Compressor Tool Component
 * Allows users to compress single or multiple images with quality control
 */
const ImageCompressor = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [images, setImages] = useState([]);
  const [quality, setQuality] = useState(80);
  const [maxSizeMB, setMaxSizeMB] = useState(1);
  const [isCompressing, setIsCompressing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [autoCompress, setAutoCompress] = useState(true);
  const [isCreatingZip, setIsCreatingZip] = useState(false);

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    addImages(files);
  };

  // Add images to the list
  const addImages = async (files) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    for (const file of imageFiles) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const newImage = {
          id: Date.now() + Math.random(),
          file: file,
          originalUrl: e.target.result,
          compressedUrl: null,
          originalSize: file.size,
          compressedSize: null,
          name: file.name,
          isCompressed: false,
          isCompressing: false,
          progress: 0,
        };

        setImages(prev => [...prev, newImage]);

        // Auto-compress if enabled
        if (autoCompress) {
          await compressImageById(newImage.id, file);
        }
      };
      reader.readAsDataURL(file);
    }
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
      const files = Array.from(e.dataTransfer.files);
      addImages(files);
    }
  };

  // Compress images
  const compressImages = async () => {
    setIsCompressing(true);

    for (const image of images) {
      if (!image.isCompressed) {
        await compressImageById(image.id, image.file);
      }
    }

    setIsCompressing(false);
  };

  // Compress a single image by ID
  const compressImageById = async (imageId, file) => {
    // Mark as compressing
    setImages(prev =>
      prev.map(img =>
        img.id === imageId
          ? { ...img, isCompressing: true, progress: 0 }
          : img
      )
    );

    const options = {
      maxSizeMB: maxSizeMB,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      initialQuality: quality / 100,
      onProgress: (progress) => {
        setImages(prev =>
          prev.map(img =>
            img.id === imageId
              ? { ...img, progress: Math.round(progress) }
              : img
          )
        );
      },
    };

    try {
      const compressedFile = await imageCompression(file, options);
      const compressedUrl = URL.createObjectURL(compressedFile);

      setImages(prev =>
        prev.map(img =>
          img.id === imageId
            ? {
                ...img,
                compressedUrl,
                compressedSize: compressedFile.size,
                compressedFile: compressedFile,
                isCompressed: true,
                isCompressing: false,
                progress: 100,
              }
            : img
        )
      );
    } catch (error) {
      console.error('Compression error:', error);
      setImages(prev =>
        prev.map(img =>
          img.id === imageId
            ? { ...img, isCompressing: false, progress: 0 }
            : img
        )
      );
    }
  };

  // Download single compressed image
  const downloadImage = (image) => {
    const link = document.createElement('a');
    link.href = image.compressedUrl;
    link.download = `compressed_${image.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download all compressed images as ZIP
  const downloadAll = async () => {
    const compressedImages = images.filter(img => img.isCompressed);

    if (compressedImages.length === 0) return;

    setIsCreatingZip(true);

    try {
      // Create new ZIP file
      const zip = new JSZip();
      const folder = zip.folder('compressed_images');

      // Add each compressed image to the ZIP
      for (const image of compressedImages) {
        try {
          // Fetch the blob from the URL
          const response = await fetch(image.compressedUrl);
          const blob = await response.blob();

          // Add to ZIP with original filename
          folder.file(`compressed_${image.name}`, blob);
        } catch (error) {
          console.error(`Error adding ${image.name} to ZIP:`, error);
        }
      }

      // Generate ZIP file
      const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });

      // Create download link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `compressed_images_${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error creating ZIP:', error);
    } finally {
      setIsCreatingZip(false);
    }
  };

  // Remove image from list
  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  // Clear all images
  const clearAll = () => {
    setImages([]);
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Calculate compression percentage
  const getCompressionPercent = (original, compressed) => {
    if (!compressed) return 0;
    return Math.round((1 - compressed / original) * 100);
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
      <div className="relative z-10 py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 ">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 md:mb-10 gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#008994] flex items-center justify-center">
                  <PackageMinus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black">
                    Image Compressor
                  </h1>
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-700 max-w-2xl">
                Reduce image file size without losing quality. Upload multiple images and compress them instantly.
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

          {/* Settings Panel */}
          <div className="mb-6 sm:mb-8">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-white/70 backdrop-blur-xl border border-white/20 rounded-xl hover:bg-white/90 transition-all font-medium text-sm sm:text-base"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-[#008994]" />
              Compression Settings
              <ChevronDown className={`w-4 h-4 transition-transform ${showSettings ? 'rotate-180' : ''}`} />
            </button>

            {showSettings && (
              <div className="mt-4 p-4 sm:p-6 bg-white/70 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg space-y-4 sm:space-y-6">
                {/* Auto-compress toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-black">Auto Compress</h4>
                    <p className="text-xs text-gray-600">Compress images immediately after upload</p>
                  </div>
                  <button
                    onClick={() => setAutoCompress(!autoCompress)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      autoCompress ? 'bg-[#008994]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        autoCompress ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Quality slider */}
                <label className="block">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm sm:text-base font-semibold text-black">Quality: {quality}%</span>
                    <span className="text-xs sm:text-sm text-gray-600">
                      {quality >= 80 ? 'High Quality' : quality >= 60 ? 'Medium Quality' : 'Low Quality'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#008994]"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Smaller size</span>
                    <span>Better quality</span>
                  </div>
                </label>

                {/* Max size slider */}
                <label className="block">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm sm:text-base font-semibold text-black">Max Output Size: {maxSizeMB} MB</span>
                    <span className="text-xs sm:text-sm text-gray-600">Target size</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="5"
                    step="0.1"
                    value={maxSizeMB}
                    onChange={(e) => setMaxSizeMB(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#008994]"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0.1 MB</span>
                    <span>5 MB</span>
                  </div>
                </label>
              </div>
            )}
          </div>

          {/* Upload Area */}
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
              Upload Your Images
            </h3>
            <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 max-w-md mx-auto">
              Drag and drop your images here, or click to browse. Supports JPG, PNG, WEBP, and more.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-[#008994] to-[#006d76] text-white rounded-full cursor-pointer hover:shadow-lg transition-all font-medium text-sm sm:text-base"
            >
              Choose Images
            </label>
            {images.length > 0 && (
              <p className="mt-4 text-sm text-gray-600">
                {images.length} image{images.length > 1 ? 's' : ''} selected
              </p>
            )}
          </div>

          {/* Action Buttons */}
          {images.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
              <button
                onClick={compressImages}
                disabled={isCompressing || images.every(img => img.isCompressed)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 sm:py-4 bg-gradient-to-r from-[#008994] to-[#006d76] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                <PackageMinus className="w-4 h-4 sm:w-5 sm:h-5" />
                {isCompressing ? 'Compressing...' : images.every(img => img.isCompressed) ? 'All Compressed' : 'Compress All Images'}
              </button>
              {images.some(img => img.isCompressed) && (
                <button
                  onClick={downloadAll}
                  disabled={isCreatingZip}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 sm:py-4 bg-white/70 backdrop-blur-xl border border-[#008994]/30 text-[#008994] rounded-xl font-semibold hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {isCreatingZip ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      Creating ZIP...
                    </>
                  ) : (
                    <>
                      <FolderArchive className="w-4 h-4 sm:w-5 sm:h-5" />
                      Download as ZIP
                    </>
                  )}
                </button>
              )}
              <button
                onClick={clearAll}
                className="sm:w-auto flex items-center justify-center gap-2 px-6 py-3 sm:py-4 bg-red-50 border border-red-200 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-all text-sm sm:text-base"
              >
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                Clear All
              </button>
            </div>
          )}

          {/* Images Grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {images.map(image => (
                <div
                  key={image.id}
                  className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
                >
                  {/* Image Preview */}
                  <div className="relative aspect-video bg-gray-100">
                    <img
                      src={image.isCompressed ? image.compressedUrl : image.originalUrl}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Compression Progress Overlay */}
                    {image.isCompressing && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center">
                        <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
                        <span className="text-white font-semibold text-sm">{image.progress}%</span>
                        <div className="w-3/4 h-1.5 bg-white/30 rounded-full mt-2 overflow-hidden">
                          <div
                            className="h-full bg-[#008994] transition-all duration-300"
                            style={{ width: `${image.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {image.isCompressed && !image.isCompressing && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs font-semibold">
                        <Check className="w-3 h-3" />
                        Compressed
                      </div>
                    )}
                    <button
                      onClick={() => removeImage(image.id)}
                      className="absolute top-2 left-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Image Info */}
                  <div className="p-4">
                    <div className="flex items-start gap-2 mb-3">
                      <FileImage className="w-4 h-4 text-[#008994] mt-0.5 flex-shrink-0" />
                      <p className="text-sm font-medium text-black truncate flex-1">
                        {image.name}
                      </p>
                    </div>

                    {/* Size Info */}
                    <div className="space-y-2 text-xs sm:text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Original:</span>
                        <span className="font-semibold text-black">{formatFileSize(image.originalSize)}</span>
                      </div>
                      {image.isCompressed && (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Compressed:</span>
                            <span className="font-semibold text-[#008994]">{formatFileSize(image.compressedSize)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Saved:</span>
                            <span className="font-semibold text-green-600">
                              {getCompressionPercent(image.originalSize, image.compressedSize)}%
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Download Button */}
                    {image.isCompressed && (
                      <button
                        onClick={() => downloadImage(image)}
                        className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-[#008994] text-white rounded-lg hover:bg-[#006d76] transition-all font-medium text-sm"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Features Info */}
          {images.length === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-12">
              <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl p-4 sm:p-6 shadow-md text-center">
                <div className="w-12 h-12 bg-[#008994]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <UploadCloud className="w-6 h-6 text-[#008994]" />
                </div>
                <h4 className="font-semibold text-black mb-2 text-sm sm:text-base">Multiple Upload</h4>
                <p className="text-xs sm:text-sm text-gray-700">Upload and compress multiple images at once</p>
              </div>

              <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl p-4 sm:p-6 shadow-md text-center">
                <div className="w-12 h-12 bg-[#008994]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Settings className="w-6 h-6 text-[#008994]" />
                </div>
                <h4 className="font-semibold text-black mb-2 text-sm sm:text-base">Quality Control</h4>
                <p className="text-xs sm:text-sm text-gray-700">Adjust compression quality to your needs</p>
              </div>

              <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl p-4 sm:p-6 shadow-md text-center">
                <div className="w-12 h-12 bg-[#008994]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ZoomIn className="w-6 h-6 text-[#008994]" />
                </div>
                <h4 className="font-semibold text-black mb-2 text-sm sm:text-base">Preview</h4>
                <p className="text-xs sm:text-sm text-gray-700">See before and after compression results</p>
              </div>

              <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl p-4 sm:p-6 shadow-md text-center">
                <div className="w-12 h-12 bg-[#008994]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FolderArchive className="w-6 h-6 text-[#008994]" />
                </div>
                <h4 className="font-semibold text-black mb-2 text-sm sm:text-base">ZIP Download</h4>
                <p className="text-xs sm:text-sm text-gray-700">Download all compressed images as ZIP file</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageCompressor;
