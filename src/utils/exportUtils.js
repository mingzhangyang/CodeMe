import QRCode from 'qrcode';

/**
 * Export QR code as PNG
 * @param {string} content - QR code content
 * @param {Object} options - QR code options
 * @param {string} filename - Download filename
 */
export const exportAsPNG = async (content, options = {}, filename = 'qrcode.png') => {
  try {
    const canvas = document.createElement('canvas');
    const defaultOptions = {
      width: 512,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M',
      ...options
    };

    await QRCode.toCanvas(canvas, content, defaultOptions);
    
    // Convert canvas to blob and download
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 'image/png');

    return { success: true, message: 'PNG exported successfully' };
  } catch (error) {
    console.error('Error exporting PNG:', error);
    return { success: false, message: 'Failed to export PNG' };
  }
};

/**
 * Export QR code as SVG
 * @param {string} content - QR code content
 * @param {Object} options - QR code options
 * @param {string} filename - Download filename
 */
export const exportAsSVG = async (content, options = {}, filename = 'qrcode.svg') => {
  try {
    const defaultOptions = {
      width: 512,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M',
      type: 'svg',
      ...options
    };

    const svgString = await QRCode.toString(content, defaultOptions);
    
    // Create blob and download
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return { success: true, message: 'SVG exported successfully' };
  } catch (error) {
    console.error('Error exporting SVG:', error);
    return { success: false, message: 'Failed to export SVG' };
  }
};

/**
 * Export QR code as PDF (requires jsPDF)
 * For now, we'll create a simple PDF with the PNG image
 * @param {string} content - QR code content
 * @param {Object} options - QR code options
 * @param {string} filename - Download filename
 */
export const exportAsPDF = async (content, options = {}, filename = 'qrcode.pdf') => {
  try {
    // For PDF export, we'll create a canvas first, then convert to PDF
    const canvas = document.createElement('canvas');
    const defaultOptions = {
      width: 512,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M',
      ...options
    };

    await QRCode.toCanvas(canvas, content, defaultOptions);
    
    // Convert canvas to data URL
    const dataURL = canvas.toDataURL('image/png');
    
    // Create a simple PDF using canvas and download
    // For now, we'll create a basic implementation
    // Later we can enhance this with jsPDF for better PDF formatting
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = filename.replace('.pdf', '.png'); // Fallback to PNG for now
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return { success: true, message: 'PDF exported successfully (as PNG for now)' };
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
    // Extract meaningful part from content for filename
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
      // Use first few words for text content
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
  
  if (options.margin < 0 || options.margin > 10) {
    errors.push('Margin must be between 0 and 10');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
