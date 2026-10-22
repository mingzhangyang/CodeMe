import { useCallback, useState } from 'react';

const STORAGE_KEY = 'codeme.history.v1';
const MAX_ITEMS = 12;
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

const readHistory = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const useQRHistory = () => {
  const [items, setItems] = useState(readHistory);

  const remember = useCallback((config) => {
    if (!config?.content || !config.content.trim()) return;
    const { config: stored, logoOmitted } = serializeConfig(config);
    const signature = designSignature(stored);
    setItems((prev) => {
      const next = [
        {
          id: `${Date.now()}`,
          savedAt: Date.now(),
          signature,
          logoOmitted,
          config: stored
        },
        ...prev.filter((item) => item.signature !== signature)
      ].slice(0, MAX_ITEMS);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        return prev;
      }
      return next;
    });
  }, []);

  const remove = useCallback((id) => {
    setItems((prev) => {
      const next = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        return prev;
      }
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore quota / private mode */
    }
  }, []);

  return { items, remember, remove, clear };
};

export default useQRHistory;
