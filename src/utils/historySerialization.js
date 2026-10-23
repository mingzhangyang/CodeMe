const MAX_LOGO_URL = 150000;


export const serializeConfig = (config) => {
  let logo = null;
  let logoOmitted = false;
  if (config.logo?.url) {
    if (config.logo.url.length <= MAX_LOGO_URL) {
      logo = {
        url: config.logo.url,
        width: config.logo.width || null,
        height: config.logo.height || null,
        name: config.logo.file?.name || config.logo.name || 'logo'
      };
    } else {
      logoOmitted = true;
    }
  }

  return {
    config: {
      content: config.content,
      contentType: config.contentType,
      size: config.size,
      backgroundColor: config.backgroundColor,
      foregroundColor: config.foregroundColor,
      errorCorrectionLevel: config.errorCorrectionLevel || 'M',
      dotStyle: config.dotStyle,
      cornerStyle: config.cornerStyle,
      backgroundPattern: config.backgroundPattern,
      gradientDirection: config.gradientDirection,
      gradientEndColor: config.gradientEndColor,
      logo,
      logoSize: config.logoSize,
      cardEnabled: Boolean(config.cardEnabled),
      cardName: config.cardName || '',
      cardSubtitle: config.cardSubtitle || ''
    },
    logoOmitted
  };
};

export const designSignature = (stored) => {
  const { logo, ...rest } = stored;
  return JSON.stringify({
    ...rest,
    logo: logo?.url ? `${logo.url.length}:${logo.url.slice(0, 64)}` : null
  });
};

export const configMatchesItem = (config, item) => {
  if (!item) return false;
  const { config: stored } = serializeConfig(config);
  return item.signature === designSignature(stored)
    && (item.config?.logo?.url || null) === (stored.logo?.url || null);
};

