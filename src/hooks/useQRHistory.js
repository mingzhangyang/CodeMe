import { useCallback, useEffect, useState } from 'react';

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

export const configMatchesItem = (config, item) => {
  if (!item) return false;
  const { config: stored } = serializeConfig(config);
  return item.signature === designSignature(stored)
    && (item.config?.logo?.url || null) === (stored.logo?.url || null);
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

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== STORAGE_KEY) return;
      setItems(readHistory());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const remember = useCallback((config) => {
    if (!config?.content || !config.content.trim()) return;
    const { config: stored, logoOmitted } = serializeConfig(config);
    const signature = designSignature(stored);
    const prev = readHistory();
    const sameDesign = (item) =>
      item.signature === signature &&
      (item.config?.logo?.url || null) === (stored.logo?.url || null);
    const next = [
      {
        id: `${Date.now()}`,
        savedAt: Date.now(),
        signature,
        logoOmitted,
        config: stored
      },
      ...prev.filter((item) => !sameDesign(item))
    ].slice(0, MAX_ITEMS);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      return;
    }
    setItems(next);
  }, []);

  const remove = useCallback((id) => {
    const next = readHistory().filter((item) => item.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      return;
    }
    setItems(next);
  }, []);

  const clear = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      return;
    }
    setItems([]);
  }, []);

  return { items, remember, remove, clear };
};

export default useQRHistory;
