import { useEffect, useRef } from 'react';
import { renderStyledQR } from '../../utils/qrRenderer';

const MiniQR = ({ config, content = 'https://codeme.orangely.xyz', size = 72, className = '' }) => {
  const canvasRef = useRef(null);
  const signature = JSON.stringify({
    content,
    size,
    backgroundColor: config.backgroundColor,
    foregroundColor: config.foregroundColor,
    dotStyle: config.dotStyle,
    cornerStyle: config.cornerStyle,
    backgroundPattern: config.backgroundPattern,
    gradientDirection: config.gradientDirection,
    gradientEndColor: config.gradientEndColor,
    errorCorrectionLevel: config.errorCorrectionLevel,
    logo: config.logo?.url || null,
    logoSize: config.logoSize
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parsed = JSON.parse(signature);
    renderStyledQR(canvas, {
      content: parsed.content,
      size: parsed.size,
      backgroundColor: parsed.backgroundColor,
      foregroundColor: parsed.foregroundColor,
      dotStyle: parsed.dotStyle,
      cornerStyle: parsed.cornerStyle,
      backgroundPattern: parsed.backgroundPattern,
      gradientDirection: parsed.gradientDirection,
      gradientEndColor: parsed.gradientEndColor,
      errorCorrectionLevel: parsed.errorCorrectionLevel,
      logo: parsed.logo ? { url: parsed.logo } : null,
      logoSize: parsed.logoSize || 0.22
    }).catch(() => {});
  }, [signature]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      aria-hidden="true"
      className={`rounded-md bg-white ${className}`}
      style={{ width: size, height: size }}
    />
  );
};

export default MiniQR;
