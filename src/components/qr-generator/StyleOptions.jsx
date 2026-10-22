import { useEffect, useState } from 'react';
import LogoUpload from './LogoUpload';
import MiniQR from './MiniQR';

const normalizeHex = (value) => {
  const trimmed = value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) return trimmed.toLowerCase();
  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    return `#${[...trimmed.slice(1)].map((char) => char + char).join('')}`.toLowerCase();
  }
  return null;
};

const ColorField = ({ id, label, value, onChange }) => {
  const [text, setText] = useState(value || '#000000');

  useEffect(() => {
    setText(value || '#000000');
  }, [value]);

  const commit = () => {
    const next = normalizeHex(text);
    if (next) onChange(next);
    else setText(value || '#000000');
  };

  return (
    <div>
      <label htmlFor={`${id}-text`} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex items-center space-x-2">
        <input
          id={`${id}-picker`}
          type="color"
          aria-label={`${label} picker`}
          value={normalizeHex(value) || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
        />
        <input
          id={`${id}-text`}
          type="text"
          value={text}
          spellCheck="false"
          onChange={(e) => setText(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit();
          }}
          className="flex-1 min-w-0 p-2 border border-gray-300 rounded text-sm"
          placeholder="#000000"
        />
      </div>
    </div>
  );
};

const Icon = ({ children }) => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    {children}
  </svg>
);

const tabs = [
  {
    id: 'presets',
    label: 'Presets',
    icon: (
      <Icon>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l2.2 4.6L19 8.2l-3.5 3.4.8 4.9L12 14.8 7.7 16.5l.8-4.9L5 8.2l4.8-.6L12 3z" />
      </Icon>
    )
  },
  {
    id: 'colors',
    label: 'Colors',
    icon: (
      <Icon>
        <path strokeLinecap="round" d="M12 3a9 9 0 100 18h1.2a2.3 2.3 0 000-4.6H12a2 2 0 010-4h.8" />
        <circle cx="7.5" cy="10" r="1" fill="currentColor" stroke="none" />
        <circle cx="10" cy="7.2" r="1" fill="currentColor" stroke="none" />
      </Icon>
    )
  },
  {
    id: 'shapes',
    label: 'Shapes',
    icon: (
      <Icon>
        <rect x="4" y="4" width="6" height="6" rx="1" />
        <circle cx="17" cy="7" r="3" />
        <path d="M5 15h6v6H5zM14 15l3-0 3 6h-6l0-6z" />
      </Icon>
    )
  },
  {
    id: 'background',
    label: 'Background',
    icon: (
      <Icon>
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <path d="M4 15l4-3 3 2 4-4 5 5" />
      </Icon>
    )
  },
  {
    id: 'logo',
    label: 'Logo',
    icon: (
      <Icon>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
      </Icon>
    )
  }
];

const stylePresets = [
  {
    name: 'Classic',
    config: {
      dotStyle: 'square',
      cornerStyle: 'square',
      backgroundPattern: 'solid',
      foregroundColor: '#000000',
      backgroundColor: '#ffffff',
      gradientEndColor: '#bfdbfe'
    }
  },
  {
    name: 'Modern',
    config: {
      dotStyle: 'rounded',
      cornerStyle: 'rounded',
      backgroundPattern: 'solid',
      foregroundColor: '#2563eb',
      backgroundColor: '#f8fafc',
      gradientEndColor: '#bfdbfe'
    }
  },
  {
    name: 'Playful',
    config: {
      dotStyle: 'circle',
      cornerStyle: 'circle',
      backgroundPattern: 'gradient',
      foregroundColor: '#ec4899',
      backgroundColor: '#fdf2f8',
      gradientEndColor: '#ddd6fe',
      gradientDirection: 'diagonal'
    }
  },
  {
    name: 'Professional',
    config: {
      dotStyle: 'square',
      cornerStyle: 'rounded',
      backgroundPattern: 'solid',
      foregroundColor: '#374151',
      backgroundColor: '#f9fafb',
      gradientEndColor: '#bfdbfe'
    }
  }
];

const dotStyles = [
  { value: 'square', label: 'Square' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'circle', label: 'Circle' },
  { value: 'diamond', label: 'Diamond' }
];

const cornerStyles = [
  { value: 'square', label: 'Square' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'circle', label: 'Circle' }
];

const backgroundPatterns = [
  { value: 'solid', label: 'Solid' },
  { value: 'gradient', label: 'Gradient' },
  { value: 'dots', label: 'Dots' }
];

const gradientDirections = [
  { value: 'horizontal', label: 'Horizontal' },
  { value: 'vertical', label: 'Vertical' },
  { value: 'diagonal', label: 'Diagonal' }
];

const correctionLevels = [
  { value: 'L', label: 'Low', hint: 'smallest code' },
  { value: 'M', label: 'Medium', hint: 'default' },
  { value: 'Q', label: 'Quartile', hint: 'more damage tolerance' },
  { value: 'H', label: 'High', hint: 'best with a logo' }
];

const choiceClass = (active) =>
  `p-3 border rounded-lg text-center transition-colors ${
    active ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 hover:border-gray-400'
  }`;

