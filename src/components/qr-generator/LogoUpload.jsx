import { useState, useRef } from 'react';

const LogoUpload = ({ currentLogo, logoSize, onLogoChange, onLogoSizeChange }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFiles = (files) => {
    const file = files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image file (PNG, JPG, SVG)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB');
      return;
    }

    setUploadError(null);

    // Create file reader to convert to data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result;
      
      // Create image to get dimensions
      const img = new Image();
      img.onload = () => {
        const logoData = {
          url: imageUrl,
          width: img.width,
          height: img.height,
          file: file
        };
        
        onLogoChange(logoData);
        setUploadError(null);
      };
      img.src = imageUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeLogo = () => {
    onLogoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const logoSizeOptions = [
    { value: 0.15, label: 'Small (15%)', description: 'Subtle logo' },
    { value: 0.2, label: 'Medium (20%)', description: 'Balanced size' },
    { value: 0.25, label: 'Large (25%)', description: 'Prominent logo' },
    { value: 0.3, label: 'Extra Large (30%)', description: 'Maximum size' }
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Logo/Avatar Upload
        </label>
        
        {!currentLogo ? (
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <div className="space-y-2">
              <div className="text-3xl">📷</div>
              <div className="text-sm text-gray-600">
                <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
              </div>
              <div className="text-xs text-gray-500">
                PNG, JPG, SVG up to 5MB
              </div>
            </div>
          </div>
        ) : (
          <div className="border border-gray-300 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <img
                  src={currentLogo.url}
                  alt="Logo preview"
                  className="w-16 h-16 object-contain border border-gray-200 rounded"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {currentLogo.file?.name || 'Uploaded logo'}
                </p>
                <p className="text-sm text-gray-500">
                  {currentLogo.width} × {currentLogo.height}px
                </p>
              </div>
              <button
                onClick={removeLogo}
                className="flex-shrink-0 text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        {uploadError && (
          <div className="mt-2 text-sm text-red-600">
            {uploadError}
          </div>
        )}
      </div>

      {currentLogo && (
        <div>
          <label htmlFor="logo-size" className="block text-sm font-medium text-gray-700 mb-2">
            Logo Size
          </label>
          <select
            id="logo-size"
            value={logoSize}
            onChange={(e) => onLogoSizeChange(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {logoSizeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} - {option.description}
              </option>
            ))}
          </select>
        </div>
      )}

      {currentLogo && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start">
            <div className="text-blue-400 mr-2">💡</div>
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Logo Tips:</p>
              <ul className="text-xs space-y-1">
                <li>• Square logos work best for QR codes</li>
                <li>• High contrast logos are more readable</li>
                <li>• Keep logos simple for better scanning</li>
                <li>• Test QR code scanning after adding logo</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoUpload;
