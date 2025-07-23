import { useState } from 'react';

const useQRCode = () => {
  const [qrConfig, setQrConfig] = useState({
    content: '',
    contentType: 'url',
    size: 256,
    backgroundColor: '#ffffff',
    foregroundColor: '#000000',
    errorCorrectionLevel: 'M'
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

  const resetConfig = () => {
    setQrConfig({
      content: '',
      contentType: 'url',
      size: 256,
      backgroundColor: '#ffffff',
      foregroundColor: '#000000',
      errorCorrectionLevel: 'M'
    });
  };

  return {
    qrConfig,
    updateContent,
    updateContentType,
    updateColors,
    updateSize,
    updateErrorCorrectionLevel,
    resetConfig
  };
};

export default useQRCode;
