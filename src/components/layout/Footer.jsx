const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-300">
              © 2025 Orangely. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <a 
              href="mailto:contact@orangely.xyz" 
              className="text-gray-300 hover:text-white transition-colors text-sm"
            >
              📧 contact@orangely.xyz
            </a>
            <div className="text-gray-500 text-sm">
              Made with ❤️ for creators
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>
              CodeMe - Personalized QR Code Generator
            </p>
            <p className="mt-2 md:mt-0">
              Generate beautiful QR codes with style
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
