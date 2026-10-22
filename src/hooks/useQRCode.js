import { useCallback, useState } from 'react';

export const defaultQRConfig = {
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
  gradientEndColor: '#bfdbfe',
  logo: null,
  logoSize: 0.2,
  cardEnabled: false,
  cardName: '',
  cardSubtitle: ''
};

const useQRCode = () => {
  const [qrConfig, setQrConfig] = useState(defaultQRConfig);
  const [revision, setRevision] = useState(0);

  const markEdited = () => setRevision((value) => value + 1);

  const updateContent = (content) => {
    setQrConfig((prev) => ({ ...prev, content }));
    markEdited();
  };

  const updateContentType = (contentType) => {
    setQrConfig((prev) => ({ ...prev, contentType, content: '' }));
    markEdited();
  };

  const updateColors = (foregroundColor, backgroundColor) => {
    setQrConfig((prev) => ({
      ...prev,
      foregroundColor: foregroundColor || prev.foregroundColor,
      backgroundColor: backgroundColor || prev.backgroundColor
    }));
    markEdited();
  };

  const updateSize = (size) => {
    setQrConfig((prev) => ({ ...prev, size }));
    markEdited();
  };

  const updateErrorCorrectionLevel = (level) => {
    setQrConfig((prev) => ({ ...prev, errorCorrectionLevel: level }));
    markEdited();
  };

  const updateStyle = (property, value) => {
    setQrConfig((prev) => ({ ...prev, [property]: value }));
    markEdited();
  };

  const updateLogo = (logo) => {
    setQrConfig((prev) => ({ ...prev, logo }));
    markEdited();
  };

  const updateLogoSize = (logoSize) => {
    setQrConfig((prev) => ({ ...prev, logoSize }));
    markEdited();
  };

  const applyConfig = useCallback((partial) => {
    setQrConfig((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetConfig = () => {
    setQrConfig(defaultQRConfig);
  };

  return {
    qrConfig,
    revision,
    updateContent,
    updateContentType,
    updateColors,
    updateSize,
    updateErrorCorrectionLevel,
    updateStyle,
    updateLogo,
    updateLogoSize,
    applyConfig,
    resetConfig
  };
};

export default useQRCode;
