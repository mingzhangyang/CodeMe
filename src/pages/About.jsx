const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">
            About CodeMe
          </h1>

          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">What is CodeMe?</h2>
            <p className="text-gray-600 mb-4">
              CodeMe is a modern, user-friendly QR code generator designed for creators, 
              professionals, and anyone who wants to share their digital presence with style. 
              Create beautiful, personalized QR codes that stand out and represent your brand.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">How to Use</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">1</span>
                <p className="text-gray-600">Choose your content type (URL, text, social profile, or contact card)</p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">2</span>
                <p className="text-gray-600">Enter your content and customize the appearance</p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">3</span>
                <p className="text-gray-600">Preview your QR code in real-time</p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">4</span>
                <p className="text-gray-600">Download in your preferred format (PNG, SVG, or PDF)</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Privacy & Security</h2>
            <p className="text-gray-600 mb-4">
              Your privacy is important to us. All QR code generation happens directly in your browser - 
              your data never leaves your device unless you explicitly choose to save it to the cloud.
            </p>
            <p className="text-gray-600">
              We don't track your QR code content or store any personal information without your consent.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-600 mb-4">
              Have questions, feedback, or need support? We'd love to hear from you!
            </p>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-blue-600 mr-3">📧</span>
                <a 
                  href="mailto:contact@orangely.xyz" 
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  contact@orangely.xyz
                </a>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 mr-3 mt-0.5">💡</span>
                <p className="text-gray-600">
                  Whether you have feature requests, bug reports, or just want to say hello, 
                  we're here to help make CodeMe better for everyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
