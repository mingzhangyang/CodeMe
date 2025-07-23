import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

const QRCodeCanvas = ({ 
  content = 'Hello World', 
  size = 256, 
  backgroundColor = '#ffffff',
  foregroundColor = '#000000',
  errorCorrectionLevel = 'M'
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const generateQR = async () => {
      if (!canvasRef.current || !content.trim()) return;

      try {
        const options = {
          width: size,
          margin: 2,
          color: {
            dark: foregroundColor,
            light: backgroundColor
          },
          errorCorrectionLevel: errorCorrectionLevel
        };

        await QRCode.toCanvas(canvasRef.current, content, options);
      } catch (error) {
        console.error('Error generating QR code:', error);
        
        // Draw error message on canvas
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#f3f4f6';
        ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = '#6b7280';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Error generating QR code', size / 2, size / 2);
      }
    };

    generateQR();
  }, [content, size, backgroundColor, foregroundColor, errorCorrectionLevel]);

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

export default QRCodeCanvas;
