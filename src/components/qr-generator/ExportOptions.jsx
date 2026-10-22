import { useState } from 'react';
import {
  exportAsPNG,
  exportAsSVG,
  exportAsPDF,
  shareAsPNG,
  canOfferFileShare,
  generateFilename,
  getExportSizes,
  validateExportOptions
} from '../../utils/exportUtils';
import { getEffectiveErrorCorrectionLevel } from '../../utils/qrRenderer';

const ExportOptions = ({ qrConfig, onStyleChange }) => {
  const [exportSize, setExportSize] = useState(512);
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState(null);
  const hasContent = Boolean(qrConfig.content && qrConfig.content.trim());
  const showShare = canOfferFileShare();

  const runExport = async (format) => {
    if (!hasContent) {
      setExportStatus({ type: 'error', message: 'Add content to download' });
      return;
    }

    setIsExporting(true);
    setExportStatus(null);

    try {
      const validation = validateExportOptions({ width: exportSize });
      if (!validation.isValid) {
        setExportStatus({ type: 'error', message: validation.errors.join(', ') });
        return;
      }

      const filename = generateFilename(qrConfig.content, format === 'share' ? 'png' : format);
      let result;
      if (format === 'png') result = await exportAsPNG(qrConfig, exportSize, filename);
      else if (format === 'share') result = await shareAsPNG(qrConfig, exportSize, filename);
      else if (format === 'svg') result = await exportAsSVG(qrConfig, exportSize, filename);
      else if (format === 'pdf') result = await exportAsPDF(qrConfig, exportSize, filename);
      else throw new Error('Unsupported format');

      if (result.cancelled) {
        setExportStatus(null);
      } else if (result.success) {
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
      <div>
        <label htmlFor="export-size" className="block text-sm font-medium text-gray-700 mb-2">
          Export Size
        </label>
        <select
          id="export-size"
          value={exportSize}
          onChange={(e) => setExportSize(Number(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {exportSizes.map((size) => (
            <option key={size.value} value={size.value}>
              {size.label} — {size.description}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-lg border border-gray-200 p-3 space-y-3">
        <label className="flex items-start gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            className="mt-1"
            checked={Boolean(qrConfig.cardEnabled)}
            onChange={(e) => onStyleChange('cardEnabled', e.target.checked)}
          />
          <span>
            <span className="font-medium">Add a card frame</span>
            <span className="block text-xs text-gray-500">Name and subtitle are added on download. The preview stays the code itself.</span>
          </span>
        </label>
        {qrConfig.cardEnabled && (
          <div className="space-y-2">
            <label htmlFor="card-name" className="sr-only">Card name</label>
            <input
              id="card-name"
              type="text"
              value={qrConfig.cardName || ''}
              onChange={(e) => onStyleChange('cardName', e.target.value)}
              maxLength={120}
              placeholder="Name"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <label htmlFor="card-subtitle" className="sr-only">Card subtitle</label>
            <input
              id="card-subtitle"
              type="text"
              value={qrConfig.cardSubtitle || ''}
              onChange={(e) => onStyleChange('cardSubtitle', e.target.value)}
              maxLength={120}
              placeholder="Subtitle"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
        )}
      </div>

      {exportStatus && (
        <div
          className={`p-3 rounded-lg text-sm ${
            exportStatus.type === 'success'
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}
        >
          {exportStatus.message}
        </div>
      )}

      <div className="space-y-2">
        <button
          type="button"
          onClick={() => runExport('png')}
          disabled={isExporting || !hasContent}
          className={`btn-primary w-full flex items-center justify-center space-x-2 ${
            isExporting || !hasContent ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isExporting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Working...</span>
            </>
          ) : (
            <span>Download PNG</span>
          )}
        </button>

        {showShare && (
          <button
            type="button"
            onClick={() => runExport('share')}
            disabled={isExporting || !hasContent}
            className={`btn-secondary w-full ${isExporting || !hasContent ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Share
          </button>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => runExport('svg')}
            disabled={isExporting || !hasContent}
            className={`btn-secondary w-full ${isExporting || !hasContent ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            SVG
          </button>
          <button
            type="button"
            onClick={() => runExport('pdf')}
            disabled={isExporting || !hasContent}
            className={`btn-secondary w-full ${isExporting || !hasContent ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            PDF
          </button>
        </div>
      </div>

      {!hasContent && <p className="text-sm text-gray-500">Add content to download.</p>}

      <div className="text-xs text-gray-500 space-y-1">
        <p><strong>PNG:</strong> Best for web, social, and sharing</p>
        <p><strong>SVG:</strong> Scales for print and slides</p>
        <p><strong>PDF:</strong> A page ready to print</p>
      </div>

      {hasContent && (
        <div className="pt-3 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">QR Code Details</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <p><strong>Content Type:</strong> {qrConfig.contentType}</p>
            <p><strong>Size:</strong> {exportSize}×{exportSize}px{qrConfig.cardEnabled ? ' plus card frame' : ''}</p>
            <p>
              <strong>Error Correction:</strong> {getEffectiveErrorCorrectionLevel(qrConfig)}
              {qrConfig.logo?.url ? ' (boosted for logo)' : ''}
            </p>
            <p><strong>Colors:</strong> {qrConfig.foregroundColor} / {qrConfig.backgroundColor}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportOptions;
