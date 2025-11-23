import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ImageCompressor from './components/tools/ImageCompressor';
import BackgroundRemover from './components/tools/BackgroundRemover';
import ImageUpscaler from './components/tools/ImageUpscaler';
import ImageConverter from './components/tools/ImageConverter';
import ImageResizer from './components/tools/ImageResizer';
import './App.css';
import Home from './components/Home';

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
          <Route path="/imagecompress" element={<ImageCompressor />} />
          <Route path="/backgroundremover" element={<BackgroundRemover />} />
          <Route path="/imageupscale" element={<ImageUpscaler />} />
          <Route path="/imageconverter" element={<ImageConverter />} />
          <Route path="/imageresizer" element={<ImageResizer />} />
        </Routes>
      </main>

      {/* Footer Component - visible on all pages */}
      <Footer />
    </div>
  );
}

export default App;
