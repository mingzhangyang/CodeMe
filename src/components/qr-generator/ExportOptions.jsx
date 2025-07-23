import { useState } from 'react';
import { exportAsPNG, exportAsSVG, exportAsPDF, generateFilename, getExportSizes, validateExportOptions } from '../../utils/exportUtils';

const ExportOptions = ({ qrConfig }) => {
  const [exportSize, setExportSize] = useState(512);
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState(null);

  const handleExport = async (format) => {
    if (!qrConfig.content || !qrConfig.content.trim()) {
      setExportStatus({ type: 'error', message: 'Please enter content to generate QR code' });
      return;
    }

    setIsExporting(true);
    setExportStatus(null);

    try {
      const options = {
        width: exportSize,
        margin: 2,
        color: {
          dark: qrConfig.foregroundColor,
          light: qrConfig.backgroundColor
        },
        errorCorrectionLevel: qrConfig.errorCorrectionLevel
      };

      // Validate options
      const validation = validateExportOptions(options);
      if (!validation.isValid) {
        setExportStatus({ type: 'error', message: validation.errors.join(', ') });
        setIsExporting(false);
        return;
      }

      const filename = generateFilename(qrConfig.content, format);
      let result;

      switch (format) {
        case 'png':
          result = await exportAsPNG(qrConfig.content, options, filename);
          break;
        case 'svg':
          result = await exportAsSVG(qrConfig.content, options, filename);
          break;
        case 'pdf':
          result = await exportAsPDF(qrConfig.content, options, filename);
          break;
        default:
          throw new Error('Unsupported format');
      }

      if (result.success) {
        setExportStatus({ type: 'success', message: result.message });
      } else {
        setExportStatus({ type: 'error', message: result.message });
      }
    } catch (error) {
      console.error('Export error:', error);
      setExportStatus({ type: 'error', message: 'Export failed. Please try again.' });
    } finally {
      setIsExporting(false);
    }
  };

  const exportSizes = getExportSizes();

  return (
    <div className="space-y-4">
      {/* Size Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Export Size
        </label>
        <select
          value={exportSize}
          onChange={(e) => setExportSize(Number(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {exportSizes.map((size) => (
            <option key={size.value} value={size.value}>
              {size.label} - {size.description}
            </option>
          ))}
        </select>
      </div>

      {/* Export Status */}
      {exportStatus && (
        <div className={`p-3 rounded-lg text-sm ${
          exportStatus.type === 'success' 
            ? 'bg-green-100 text-green-700 border border-green-200' 
            : 'bg-red-100 text-red-700 border border-red-200'
        }`}>
          {exportStatus.message}
        </div>
      )}

      {/* Export Buttons */}
      <div className="space-y-2">
        <button
          onClick={() => handleExport('png')}
          disabled={isExporting}
          className={`btn-primary w-full flex items-center justify-center space-x-2 ${
            isExporting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isExporting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <span>📥</span>
              <span>Download PNG</span>
            </>
          )}
        </button>

        <button
          onClick={() => handleExport('svg')}
          disabled={isExporting}
          className={`btn-secondary w-full flex items-center justify-center space-x-2 ${
            isExporting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <span>📄</span>
          <span>Download SVG</span>
        </button>

        <button
          onClick={() => handleExport('pdf')}
          disabled={isExporting}
          className={`btn-secondary w-full flex items-center justify-center space-x-2 ${
            isExporting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <span>📋</span>
          <span>Download PDF</span>
        </button>
      </div>

      {/* Export Info */}
      <div className="text-xs text-gray-500 space-y-1">
        <p><strong>PNG:</strong> Best for web use and social media</p>
        <p><strong>SVG:</strong> Vector format, scalable for any size</p>
        <p><strong>PDF:</strong> Professional format for printing</p>
      </div>

      {/* QR Code Info */}
      {qrConfig.content && (
        <div className="pt-3 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">QR Code Details</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <p><strong>Content Type:</strong> {qrConfig.contentType}</p>
            <p><strong>Size:</strong> {exportSize}x{exportSize}px</p>
            <p><strong>Error Correction:</strong> {qrConfig.errorCorrectionLevel}</p>
            <p><strong>Colors:</strong> {qrConfig.foregroundColor} / {qrConfig.backgroundColor}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportOptions;
