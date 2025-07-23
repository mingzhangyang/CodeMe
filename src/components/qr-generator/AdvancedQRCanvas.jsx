import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

const AdvancedQRCanvas = ({ 
  content = 'Hello World', 
  size = 256, 
  backgroundColor = '#ffffff',
  foregroundColor = '#000000',
  errorCorrectionLevel = 'M',
  dotStyle = 'square', // square, circle, rounded
  cornerStyle = 'square', // square, circle, rounded
  backgroundPattern = 'solid', // solid, dots, gradient
  gradientDirection = 'diagonal', // horizontal, vertical, diagonal
  gradientEndColor = '#000000',
  logo = null, // logo object with url, width, height
  logoSize = 0.2 // logo size as percentage of QR code
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const generateAdvancedQR = async () => {
      if (!canvasRef.current || !content.trim()) return;

      try {
        // First generate the basic QR code to get the data matrix
        const tempCanvas = document.createElement('canvas');
        await QRCode.toCanvas(tempCanvas, content, {
          width: size,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff'
          },
          errorCorrectionLevel: errorCorrectionLevel
        });

        // Now draw the advanced styled version
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = size;
        canvas.height = size;

        // Get image data from temp canvas to analyze QR structure
        const tempCtx = tempCanvas.getContext('2d');
        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        
        // Draw background
        drawBackground(ctx, size, backgroundColor, backgroundPattern, gradientDirection, gradientEndColor);
        
        // Calculate module size
        const moduleCount = Math.sqrt(getModuleCount(imageData));
        const moduleSize = (size - 40) / moduleCount; // 40px margin
        const startX = 20;
        const startY = 20;

        // Draw QR modules with custom styling
        for (let row = 0; row < moduleCount; row++) {
          for (let col = 0; col < moduleCount; col++) {
            const x = startX + col * moduleSize;
            const y = startY + row * moduleSize;
            
            // Check if this position should be dark
            const pixelIndex = ((Math.floor(y / size * tempCanvas.height) * tempCanvas.width) + Math.floor(x / size * tempCanvas.width)) * 4;
            const isDark = imageData.data[pixelIndex] < 128;
            
            if (isDark) {
              // Check if this is a corner detection pattern
              const isCorner = isCornerPattern(row, col, moduleCount);
              
              if (isCorner) {
                drawModule(ctx, x, y, moduleSize, foregroundColor, cornerStyle);
              } else {
                drawModule(ctx, x, y, moduleSize, foregroundColor, dotStyle);
              }
            }
          }
        }

        // Draw logo if provided
        if (logo && logo.url) {
          await drawLogo(ctx, size, logo, logoSize);
        }

      } catch (error) {
        console.error('Error generating advanced QR code:', error);
        drawErrorMessage(canvasRef.current, size);
      }
    };

    generateAdvancedQR();
  }, [content, size, backgroundColor, foregroundColor, errorCorrectionLevel, dotStyle, cornerStyle, backgroundPattern, gradientDirection, gradientEndColor, logo, logoSize]);

  const drawBackground = (ctx, size, bgColor, pattern, gradientDir, gradientEnd) => {
    if (pattern === 'gradient') {
      const gradient = createGradient(ctx, size, bgColor, gradientEnd, gradientDir);
      ctx.fillStyle = gradient;
    } else if (pattern === 'dots') {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, size, size);
      // Add subtle dot pattern
      ctx.fillStyle = adjustColorOpacity(bgColor, 0.1);
      for (let x = 0; x < size; x += 10) {
        for (let y = 0; y < size; y += 10) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
      return;
    } else {
      ctx.fillStyle = bgColor;
    }
    ctx.fillRect(0, 0, size, size);
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
        ctx.arc(x + size/2, y + size/2, size/2 * 0.8, 0, 2 * Math.PI);
        ctx.fill();
        break;
      case 'rounded':
        drawRoundedRect(ctx, x, y, size, size, size * 0.2);
        break;
      case 'diamond':
        ctx.beginPath();
        ctx.moveTo(x + size/2, y);
        ctx.lineTo(x + size, y + size/2);
        ctx.lineTo(x + size/2, y + size);
        ctx.lineTo(x, y + size/2);
        ctx.closePath();
        ctx.fill();
        break;
      case 'square':
      default:
        ctx.fillRect(x, y, size, size);
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

  const getModuleCount = (imageData) => {
    // Simplified module counting - in reality this would be more complex
    // For now, we'll estimate based on common QR code sizes
    const width = Math.sqrt(imageData.data.length / 4);
    if (width < 200) return 21 * 21; // Version 1
    if (width < 300) return 25 * 25; // Version 2
    if (width < 400) return 29 * 29; // Version 3
    return 33 * 33; // Version 4
  };

  const isCornerPattern = (row, col, moduleCount) => {
    // Check if this module is part of a corner detection pattern
    const isTopLeft = row < 9 && col < 9;
    const isTopRight = row < 9 && col >= moduleCount - 9;
    const isBottomLeft = row >= moduleCount - 9 && col < 9;
    return isTopLeft || isTopRight || isBottomLeft;
  };

  const adjustColorOpacity = (color, opacity) => {
    // Simple opacity adjustment for hex colors
    if (color.startsWith('#')) {
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
        // Calculate logo dimensions
        const logoSize = canvasSize * logoSizeRatio;
        const logoX = (canvasSize - logoSize) / 2;
        const logoY = (canvasSize - logoSize) / 2;
        
        // Create a circular or rounded background for the logo
        const padding = logoSize * 0.1;
        const bgSize = logoSize + padding * 2;
        const bgX = logoX - padding;
        const bgY = logoY - padding;
        
        // Draw white background with border
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(bgX, bgY, bgSize, bgSize, bgSize * 0.1);
        ctx.fill();
        
        // Add subtle border
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw the logo
        ctx.save();
        
        // Create clipping path for rounded logo
        ctx.beginPath();
        ctx.roundRect(logoX, logoY, logoSize, logoSize, logoSize * 0.05);
        ctx.clip();
        
        // Draw the image
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

  const drawErrorMessage = (canvas, size) => {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#6b7280';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Error generating QR code', size / 2, size / 2);
  };

  return (
    <div className="flex flex-col items-center">
      <canvas 
        ref={canvasRef}
        className="border border-gray-200 rounded-lg shadow-sm"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      {!content.trim() && (
        <p className="text-sm text-gray-500 mt-2">
          Enter content to generate QR code
        </p>
      )}
    </div>
  );
};

export default AdvancedQRCanvas;
