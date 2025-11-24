import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud, Download, X, RefreshCw,
  ArrowLeft, Loader2, Image as ImageIcon,
  CheckCircle2, AlertCircle, FileType
} from 'lucide-react';

/**
 * Image Converter Tool Component
 * Convert images between different formats (JPG, PNG, WEBP, GIF, BMP)
 */
const ImageConverter = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [images, setImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [outputFormat, setOutputFormat] = useState('png');

  const formats = [
    { value: 'png', label: 'PNG', mime: 'image/png' },
    { value: 'jpeg', label: 'JPG', mime: 'image/jpeg' },
    { value: 'webp', label: 'WEBP', mime: 'image/webp' },
    { value: 'gif', label: 'GIF', mime: 'image/gif' },
    { value: 'bmp', label: 'BMP', mime: 'image/bmp' }
  ];

  // Handle file selection (multiple)
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    addImages(files);
  };

  // Add images to the list
  const addImages = async (files) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    for (const file of imageFiles) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const fileType = file.type.split('/')[1] || 'unknown';

          const newImage = {
            id: Date.now() + Math.random(),
            file: file,
            url: e.target.result,
            name: file.name,
            size: file.size,
            format: fileType,
            isConverted: false,
            convertedBlob: null,
            convertedSize: null
          };

          setImages(prev => [...prev, newImage]);
        };
        img.src = e.target.result;
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

  // Convert all images
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
  };

  // Convert single image
  const convertSingleImage = (imageId, imageUrl, mimeType) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

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
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageUrl;
    });
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
                Convert images between different formats - JPG, PNG, WEBP, GIF, and BMP. Fast and easy conversion.
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
                      accept="image/*"
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
                      Convert to {outputFormat.toUpperCase()}
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
                <h4 className="font-semibold text-black mb-2 text-sm sm:text-base">5 Formats</h4>
                <p className="text-xs sm:text-sm text-gray-700">JPG, PNG, WEBP, GIF, BMP</p>
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
