import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Tools from './pages/Tools';
import ImageCompressor from './components/tools/ImageCompressor';
import BackgroundRemover from './components/tools/BackgroundRemover';
import ImageUpscaler from './components/tools/ImageUpscaler';
import ImageConverter from './components/tools/ImageConverter';
import ImageCropper from './components/tools/ImageCropper';
import ImageFlip from './components/tools/ImageFlip';
import './App.css';

/**
 * Main App Component
 * Manages routing for the application
 */
function App() {
  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      {/* Header Component - visible on all pages */}
      <Header />

      {/* Main Content Area - Routes */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/image-compress" element={<ImageCompressor />} />
          <Route path="/background-remover" element={<BackgroundRemover />} />
          <Route path="/image-upscale" element={<ImageUpscaler />} />
          <Route path="/image-converter" element={<ImageConverter />} />
          <Route path="/image-cropper" element={<ImageCropper />} />
          <Route path="/image-flip" element={<ImageFlip />} />
        </Routes>
      </main>

      {/* Footer Component - visible on all pages */}
      <Footer />
    </div>
  );
}

export default App;