const StyleOptions = ({ qrConfig, onStyleChange, onLogoChange, onLogoSizeChange }) => {
  const [activeTab, setActiveTab] = useState('presets');
  const logoLocked = Boolean(qrConfig.logo?.url);

  const applyPreset = (preset) => {
    Object.entries(preset.config).forEach(([key, value]) => {
      onStyleChange(key, value);
    });
  };

  const swatchConfig = (overrides) => ({
    ...qrConfig,
    ...overrides,
    logo: null
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case 'colors':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ColorField
                id="fg"
                label="Foreground Color"
                value={qrConfig.foregroundColor || '#000000'}
                onChange={(value) => onStyleChange('foregroundColor', value)}
              />
              <ColorField
                id="bg"
                label="Background Color"
                value={qrConfig.backgroundColor || '#ffffff'}
                onChange={(value) => onStyleChange('backgroundColor', value)}
              />
            </div>
            {qrConfig.backgroundPattern === 'gradient' && (
              <ColorField
                id="gradient-end"
                label="Gradient End Color"
                value={qrConfig.gradientEndColor || '#bfdbfe'}
                onChange={(value) => onStyleChange('gradientEndColor', value)}
              />
            )}
          </div>
        );

      case 'shapes':
        return (
          <div className="space-y-6">
            <div>
              <p className="block text-sm font-medium text-gray-700 mb-3">Dot Style</p>
              <div className="grid grid-cols-2 gap-2">
                {dotStyles.map((style) => (
                  <button
                    key={style.value}
                    type="button"
                    onClick={() => onStyleChange('dotStyle', style.value)}
                    className={choiceClass(qrConfig.dotStyle === style.value)}
                  >
                    <MiniQR
                      size={56}
                      className="mx-auto mb-2 border border-gray-200"
                      config={swatchConfig({ dotStyle: style.value, backgroundPattern: 'solid' })}
                    />
                    <div className="text-xs">{style.label}</div>
                  </button>
                ))}
              </div>
              {(qrConfig.dotStyle === 'circle' || qrConfig.dotStyle === 'diamond') && (
                <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                  <p>
                    <span className="font-medium">Heads up:</span> the{' '}
                    {qrConfig.dotStyle === 'circle' ? 'Circle' : 'Diamond'} dot style can be harder for some
                    scanners to read. For the most reliable codes, use Square or Rounded, and test before sharing.
                  </p>
                </div>
              )}
            </div>

            <div>
              <p className="block text-sm font-medium text-gray-700 mb-3">Corner Style</p>
              <div className="grid grid-cols-3 gap-2">
                {cornerStyles.map((style) => (
                  <button
                    key={style.value}
                    type="button"
                    onClick={() => onStyleChange('cornerStyle', style.value)}
                    className={choiceClass(qrConfig.cornerStyle === style.value)}
                  >
                    <MiniQR
                      size={48}
                      className="mx-auto mb-2 border border-gray-200"
                      config={swatchConfig({ cornerStyle: style.value, backgroundPattern: 'solid' })}
                    />
                    <div className="text-xs">{style.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'background':
        return (
          <div className="space-y-6">
            <div>
              <p className="block text-sm font-medium text-gray-700 mb-3">Background Pattern</p>
              <div className="grid grid-cols-3 gap-2">
                {backgroundPatterns.map((pattern) => (
                  <button
                    key={pattern.value}
                    type="button"
                    onClick={() => onStyleChange('backgroundPattern', pattern.value)}
                    className={choiceClass(qrConfig.backgroundPattern === pattern.value)}
                  >
                    <MiniQR
                      size={48}
                      className="mx-auto mb-2 border border-gray-200"
                      config={swatchConfig({ backgroundPattern: pattern.value })}
                    />
                    <div className="text-xs">{pattern.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {qrConfig.backgroundPattern === 'gradient' && (
              <div>
                <p className="block text-sm font-medium text-gray-700 mb-3">Gradient Direction</p>
                <div className="grid grid-cols-3 gap-2">
                  {gradientDirections.map((direction) => (
                    <button
                      key={direction.value}
                      type="button"
                      onClick={() => onStyleChange('gradientDirection', direction.value)}
                      className={choiceClass(qrConfig.gradientDirection === direction.value)}
                    >
                      <div className="text-sm font-medium">{direction.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'presets':
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Start from a look, then adjust color and shape.</p>
            <div className="grid grid-cols-2 gap-3">
              {stylePresets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="p-3 border border-gray-300 rounded-lg hover:border-blue-400 transition-colors text-left"
                >
                  <MiniQR
                    size={84}
                    className="border border-gray-200 mb-2"
                    config={{ ...qrConfig, ...preset.config, logo: null }}
                  />
                  <div className="font-medium text-sm">{preset.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {preset.config.dotStyle} · {preset.config.backgroundPattern}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'logo':
        return (
          <LogoUpload
            currentLogo={qrConfig.logo}
            logoSize={qrConfig.logoSize}
            onLogoChange={onLogoChange}
            onLogoSizeChange={onLogoSizeChange}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-700">Style</h3>

      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 sm:flex-1 py-2 px-3 text-sm font-medium rounded-md whitespace-nowrap transition-colors inline-flex items-center justify-center gap-1.5 ${
              activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[200px]">{renderTabContent()}</div>

      <div>
        <label htmlFor="error-correction" className="block text-sm font-medium text-gray-700 mb-2">
          Error correction
        </label>
        <select
          id="error-correction"
          value={logoLocked ? 'H' : qrConfig.errorCorrectionLevel || 'M'}
          disabled={logoLocked}
          onChange={(e) => onStyleChange('errorCorrectionLevel', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
        >
          {correctionLevels.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label} ({level.value}) — {level.hint}
            </option>
          ))}
        </select>
        {logoLocked && (
          <p className="text-xs text-gray-500 mt-1">A logo covers the center, so correction is locked to High.</p>
        )}
      </div>
    </div>
  );
};

export default StyleOptions;
