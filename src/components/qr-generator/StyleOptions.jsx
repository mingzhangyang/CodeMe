import { useState } from 'react';
import LogoUpload from './LogoUpload';

const StyleOptions = ({ qrConfig, onStyleChange, onLogoChange, onLogoSizeChange }) => {
  const [activeTab, setActiveTab] = useState('colors');

  const handleStyleUpdate = (property, value) => {
    onStyleChange(property, value);
  };

  const dotStyles = [
    { value: 'square', label: 'Square', icon: '⬛' },
    { value: 'circle', label: 'Circle', icon: '⚫' },
    { value: 'rounded', label: 'Rounded', icon: '🔲' },
    { value: 'diamond', label: 'Diamond', icon: '🔶' }
  ];

  const cornerStyles = [
    { value: 'square', label: 'Square', icon: '⬛' },
    { value: 'circle', label: 'Circle', icon: '⚫' },
    { value: 'rounded', label: 'Rounded', icon: '🔲' }
  ];

  const backgroundPatterns = [
    { value: 'solid', label: 'Solid', icon: '⬜' },
    { value: 'gradient', label: 'Gradient', icon: '🌈' },
    { value: 'dots', label: 'Dots', icon: '⚪' }
  ];

  const gradientDirections = [
    { value: 'horizontal', label: 'Horizontal', icon: '↔️' },
    { value: 'vertical', label: 'Vertical', icon: '↕️' },
    { value: 'diagonal', label: 'Diagonal', icon: '↗️' }
  ];

  const stylePresets = [
    {
      name: 'Classic',
      config: {
        dotStyle: 'square',
        cornerStyle: 'square',
        backgroundPattern: 'solid',
        foregroundColor: '#000000',
        backgroundColor: '#ffffff'
      }
    },
    {
      name: 'Modern',
      config: {
        dotStyle: 'rounded',
        cornerStyle: 'rounded',
        backgroundPattern: 'solid',
        foregroundColor: '#2563eb',
        backgroundColor: '#f8fafc'
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
        gradientEndColor: '#f3e8ff'
      }
    },
    {
      name: 'Professional',
      config: {
        dotStyle: 'square',
        cornerStyle: 'rounded',
        backgroundPattern: 'solid',
        foregroundColor: '#374151',
        backgroundColor: '#f9fafb'
      }
    }
  ];

  const applyPreset = (preset) => {
    Object.entries(preset.config).forEach(([key, value]) => {
      handleStyleUpdate(key, value);
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'colors':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foreground Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={qrConfig.foregroundColor || '#000000'}
                    onChange={(e) => handleStyleUpdate('foregroundColor', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={qrConfig.foregroundColor || '#000000'}
                    onChange={(e) => handleStyleUpdate('foregroundColor', e.target.value)}
                    className="flex-1 min-w-0 p-2 border border-gray-300 rounded text-sm"
                    placeholder="#000000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={qrConfig.backgroundColor || '#ffffff'}
                    onChange={(e) => handleStyleUpdate('backgroundColor', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={qrConfig.backgroundColor || '#ffffff'}
                    onChange={(e) => handleStyleUpdate('backgroundColor', e.target.value)}
                    className="flex-1 min-w-0 p-2 border border-gray-300 rounded text-sm"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            </div>

            {qrConfig.backgroundPattern === 'gradient' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gradient End Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={qrConfig.gradientEndColor || '#000000'}
                    onChange={(e) => handleStyleUpdate('gradientEndColor', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={qrConfig.gradientEndColor || '#000000'}
                    onChange={(e) => handleStyleUpdate('gradientEndColor', e.target.value)}
                    className="flex-1 min-w-0 p-2 border border-gray-300 rounded text-sm"
                    placeholder="#000000"
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 'shapes':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Dot Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {dotStyles.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => handleStyleUpdate('dotStyle', style.value)}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      qrConfig.dotStyle === style.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-lg mb-1">{style.icon}</div>
                    <div className="text-xs">{style.label}</div>
                  </button>
                ))}
              </div>

              {(qrConfig.dotStyle === 'circle' || qrConfig.dotStyle === 'diamond') && (
                <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                  <span aria-hidden="true">⚠️</span>
                  <p>
                    <span className="font-medium">Heads up:</span> the
                    {qrConfig.dotStyle === 'circle' ? ' Circle' : ' Diamond'} dot
                    style can be harder for some scanners to read, especially at
                    larger sizes. For the most reliable codes, use{' '}
                    <span className="font-medium">Square</span> or{' '}
                    <span className="font-medium">Rounded</span> — and always test
                    your QR code before sharing it.
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Corner Style
              </label>
              <div className="grid grid-cols-3 gap-2">
                {cornerStyles.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => handleStyleUpdate('cornerStyle', style.value)}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      qrConfig.cornerStyle === style.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-lg mb-1">{style.icon}</div>
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
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Background Pattern
              </label>
              <div className="grid grid-cols-3 gap-2">
                {backgroundPatterns.map((pattern) => (
                  <button
                    key={pattern.value}
                    onClick={() => handleStyleUpdate('backgroundPattern', pattern.value)}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      qrConfig.backgroundPattern === pattern.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-lg mb-1">{pattern.icon}</div>
                    <div className="text-xs">{pattern.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {qrConfig.backgroundPattern === 'gradient' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Gradient Direction
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {gradientDirections.map((direction) => (
                    <button
                      key={direction.value}
                      onClick={() => handleStyleUpdate('gradientDirection', direction.value)}
                      className={`p-3 border rounded-lg text-center transition-colors ${
                        qrConfig.gradientDirection === direction.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-lg mb-1">{direction.icon}</div>
                      <div className="text-xs">{direction.label}</div>
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
            <p className="text-sm text-gray-600">
              Quick style presets to get you started
            </p>
            <div className="grid grid-cols-2 gap-3">
              {stylePresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="p-4 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors text-left"
                >
                  <div className="font-medium text-sm">{preset.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {preset.config.dotStyle} • {preset.config.backgroundPattern}
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
      <h3 className="text-lg font-medium text-gray-700">Advanced Styling</h3>
      
      {/* Tab Navigation - horizontally scrollable on small screens */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto no-scrollbar">
        {[
          { id: 'colors', label: 'Colors', icon: '🎨' },
          { id: 'shapes', label: 'Shapes', icon: '🔷' },
          { id: 'background', label: 'Background', icon: '🖼️' },
          { id: 'logo', label: 'Logo', icon: '🖼️' },
          { id: 'presets', label: 'Presets', icon: '⭐' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 sm:flex-1 py-2 px-3 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[200px]">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default StyleOptions;
