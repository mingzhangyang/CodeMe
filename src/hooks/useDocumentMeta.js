import { useEffect } from 'react';

const SITE_URL = 'https://codeme.orangely.xyz';
const SITE_NAME = 'CodeMe';

/**
 * Updates per-route document metadata for SEO and link sharing without any
 * external dependency. Sets the document title, meta description, canonical
 * URL, and the matching Open Graph / Twitter tags, then restores nothing on
 * unmount (the next route sets its own values).
 *
 * @param {Object} meta
 * @param {string} meta.title - Full <title> text for the route.
 * @param {string} meta.description - Meta description for the route.
 * @param {string} [meta.path] - Absolute path of the route, e.g. "/generator".
 */
const useDocumentMeta = ({ title, description, path = '/' }) => {
  useEffect(() => {
    const url = `${SITE_URL}${path}`;

    if (title) {
      document.title = title;
    }

    const setMeta = (selector, attr, key, value) => {
      if (!value) return;
      let el = document.head.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', url);
    setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', SITE_NAME);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  }, [title, description, path]);
};

export default useDocumentMeta;
