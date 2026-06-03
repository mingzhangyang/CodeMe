import { useEffect, useRef } from 'react';
import { renderStyledQR, drawErrorMessage } from '../../utils/qrRenderer';

const AdvancedQRCanvas = ({
  content = 'Hello World',
  size = 256,
  backgroundColor = '#ffffff',
  foregroundColor = '#000000',
  errorCorrectionLevel = 'M',
  dotStyle = 'square',
  cornerStyle = 'square',
  backgroundPattern = 'solid',
  gradientDirection = 'diagonal',
  gradientEndColor = '#000000',
  logo = null,
  logoSize = 0.2
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    renderStyledQR(canvas, {
      content,
      size,
      backgroundColor,
      foregroundColor,
      errorCorrectionLevel,
      dotStyle,
      cornerStyle,
      backgroundPattern,
      gradientDirection,
      gradientEndColor,
      logo,
      logoSize
    }).catch((error) => {
      console.error('Error generating advanced QR code:', error);
      drawErrorMessage(canvas, size);
    });
  }, [
    content,
    size,
    backgroundColor,
    foregroundColor,
    errorCorrectionLevel,
    dotStyle,
    cornerStyle,
    backgroundPattern,
    gradientDirection,
    gradientEndColor,
    logo,
    logoSize
  ]);

  const hasContent = Boolean(content && content.trim());

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={
          hasContent
            ? `QR code preview for: ${content.substring(0, 80)}`
            : 'QR code preview placeholder'
        }
        className="border border-gray-200 rounded-lg shadow-sm"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      {!hasContent && (
        <p className="text-sm text-gray-500 mt-2">
          Enter content to generate QR code
        </p>
      )}
    </div>
  );
};

export default AdvancedQRCanvas;
