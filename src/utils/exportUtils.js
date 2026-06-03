import { renderStyledQR } from './qrRenderer';

/**
 * Trigger a browser download for a Blob.
 */
const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Render the fully styled QR code (shapes, gradient, logo) to an off-screen
 * canvas at the requested export size. This is the same renderer the preview
 * uses, so exports always match what the user sees.
 */
const renderToCanvas = async (qrConfig, size) => {
  const canvas = document.createElement('canvas');
  await renderStyledQR(canvas, { ...qrConfig, size });
  return canvas;
};

/**
 * Export the styled QR code as a PNG.
 */
export const exportAsPNG = async (qrConfig, size = 512, filename = 'qrcode.png') => {
  try {
    const canvas = await renderToCanvas(qrConfig, size);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) throw new Error('Canvas is empty');
    downloadBlob(blob, filename);
    return { success: true, message: 'PNG exported successfully' };
  } catch (error) {
    console.error('Error exporting PNG:', error);
    return { success: false, message: 'Failed to export PNG' };
  }
};

/**
 * Export the styled QR code as an SVG.
 *
 * The styling (custom dot shapes, gradients, embedded logo) is raster-drawn on
 * a canvas, so the SVG embeds that rendering as a high-resolution image inside
 * a scalable <svg> container. This keeps the export visually identical to the
 * preview while remaining an .svg file that scales without pixelation.
 */
export const exportAsSVG = async (qrConfig, size = 512, filename = 'qrcode.svg') => {
  try {
    const canvas = await renderToCanvas(qrConfig, size);
    const dataUrl = canvas.toDataURL('image/png');
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" ` +
      `viewBox="0 0 ${size} ${size}">` +
      `<image width="${size}" height="${size}" href="${dataUrl}" ` +
      `xlink:href="${dataUrl}" xmlns:xlink="http://www.w3.org/1999/xlink"/>` +
      `</svg>`;
    downloadBlob(new Blob([svg], { type: 'image/svg+xml' }), filename);
    return { success: true, message: 'SVG exported successfully' };
  } catch (error) {
    console.error('Error exporting SVG:', error);
    return { success: false, message: 'Failed to export SVG' };
  }
};

/**
 * Export the styled QR code as a PDF, centered on an A4 page.
 */
export const exportAsPDF = async (qrConfig, size = 512, filename = 'qrcode.pdf') => {
  try {
    const canvas = await renderToCanvas(qrConfig, size);
    const dataURL = canvas.toDataURL('image/png');

    // Load jsPDF on demand so it stays out of the initial bundle.
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Place the QR at a comfortable size, centered on the page.
    const qrSize = Math.min(pageWidth, pageHeight) * 0.6;
    const x = (pageWidth - qrSize) / 2;
    const y = (pageHeight - qrSize) / 2;

    pdf.addImage(dataURL, 'PNG', x, y, qrSize, qrSize);
    pdf.save(filename);

    return { success: true, message: 'PDF exported successfully' };
  } catch (error) {
    console.error('Error exporting PDF:', error);
    return { success: false, message: 'Failed to export PDF' };
  }
};

/**
 * Generate filename based on content and timestamp
 * @param {string} content - QR code content
 * @param {string} extension - File extension
 * @returns {string} Generated filename
 */
export const generateFilename = (content, extension) => {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  let baseName = 'qrcode';

  if (content) {
    if (content.startsWith('http')) {
      try {
        const url = new URL(content);
        baseName = url.hostname.replace(/\./g, '-');
      } catch {
        baseName = 'website-qr';
      }
    } else if (content.includes('BEGIN:VCARD')) {
      baseName = 'contact-card';
    } else if (content.length > 0) {
      baseName = content
        .substring(0, 20)
        .replace(/[^a-zA-Z0-9]/g, '-')
        .toLowerCase();
    }
  }

  return `${baseName}-${timestamp}.${extension}`;
};

/**
 * Get export size options
 */
export const getExportSizes = () => [
  { label: 'Small (256px)', value: 256, description: 'Good for web use' },
  { label: 'Medium (512px)', value: 512, description: 'Balanced quality' },
  { label: 'Large (1024px)', value: 1024, description: 'High quality print' },
  { label: 'Extra Large (2048px)', value: 2048, description: 'Professional print' }
];

/**
 * Validate export options
 * @param {Object} options - Export options to validate
 * @returns {Object} Validation result
 */
export const validateExportOptions = (options) => {
  const errors = [];

  if (!options.width || options.width < 64 || options.width > 4096) {
    errors.push('Width must be between 64 and 4096 pixels');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
