import AdvancedQRCanvas from '../components/qr-generator/AdvancedQRCanvas';
import ContentInputs from '../components/qr-generator/ContentInputs';
import StyleOptions from '../components/qr-generator/StyleOptions';
import ExportOptions from '../components/qr-generator/ExportOptions';
import useQRCode from '../hooks/useQRCode';
import useDocumentMeta from '../hooks/useDocumentMeta';

const Generator = () => {
  useDocumentMeta({
    title: 'QR Code Generator — Customize & Download | CodeMe',
    description:
      'Generate a personalized QR code for a URL, text, social profile, or contact card. Customize colors, shapes, and logo, preview in real time, and download as PNG, SVG, or PDF.',
    path: '/generator'
  });

  const {
    qrConfig,
    updateContent,
    updateContentType,
    updateStyle,
    updateLogo,
    updateLogoSize
  } = useQRCode();

  const handleContentChange = (formattedContent) => {
    updateContent(formattedContent);
  };

  const handleContentTypeChange = (e) => {
    updateContentType(e.target.value);
  };

  const handleStyleChange = (property, value) => {
    updateStyle(property, value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            QR Code Generator
          </h1>
          <p className="text-gray-600">
            Create your personalized QR code
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {/* Left Panel - Controls */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
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

            {/* Advanced Style Options */}
            <div className="mb-6">
              <StyleOptions 
                qrConfig={qrConfig} 
                onStyleChange={handleStyleChange}
                onLogoChange={updateLogo}
                onLogoSizeChange={updateLogoSize}
              />
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:sticky lg:top-20 lg:self-start">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>

            <div className="flex items-center justify-center mb-6">
              <AdvancedQRCanvas
                content={qrConfig.content || 'https://codeme.example.com'}
                size={qrConfig.size}
                backgroundColor={qrConfig.backgroundColor}
                foregroundColor={qrConfig.foregroundColor}
                errorCorrectionLevel={qrConfig.errorCorrectionLevel}
                dotStyle={qrConfig.dotStyle}
                cornerStyle={qrConfig.cornerStyle}
                backgroundPattern={qrConfig.backgroundPattern}
                gradientDirection={qrConfig.gradientDirection}
                gradientEndColor={qrConfig.gradientEndColor}
                logo={qrConfig.logo}
                logoSize={qrConfig.logoSize}
              />
            </div>

            {/* QR Info */}
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600">
                {qrConfig.content ? `Content: ${qrConfig.content.substring(0, 50)}${qrConfig.content.length > 50 ? '...' : ''}` : 'Default preview content'}
              </p>
            </div>

            {/* Export Options */}
            <ExportOptions qrConfig={qrConfig} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generator;
