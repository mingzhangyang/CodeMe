import { renderStyledQR } from './qrRenderer';

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

const canvasToBlob = (canvas) =>
  new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Canvas is empty'));
    }, 'image/png');
  });

const fillTextEllipsis = (ctx, text, maxWidth) => {
  const value = text.length > 240 ? text.slice(0, 240) : text;
  if (ctx.measureText(value).width <= maxWidth) return value;
  if (ctx.measureText('…').width > maxWidth) return '';

  let low = 0;
  let high = value.length;
  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    const candidate = `${value.slice(0, mid)}…`;
    if (ctx.measureText(candidate).width <= maxWidth) low = mid;
    else high = mid - 1;
  }

  return low === 0 ? '…' : `${value.slice(0, low)}…`;
};

/**
 * Render the styled QR, optionally on a name/subtitle card.
 * The live preview stays the bare code; the frame is an export-only option.
 */
export const renderExportCanvas = async (qrConfig, size) => {
  const qrCanvas = document.createElement('canvas');
  await renderStyledQR(qrCanvas, { ...qrConfig, size });

  const name = (qrConfig.cardName || '').trim();
  const subtitle = (qrConfig.cardSubtitle || '').trim();
  if (!qrConfig.cardEnabled || (!name && !subtitle)) {
    return qrCanvas;
  }

  const pad = Math.round(size * 0.08);
  const nameSize = Math.round(size * 0.075);
  const subSize = Math.round(size * 0.042);
  const header = name ? nameSize + pad : Math.round(pad / 2);
  const footer = subtitle ? subSize + pad : Math.round(pad / 2);
  const width = size + pad * 2;
  const height = pad + header + size + footer + pad;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = Math.max(2, Math.round(size / 128));
  ctx.strokeRect(ctx.lineWidth / 2, ctx.lineWidth / 2, width - ctx.lineWidth, height - ctx.lineWidth);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  if (name) {
    ctx.fillStyle = '#111827';
    ctx.font = `600 ${nameSize}px system-ui, sans-serif`;
    ctx.fillText(fillTextEllipsis(ctx, name, width - pad * 2), width / 2, pad + nameSize);
  }

  ctx.drawImage(qrCanvas, pad, pad + header);

  if (subtitle) {
    ctx.fillStyle = '#4b5563';
    ctx.font = `${subSize}px system-ui, sans-serif`;
    ctx.fillText(
      fillTextEllipsis(ctx, subtitle, width - pad * 2),
      width / 2,
      pad + header + size + subSize + Math.round(pad / 3)
    );
  }

  return canvas;
};

export const exportAsPNG = async (qrConfig, size = 512, filename = 'qrcode.png') => {
  try {
    const canvas = await renderExportCanvas(qrConfig, size);
    const blob = await canvasToBlob(canvas);
    downloadBlob(blob, filename);
    return { success: true, message: 'PNG downloaded' };
  } catch (error) {
    console.error('Error exporting PNG:', error);
    return { success: false, message: 'Failed to export PNG' };
  }
};

/**
 * Share the PNG via the system sheet when the browser allows file shares
 * (iOS Safari). Otherwise fall back to a normal download.
 */
export const shareAsPNG = async (qrConfig, size = 512, filename = 'qrcode.png') => {
  try {
    const canvas = await renderExportCanvas(qrConfig, size);
    const blob = await canvasToBlob(canvas);
    const file = new File([blob], filename, { type: 'image/png' });
    const canShareFiles =
      typeof navigator.share === 'function' &&
      typeof navigator.canShare === 'function' &&
      navigator.canShare({ files: [file] });

    if (canShareFiles) {
      await navigator.share({ files: [file], title: 'CodeMe QR code' });
      return { success: true, message: 'PNG shared' };
    }

    downloadBlob(blob, filename);
    return {
      success: true,
      message: 'Sharing is not available in this browser, so the PNG was downloaded'
    };
  } catch (error) {
    if (error?.name === 'AbortError') {
      return { success: true, cancelled: true, message: 'Share cancelled' };
    }
    console.error('Error sharing PNG:', error);
    return { success: false, message: 'Failed to share PNG' };
  }
};

export const canOfferFileShare = () => {
  if (typeof navigator === 'undefined' || typeof navigator.canShare !== 'function') return false;
  try {
    const probe = new File(
      [new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])],
      'probe.png',
      { type: 'image/png' }
    );
    return navigator.canShare({ files: [probe] });
  } catch {
    return false;
  }
};

export const exportAsSVG = async (qrConfig, size = 512, filename = 'qrcode.svg') => {
  try {
    const canvas = await renderExportCanvas(qrConfig, size);
    const dataUrl = canvas.toDataURL('image/png');
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}" ` +
      `viewBox="0 0 ${canvas.width} ${canvas.height}">` +
      `<image width="${canvas.width}" height="${canvas.height}" href="${dataUrl}" ` +
      `xlink:href="${dataUrl}" xmlns:xlink="http://www.w3.org/1999/xlink"/>` +
      `</svg>`;
    downloadBlob(new Blob([svg], { type: 'image/svg+xml' }), filename);
    return { success: true, message: 'SVG downloaded' };
  } catch (error) {
    console.error('Error exporting SVG:', error);
    return { success: false, message: 'Failed to export SVG' };
  }
};

export const exportAsPDF = async (qrConfig, size = 512, filename = 'qrcode.pdf') => {
  try {
    const canvas = await renderExportCanvas(qrConfig, size);
    const dataURL = canvas.toDataURL('image/png');

    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const aspect = canvas.width / canvas.height;
    let drawWidth = Math.min(pageWidth, pageHeight) * 0.72;
    let drawHeight = drawWidth / aspect;
    if (drawHeight > pageHeight * 0.8) {
      drawHeight = pageHeight * 0.8;
      drawWidth = drawHeight * aspect;
    }
    const x = (pageWidth - drawWidth) / 2;
    const y = (pageHeight - drawHeight) / 2;

    pdf.addImage(dataURL, 'PNG', x, y, drawWidth, drawHeight);
    pdf.save(filename);

    return { success: true, message: 'PDF downloaded' };
  } catch (error) {
    console.error('Error exporting PDF:', error);
    return { success: false, message: 'Failed to export PDF' };
  }
};

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

export const getExportSizes = () => [
  { label: 'Small (256px)', value: 256, description: 'Good for web use' },
  { label: 'Medium (512px)', value: 512, description: 'Balanced quality' },
  { label: 'Large (1024px)', value: 1024, description: 'High quality print' },
  { label: 'Extra Large (2048px)', value: 2048, description: 'Professional print' }
];

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
