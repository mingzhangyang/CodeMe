import { Link } from 'react-router-dom';
import useDocumentMeta from '../hooks/useDocumentMeta';
import MiniQR from '../components/qr-generator/MiniQR';
import { SAMPLES } from '../data/samples';

const Home = () => {
  useDocumentMeta({
    title: 'CodeMe — Free Personalized QR Code Generator (PNG, SVG, PDF)',
    description:
      'Create beautiful, custom QR codes for your social profiles, websites, text, and contact cards. Add a logo, choose colors and shapes, and export to PNG, SVG, or PDF — free and in your browser.',
    path: '/'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center mb-6">
            <img src="/logo.svg" alt="" className="w-12 h-12 sm:w-16 sm:h-16 mr-3 sm:mr-4" />
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">CodeMe</h1>
          </div>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create beautiful, personalized QR codes for your social profiles, websites, and more.
            Share your digital presence with style.
          </p>
          <Link to="/generator" className="btn-primary inline-block text-lg px-8 py-3">
            Start Creating
          </Link>
        </div>

        <div className="max-w-5xl mx-auto mb-14">
          <h2 className="text-center text-2xl font-semibold text-gray-900 mb-2">Start from a sample</h2>
          <p className="text-center text-gray-600 mb-6">Each one opens in the generator, ready to edit.</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {SAMPLES.map((sample) => (
              <Link
                key={sample.id}
                to={`/generator?sample=${sample.id}`}
                className="bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-shadow"
              >
                <MiniQR
                  size={132}
                  className="mx-auto border border-gray-100"
                  content={sample.content}
                  config={{
                    ...sample.style,
                    logo: sample.logo,
                    logoSize: 0.2
                  }}
                />
                <h3 className="mt-3 font-semibold text-gray-900">{sample.title}</h3>
                <p className="text-sm text-gray-500">{sample.blurb}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Custom Styling</h3>
            <p className="text-gray-600">Personalize colors, shapes, and add your logo</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Real-time Preview</h3>
            <p className="text-gray-600">See your changes instantly as you design</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Multiple Formats</h3>
            <p className="text-gray-600">Export as PNG, SVG, or PDF, or share the image</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
