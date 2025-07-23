import { useState } from 'react';

const useQRCode = () => {
  const [qrConfig, setQrConfig] = useState({
    content: '',
    contentType: 'url',
    size: 256,
    backgroundColor: '#ffffff',
    foregroundColor: '#000000',
    errorCorrectionLevel: 'M',
    // Advanced styling options
    dotStyle: 'square',
    cornerStyle: 'square',
    backgroundPattern: 'solid',
    gradientDirection: 'diagonal',
    gradientEndColor: '#000000',
    // Logo options
    logo: null,
    logoSize: 0.2
  });

  const updateContent = (content) => {
    setQrConfig(prev => ({ ...prev, content }));
  };

  const updateContentType = (contentType) => {
    setQrConfig(prev => ({ ...prev, contentType }));
  };

  const updateColors = (foregroundColor, backgroundColor) => {
    setQrConfig(prev => ({ 
      ...prev, 
      foregroundColor: foregroundColor || prev.foregroundColor,
      backgroundColor: backgroundColor || prev.backgroundColor
    }));
  };

  const updateSize = (size) => {
    setQrConfig(prev => ({ ...prev, size }));
  };

  const updateErrorCorrectionLevel = (level) => {
    setQrConfig(prev => ({ ...prev, errorCorrectionLevel: level }));
  };

  const updateStyle = (property, value) => {
    setQrConfig(prev => ({ ...prev, [property]: value }));
  };

  const updateLogo = (logo) => {
    setQrConfig(prev => ({ ...prev, logo }));
  };

  const updateLogoSize = (logoSize) => {
    setQrConfig(prev => ({ ...prev, logoSize }));
  };

  const resetConfig = () => {
    setQrConfig({
      content: '',
      contentType: 'url',
      size: 256,
      backgroundColor: '#ffffff',
      foregroundColor: '#000000',
      errorCorrectionLevel: 'M',
      dotStyle: 'square',
      cornerStyle: 'square',
      backgroundPattern: 'solid',
      gradientDirection: 'diagonal',
      gradientEndColor: '#000000',
      logo: null,
      logoSize: 0.2
    });
  };

  return {
    qrConfig,
    updateContent,
    updateContentType,
    updateColors,
    updateSize,
    updateErrorCorrectionLevel,
    updateStyle,
    updateLogo,
    updateLogoSize,
    resetConfig
  };
};

export default useQRCode;
