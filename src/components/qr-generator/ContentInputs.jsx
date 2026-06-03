import { useState, useEffect } from 'react';

const ContentInputs = ({ contentType, onContentChange }) => {
  const [formData, setFormData] = useState({});

  // Reset form data when content type changes
  useEffect(() => {
    setFormData({});
    onContentChange('');
  }, [contentType]);

  const handleInputChange = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Generate formatted content based on type
    const formattedContent = generateFormattedContent(contentType, newFormData);
    onContentChange(formattedContent);
  };

  const generateFormattedContent = (type, data) => {
    switch (type) {
      case 'vcard':
        return generateVCard(data);
      case 'social':
        return generateSocialContent(data);
      case 'url':
      case 'text':
      default:
        return data.content || '';
    }
  };

  const generateVCard = (data) => {
    const vcard = [];
    vcard.push('BEGIN:VCARD');
    vcard.push('VERSION:3.0');
    
    if (data.firstName || data.lastName) {
      vcard.push(`FN:${data.firstName || ''} ${data.lastName || ''}`.trim());
      vcard.push(`N:${data.lastName || ''};${data.firstName || ''};;;`);
    }
    
    if (data.organization) {
      vcard.push(`ORG:${data.organization}`);
    }
    
    if (data.title) {
      vcard.push(`TITLE:${data.title}`);
    }
    
    if (data.phone) {
      vcard.push(`TEL:${data.phone}`);
    }
    
    if (data.email) {
      vcard.push(`EMAIL:${data.email}`);
    }
    
    if (data.website) {
      vcard.push(`URL:${data.website}`);
    }
    
    if (data.address) {
      vcard.push(`ADR:;;${data.address};;;;`);
    }
    
    vcard.push('END:VCARD');
    return vcard.join('\n');
  };

  const generateSocialContent = (data) => {
    if (data.platform && data.username) {
      const platforms = {
        instagram: `https://instagram.com/${data.username}`,
        twitter: `https://twitter.com/${data.username}`,
        linkedin: `https://linkedin.com/in/${data.username}`,
        tiktok: `https://tiktok.com/@${data.username}`,
        youtube: `https://youtube.com/@${data.username}`,
        github: `https://github.com/${data.username}`,
        custom: data.customUrl || ''
      };
      return platforms[data.platform] || data.customUrl || '';
    }
    return '';
  };

  // Render different input forms based on content type
  const renderInputs = () => {
    switch (contentType) {
      case 'url':
        return (
          <div>
            <label htmlFor="ci-url" className="block text-sm font-medium text-gray-700 mb-2">
              Website URL
            </label>
            <input
              id="ci-url"
              type="url"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com"
              value={formData.content || ''}
              onChange={(e) => handleInputChange('content', e.target.value)}
            />
          </div>
        );

      case 'text':
        return (
          <div>
            <label htmlFor="ci-text" className="block text-sm font-medium text-gray-700 mb-2">
              Text Message
            </label>
            <textarea
              id="ci-text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              placeholder="Enter your message here..."
              value={formData.content || ''}
              onChange={(e) => handleInputChange('content', e.target.value)}
            />
          </div>
        );

      case 'social':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="ci-platform" className="block text-sm font-medium text-gray-700 mb-2">
                Social Platform
              </label>
              <select
                id="ci-platform"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.platform || ''}
                onChange={(e) => handleInputChange('platform', e.target.value)}
              >
                <option value="">Select platform</option>
                <option value="instagram">Instagram</option>
                <option value="twitter">Twitter</option>
                <option value="linkedin">LinkedIn</option>
                <option value="tiktok">TikTok</option>
                <option value="youtube">YouTube</option>
                <option value="github">GitHub</option>
                <option value="custom">Custom URL</option>
              </select>
            </div>
            
            {formData.platform && formData.platform !== 'custom' && (
              <div>
                <label htmlFor="ci-username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  id="ci-username"
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="username"
                  value={formData.username || ''}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                />
              </div>
            )}
            
            {formData.platform === 'custom' && (
              <div>
                <label htmlFor="ci-custom-url" className="block text-sm font-medium text-gray-700 mb-2">
                  Custom URL
                </label>
                <input
                  id="ci-custom-url"
                  type="url"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://your-profile-url.com"
                  value={formData.customUrl || ''}
                  onChange={(e) => handleInputChange('customUrl', e.target.value)}
                />
              </div>
            )}
          </div>
        );

      case 'vcard':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="ci-first-name" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  id="ci-first-name"
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John"
                  value={formData.firstName || ''}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="ci-last-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  id="ci-last-name"
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Doe"
                  value={formData.lastName || ''}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="ci-organization" className="block text-sm font-medium text-gray-700 mb-2">
                Organization
              </label>
              <input
                id="ci-organization"
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Company Name"
                value={formData.organization || ''}
                onChange={(e) => handleInputChange('organization', e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="ci-title" className="block text-sm font-medium text-gray-700 mb-2">
                Job Title
              </label>
              <input
                id="ci-title"
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Software Developer"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="ci-phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  id="ci-phone"
                  type="tel"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="ci-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="ci-email"
                  type="email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john@example.com"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="ci-website" className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                id="ci-website"
                type="url"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://johndoe.com"
                value={formData.website || ''}
                onChange={(e) => handleInputChange('website', e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="ci-address" className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                id="ci-address"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="2"
                placeholder="123 Main St, City, State 12345"
                value={formData.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Content
      </label>
      {renderInputs()}
    </div>
  );
};

export default ContentInputs;
