import { Link } from 'react-router-dom';
import useDocumentMeta from '../hooks/useDocumentMeta';

const About = () => {
  useDocumentMeta({
    title: 'About CodeMe — Free, Private QR Code Generator',
    description:
      'Learn about CodeMe, a free and privacy-first QR code generator. See how to create custom QR codes in four steps, how your data stays in your browser, and how to get in touch.',
    path: '/about'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">
            About CodeMe
          </h1>

          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">What is CodeMe?</h2>
            <p className="text-gray-600">
              CodeMe is a QR code generator for creators and anyone who wants a code that looks like them.
              Pick a link, a note, a social profile, or a contact card, style it, and download a PNG, SVG, or PDF.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">How to Use</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 shrink-0">1</span>
                <p className="text-gray-600">Choose a sample on the home page, or start from a blank URL, text, social profile, or contact card.</p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 shrink-0">2</span>
                <p className="text-gray-600">Adjust the preset, colors, shapes, and an optional logo. On a phone, the small preview stays on screen while you edit.</p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 shrink-0">3</span>
                <p className="text-gray-600">Download a PNG, or share it. SVG and PDF are there when you need them. A card frame can add your name.</p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 shrink-0">4</span>
                <p className="text-gray-600">Recent designs stay in this browser, so a refresh does not throw the work away.</p>
              </div>
            </div>
            <Link to="/generator" className="btn-primary inline-block mt-6">
              Open the generator
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Privacy</h2>
            <p className="text-gray-600 mb-4">
              QR codes are generated in your browser. The link, text, or contact details you type are not uploaded.
              Recent designs and uploaded logos are stored only in local storage on this device.
            </p>
            <p className="text-gray-600">
              The site uses Google Analytics to count page views. That measurement does not include the contents of your QR codes.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
            <h2 className="text-2xl font-semibold mb-4">Contact</h2>
            <p className="text-gray-600 mb-4">
              Questions, bugs, or an idea for the next preset — write anytime.
            </p>
            <a
              href="mailto:contact@orangely.xyz"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              contact@orangely.xyz
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
