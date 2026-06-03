import QRCode from 'qrcode';

/**
 * Shared, resolution-independent renderer for styled QR codes.
 *
 * Both the live preview (AdvancedQRCanvas) and the export pipeline use this so
 * a downloaded file always matches what the user sees — including dot/corner
 * shapes, gradient backgrounds, and an embedded logo.
 *
 * Unlike pixel-sampling a pre-rendered QR, this reads the exact module matrix
 * from the qrcode library, so it renders crisply at any size (256px preview or
 * 2048px print export) without guessing the QR version.
 */

/**
 * When a logo is embedded it covers the center of the code, so we force the
 * highest error-correction level (H ≈ 30%) to keep the code scannable.
 * @param {Object} config
 * @returns {string} effective error correction level
 */
export const getEffectiveErrorCorrectionLevel = (config) => {
  if (config.logo && config.logo.url) return 'H';
  return config.errorCorrectionLevel || 'M';
};

/**
 * Render a styled QR code onto the given canvas.
 * @param {HTMLCanvasElement} canvas - target canvas (resized to `size`)
 * @param {Object} config - QR configuration (content, size, colors, styles, logo)
 * @returns {Promise<boolean>} true if rendered, false if there was no content
 */
export const renderStyledQR = async (canvas, config) => {
  const {
    content,
    size = 256,
    backgroundColor = '#ffffff',
    foregroundColor = '#000000',
    dotStyle = 'square',
    cornerStyle = 'square',
    backgroundPattern = 'solid',
    gradientDirection = 'diagonal',
    gradientEndColor = '#000000',
    logo = null,
    logoSize = 0.2
  } = config;

  const ctx = canvas.getContext('2d');
  canvas.width = size;
  canvas.height = size;

  if (!content || !content.trim()) {
    // Nothing to render — leave a clean background.
    drawBackground(ctx, size, backgroundColor, backgroundPattern, gradientDirection, gradientEndColor);
    return false;
  }

  // Read the exact module matrix from the QR library.
  const qr = QRCode.create(content, {
    errorCorrectionLevel: getEffectiveErrorCorrectionLevel(config)
  });
  const moduleCount = qr.modules.size;
  const data = qr.modules.data;

  // Background first.
  drawBackground(ctx, size, backgroundColor, backgroundPattern, gradientDirection, gradientEndColor);

  // Quiet-zone margin scales with the output size.
  const margin = Math.round(size * 0.08);
  const moduleSize = (size - margin * 2) / moduleCount;

  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (!data[row * moduleCount + col]) continue;
      const x = margin + col * moduleSize;
      const y = margin + row * moduleSize;
      const style = isCornerPattern(row, col, moduleCount) ? cornerStyle : dotStyle;
      drawModule(ctx, x, y, moduleSize, foregroundColor, style);
    }
  }

  if (logo && logo.url) {
    await drawLogo(ctx, size, logo, logoSize);
  }

  return true;
};

const drawBackground = (ctx, size, bgColor, pattern, gradientDir, gradientEnd) => {
  if (pattern === 'gradient') {
    ctx.fillStyle = createGradient(ctx, size, bgColor, gradientEnd, gradientDir);
    ctx.fillRect(0, 0, size, size);
    return;
  }

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  if (pattern === 'dots') {
    ctx.fillStyle = adjustColorOpacity(bgColor, 0.1);
    const step = Math.max(8, Math.round(size / 25));
    for (let x = 0; x < size; x += step) {
      for (let y = 0; y < size; y += step) {
        ctx.beginPath();
        ctx.arc(x, y, Math.max(1, size / 256), 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }
};

const createGradient = (ctx, size, startColor, endColor, direction) => {
  let gradient;
  switch (direction) {
    case 'horizontal':
      gradient = ctx.createLinearGradient(0, 0, size, 0);
      break;
    case 'vertical':
      gradient = ctx.createLinearGradient(0, 0, 0, size);
      break;
    case 'diagonal':
    default:
      gradient = ctx.createLinearGradient(0, 0, size, size);
      break;
  }
  gradient.addColorStop(0, startColor);
  gradient.addColorStop(1, endColor);
  return gradient;
};

const drawModule = (ctx, x, y, size, color, style) => {
  ctx.fillStyle = color;

  switch (style) {
    case 'circle':
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, (size / 2) * 0.85, 0, 2 * Math.PI);
      ctx.fill();
      break;
    case 'rounded':
      drawRoundedRect(ctx, x, y, size, size, size * 0.25);
      break;
    case 'diamond':
      ctx.beginPath();
      ctx.moveTo(x + size / 2, y);
      ctx.lineTo(x + size, y + size / 2);
      ctx.lineTo(x + size / 2, y + size);
      ctx.lineTo(x, y + size / 2);
      ctx.closePath();
      ctx.fill();
      break;
    case 'square':
    default:
      // Slight overlap avoids hairline gaps between modules at large sizes.
      ctx.fillRect(x, y, size + 0.5, size + 0.5);
      break;
  }
};

const drawRoundedRect = (ctx, x, y, width, height, radius) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
};

const isCornerPattern = (row, col, moduleCount) => {
  // The three finder patterns occupy 7x7 modules in each corner (except
  // bottom-right). Treat that region as "corner" so it uses cornerStyle.
  const isTopLeft = row < 7 && col < 7;
  const isTopRight = row < 7 && col >= moduleCount - 7;
  const isBottomLeft = row >= moduleCount - 7 && col < 7;
  return isTopLeft || isTopRight || isBottomLeft;
};

const adjustColorOpacity = (color, opacity) => {
  if (color.startsWith('#') && color.length >= 7) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
};

const drawLogo = async (ctx, canvasSize, logo, logoSizeRatio) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const logoSize = canvasSize * logoSizeRatio;
      const logoX = (canvasSize - logoSize) / 2;
      const logoY = (canvasSize - logoSize) / 2;

      const padding = logoSize * 0.1;
      const bgSize = logoSize + padding * 2;
      const bgX = logoX - padding;
      const bgY = logoY - padding;

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(bgX, bgY, bgSize, bgSize, bgSize * 0.1);
      ctx.fill();

      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = Math.max(1, canvasSize / 256);
      ctx.stroke();

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(logoX, logoY, logoSize, logoSize, logoSize * 0.05);
      ctx.clip();
      ctx.drawImage(img, logoX, logoY, logoSize, logoSize);
      ctx.restore();
      resolve();
    };
    img.onerror = () => {
      console.error('Failed to load logo image');
      resolve();
    };
    img.src = logo.url;
  });
};

export const drawErrorMessage = (canvas, size) => {
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#f3f4f6';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#6b7280';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Error generating QR code', size / 2, size / 2);
};
