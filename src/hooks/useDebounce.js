import { useEffect, useState } from 'react';

/**
 * Returns a debounced copy of `value` that only updates after `delay`
 * milliseconds have passed without a change. Used to avoid re-rendering the
 * QR canvas on every keystroke while typing content.
 *
 * @param {*} value - the value to debounce
 * @param {number} [delay=300] - debounce delay in milliseconds
 * @returns {*} the debounced value
 */
const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
