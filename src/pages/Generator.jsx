const Generator = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            QR Code Generator
          </h1>
          <p className="text-gray-600">
            Create your personalized QR code
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Panel - Controls */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Customize Your QR Code</h2>
            
            {/* Content Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Type
              </label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="url">Website URL</option>
                <option value="text">Text Message</option>
                <option value="social">Social Profile</option>
                <option value="vcard">Contact Card</option>
              </select>
            </div>

            {/* Content Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Enter your content here..."
              />
            </div>

            {/* Style Options Placeholder */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Style Options</h3>
              <p className="text-gray-500 text-sm">
                Style customization options will be added in the next phase
              </p>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            
            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg mb-4">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">📱</div>
                <p>QR Code preview will appear here</p>
              </div>
            </div>

            {/* Export Options */}
            <div className="space-y-2">
              <button className="btn-primary w-full">
                Download PNG
              </button>
              <button className="btn-secondary w-full">
                Download SVG
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generator;
