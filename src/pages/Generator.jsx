import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AdvancedQRCanvas from '../components/qr-generator/AdvancedQRCanvas';
import ContentInputs from '../components/qr-generator/ContentInputs';
import StyleOptions from '../components/qr-generator/StyleOptions';
import ExportOptions from '../components/qr-generator/ExportOptions';
import useQRCode from '../hooks/useQRCode';
import useQRHistory from '../hooks/useQRHistory';
import useDocumentMeta from '../hooks/useDocumentMeta';
import useDebounce from '../hooks/useDebounce';
import { configFromSample, getSample } from '../data/samples';

const Generator = () => {
  useDocumentMeta({
    title: 'QR Code Generator — Customize & Download | CodeMe',
    description:
      'Generate a personalized QR code for a URL, text, social profile, or contact card. Customize colors, shapes, and logo, preview in real time, and download as PNG, SVG, or PDF.',
    path: '/generator'
  });

  const [searchParams] = useSearchParams();
  const [formEpoch, setFormEpoch] = useState(0);
  const {
    qrConfig,
    revision,
    updateContent,
    updateContentType,
    updateStyle,
    updateLogo,
    updateLogoSize,
    applyConfig
  } = useQRCode();
  const { items, remember, remove, clear } = useQRHistory();
  const configRef = useRef(qrConfig);
  const skipSaveThrough = useRef(0);
  const pendingSave = useRef(null);
  configRef.current = qrConfig;

  const sampleId = searchParams.get('sample');

  useEffect(() => {
    const sample = getSample(sampleId);
    if (!sample) return;
    const pending = pendingSave.current;
    if (pending && pending.version > skipSaveThrough.current && pending.snapshot.content?.trim()) {
      pendingSave.current = null;
      remember(pending.snapshot);
    }
    applyConfig(configFromSample(sample), { persist: true });
    setFormEpoch((epoch) => epoch + 1);
  }, [sampleId, applyConfig, remember]);

  const previewContent = useDebounce(qrConfig.content, 300);

  useEffect(() => {
    if (revision === 0) return undefined;
    const version = revision;
    const snapshot = configRef.current;
    if (version <= skipSaveThrough.current || !snapshot.content || !snapshot.content.trim()) {
      pendingSave.current = null;
      return undefined;
    }
    pendingSave.current = { version, snapshot };
    const timer = setTimeout(() => {
      if (pendingSave.current?.version !== version) return;
      if (version <= skipSaveThrough.current) return;
      pendingSave.current = null;
      remember(snapshot);
    }, 800);
    return () => clearTimeout(timer);
  }, [revision, remember]);

  useEffect(() => {
    const flush = () => {
      const pending = pendingSave.current;
      if (!pending || pending.version <= skipSaveThrough.current) return;
      pendingSave.current = null;
      if (!pending.snapshot.content || !pending.snapshot.content.trim()) return;
      remember(pending.snapshot);
    };
    window.addEventListener('pagehide', flush);
    return () => {
      window.removeEventListener('pagehide', flush);
      flush();
    };
  }, [remember]);

  const clearHistory = () => {
    skipSaveThrough.current = revision;
    pendingSave.current = null;
    clear();
  };

  const handleContentTypeChange = (event) => {
    updateContentType(event.target.value);
    setFormEpoch((epoch) => epoch + 1);
  };

  const restore = (item) => {
    applyConfig(item.config);
    setFormEpoch((epoch) => epoch + 1);
  };

  const hasContent = Boolean(qrConfig.content && qrConfig.content.trim());
  const canvasProps = {
    content: previewContent || '',
    size: qrConfig.size,
    backgroundColor: qrConfig.backgroundColor,
    foregroundColor: qrConfig.foregroundColor,
    errorCorrectionLevel: qrConfig.errorCorrectionLevel,
    dotStyle: qrConfig.dotStyle,
    cornerStyle: qrConfig.cornerStyle,
    backgroundPattern: qrConfig.backgroundPattern,
    gradientDirection: qrConfig.gradientDirection,
    gradientEndColor: qrConfig.gradientEndColor,
    logo: qrConfig.logo,
    logoSize: qrConfig.logoSize
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:hidden sticky top-16 z-20 border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto px-4 py-2 flex items-center gap-3">
          <AdvancedQRCanvas {...canvasProps} size={88} compact />
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900">Preview</p>
            <p className="text-xs text-gray-500 truncate">
              {hasContent ? qrConfig.content : 'Add a link to preview'}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">QR Code Generator</h1>
          <p className="text-gray-600">Create your personalized QR code</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 min-w-0">
            <h2 className="text-xl font-semibold mb-4">Customize Your QR Code</h2>

            <div className="mb-6">
              <label htmlFor="content-type" className="block text-sm font-medium text-gray-700 mb-2">
                Content Type
              </label>
              <select
                id="content-type"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={qrConfig.contentType}
                onChange={handleContentTypeChange}
              >
                <option value="url">Website URL</option>
                <option value="text">Text Message</option>
                <option value="social">Social Profile</option>
                <option value="vcard">Contact Card</option>
              </select>
            </div>

            <div className="mb-6">
              <ContentInputs
                key={`${qrConfig.contentType}-${formEpoch}`}
                contentType={qrConfig.contentType}
                seed={qrConfig.content}
                onContentChange={updateContent}
              />
            </div>

            <div className="mb-6">
              <StyleOptions
                qrConfig={qrConfig}
                onStyleChange={updateStyle}
                onLogoChange={updateLogo}
                onLogoSizeChange={updateLogoSize}
              />
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">Recent on this device</h3>
                {items.length > 0 && (
                  <button type="button" onClick={clearHistory} className="text-xs text-gray-500 hover:text-gray-800">
                    Clear
                  </button>
                )}
              </div>
              {items.length === 0 ? (
                <p className="text-sm text-gray-500">Designs you make are saved here, in this browser only.</p>
              ) : (
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item.id} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => restore(item)}
                        className="flex-1 min-w-0 text-left text-sm px-3 py-2 rounded-lg border border-gray-200 hover:border-blue-400"
                      >
                        <span className="block truncate text-gray-800">
                          {item.config.content.replace(/\s+/g, ' ').slice(0, 64)}
                        </span>
                        {item.logoOmitted && (
                          <span className="block text-xs text-amber-700">Logo was too large to save</span>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(item.id)}
                        className="text-sm text-gray-500 hover:text-red-600 px-2 py-2"
                        aria-label="Delete saved design"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 min-w-0 lg:sticky lg:top-20 lg:self-start">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            <div className="flex items-center justify-center mb-4">
              <AdvancedQRCanvas {...canvasProps} />
            </div>
            <p className="text-center text-sm text-gray-600 mb-4 break-all">
              {hasContent ? qrConfig.content : 'Add a link to preview'}
            </p>
            <ExportOptions qrConfig={qrConfig} onStyleChange={updateStyle} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generator;
