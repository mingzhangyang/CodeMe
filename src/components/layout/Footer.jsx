const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center gap-3 text-sm text-gray-400 md:flex-row md:justify-between md:gap-4">
          {/* Brand + copyright */}
          <div className="flex flex-col items-center gap-1 text-center sm:flex-row sm:gap-2 md:text-left">
            <span className="text-gray-300">
              © 2025 <span className="font-semibold text-white">Orangely</span>
            </span>
            <span className="hidden text-gray-600 sm:inline" aria-hidden="true">·</span>
            <span>CodeMe — Personalized QR Code Generator</span>
          </div>

          {/* Contact + credit */}
          <div className="flex flex-col items-center gap-1 text-center sm:flex-row sm:gap-3 md:text-right">
            <a
              href="mailto:contact@orangely.xyz"
              className="text-gray-300 transition-colors hover:text-white"
            >
              contact@orangely.xyz
            </a>
            <span className="hidden text-gray-600 sm:inline" aria-hidden="true">·</span>
            <span>Made with ❤️ for creators</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
