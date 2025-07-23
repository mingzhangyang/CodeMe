import { useState } from 'react';
import QRCodeCanvas from '../components/qr-generator/QRCodeCanvas';
import ContentInputs from '../components/qr-generator/ContentInputs';
import useQRCode from '../hooks/useQRCode';

const Generator = () => {
  const { qrConfig, updateContent, updateContentType, updateColors } = useQRCode();

  const handleContentChange = (formattedContent) => {
    updateContent(formattedContent);
  };

  const handleContentTypeChange = (e) => {
    updateContentType(e.target.value);
  };

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
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={qrConfig.contentType}
                onChange={handleContentTypeChange}
              >
                <option value="url">Website URL</option>
                <option value="text">Text Message</option>
                <option value="social">Social Profile</option>
                <option value="vcard">Contact Card</option>
              </select>
            </div>

            {/* Content Input */}
            <div className="mb-6">
              <ContentInputs
                contentType={qrConfig.contentType}
                onContentChange={handleContentChange}
              />
            </div>

            {/* Basic Color Options */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Basic Colors</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foreground Color
                  </label>
                  <input
                    type="color"
                    value={qrConfig.foregroundColor}
                    onChange={(e) => updateColors(e.target.value, null)}
                    className="w-full h-10 border border-gray-300 rounded cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Color
                  </label>
                  <input
                    type="color"
                    value={qrConfig.backgroundColor}
                    onChange={(e) => updateColors(null, e.target.value)}
                    className="w-full h-10 border border-gray-300 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Advanced Options Placeholder */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Advanced Options</h3>
              <p className="text-gray-500 text-sm">
                Shape customization, logos, and templates coming in next phase
              </p>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            
            <div className="flex items-center justify-center mb-6">
              <QRCodeCanvas
                content={qrConfig.content || 'https://codeme.example.com'}
                size={qrConfig.size}
                backgroundColor={qrConfig.backgroundColor}
                foregroundColor={qrConfig.foregroundColor}
                errorCorrectionLevel={qrConfig.errorCorrectionLevel}
              />
            </div>

            {/* QR Info */}
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600">
                {qrConfig.content ? `Content: ${qrConfig.content.substring(0, 50)}${qrConfig.content.length > 50 ? '...' : ''}` : 'Default preview content'}
              </p>
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
