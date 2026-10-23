import { useCallback, useEffect, useState } from 'react';
import { serializeConfig, designSignature } from '../utils/historySerialization.js';
export { serializeConfig, designSignature, configMatchesItem } from '../utils/historySerialization.js';

const STORAGE_KEY = 'codeme.history.v1';
const MAX_ITEMS = 12;
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
