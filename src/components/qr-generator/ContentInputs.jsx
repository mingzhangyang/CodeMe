import { useState } from 'react';

const parseSocial = (content) => {
  if (content.startsWith('WeChat ID:')) {
    return { platform: 'wechat', username: content.replace(/^WeChat ID:\s*/, '') };
  }

  const rules = [
    [/^https?:\/\/(?:www\.)?instagram\.com\/([^/?#]+)\/?$/i, 'instagram'],
    [/^https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/([^/?#]+)\/?$/i, 'twitter'],
    [/^https?:\/\/(?:www\.)?linkedin\.com\/in\/([^/?#]+)\/?$/i, 'linkedin'],
    [/^https?:\/\/(?:www\.)?tiktok\.com\/@?([^/?#]+)\/?$/i, 'tiktok'],
    [/^https?:\/\/(?:www\.)?youtube\.com\/@([^/?#]+)\/?$/i, 'youtube'],
    [/^https?:\/\/(?:www\.)?github\.com\/([^/?#]+)\/?$/i, 'github'],
    [/^https?:\/\/(?:www\.)?xiaohongshu\.com\/user\/profile\/([^/?#]+)\/?$/i, 'xiaohongshu']
  ];

  for (const [pattern, platform] of rules) {
    const match = content.match(pattern);
    if (match) return { platform, username: match[1] };
  }

  if (content) return { platform: 'custom', customUrl: content };
  return {};
};

const parseVCard = (content) => {
  const data = {};
  let formattedName = '';
  let structuredName = null;
  const lines = content.split(/\r?\n/);

  lines.forEach((line) => {
    const [rawKey, ...rest] = line.split(':');
    const key = (rawKey || '').trim();
    const value = rest.join(':').trim();
    if (!key) return;
    if (key === 'FN') {
      formattedName = value;
    } else if (key === 'N' || key.startsWith('N;')) {
      structuredName = value;
    } else if (!value) {
      return;
    } else if (key.startsWith('ORG')) data.organization = value;
    else if (key.startsWith('TITLE')) data.title = value;
    else if (key.startsWith('TEL')) data.phone = value;
    else if (key.startsWith('EMAIL')) data.email = value;
    else if (key.startsWith('URL')) data.website = value;
    else if (key.startsWith('ADR')) {
      const parts = value.split(';');
      data.address = parts[2] || value;
    }
  });

  if (formattedName) {
    const [firstName, ...lastParts] = formattedName.split(' ');
    data.firstName = firstName || '';
    data.lastName = lastParts.join(' ');
  }

  if (structuredName !== null) {
    const [lastName = '', firstName = ''] = structuredName.split(';');
    data.lastName = lastName;
    data.firstName = firstName;
  }

  return data;
};

const seedToForm = (contentType, seed = '') => {
  if (!seed) return {};
  if (contentType === 'url' || contentType === 'text') return { content: seed };
  if (contentType === 'social') return parseSocial(seed);
  if (contentType === 'vcard') return parseVCard(seed);
  return {};
};

const generateVCard = (data) => {
  const lines = [];
  if (data.firstName || data.lastName) {
    lines.push(`FN:${`${data.firstName || ''} ${data.lastName || ''}`.trim()}`);
    lines.push(`N:${data.lastName || ''};${data.firstName || ''};;;`);
  }
  if (data.organization) lines.push(`ORG:${data.organization}`);
  if (data.title) lines.push(`TITLE:${data.title}`);
  if (data.phone) lines.push(`TEL:${data.phone}`);
  if (data.email) lines.push(`EMAIL:${data.email}`);
  if (data.website) lines.push(`URL:${data.website}`);
  if (data.address) lines.push(`ADR:;;${data.address};;;;`);
  if (lines.length === 0) return '';
  return ['BEGIN:VCARD', 'VERSION:3.0', ...lines, 'END:VCARD'].join('\n');
};

const formatXiaohongshu = (username) => {
  const value = (username || '').trim();
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  return `https://www.xiaohongshu.com/user/profile/${value.replace(/^@/, '')}`;
};

const generateSocialContent = (data) => {
  if (!data.platform) return '';
  if (data.platform === 'custom') return data.customUrl || '';
  if (!data.username) return '';

  const username = data.username.trim().replace(/^@/, '');
  const platforms = {
    instagram: `https://instagram.com/${username}`,
    twitter: `https://x.com/${username}`,
    linkedin: `https://linkedin.com/in/${username}`,
    tiktok: `https://tiktok.com/@${username}`,
    youtube: `https://youtube.com/@${username}`,
    github: `https://github.com/${username}`,
    wechat: `WeChat ID: ${username}`,
    xiaohongshu: formatXiaohongshu(data.username)
  };
  return platforms[data.platform] || '';
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

const fieldClass =
  'w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent';

const ContentInputs = ({ contentType, seed = '', onContentChange }) => {
  const [formData, setFormData] = useState(() => seedToForm(contentType, seed));

  const handleInputChange = (field, value) => {
    const next = { ...formData, [field]: value };
    setFormData(next);
    onContentChange(generateFormattedContent(contentType, next));
  };

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
              className={fieldClass}
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
              className={fieldClass}
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
                className={fieldClass}
                value={formData.platform || ''}
                onChange={(e) => handleInputChange('platform', e.target.value)}
              >
                <option value="">Select platform</option>
                <option value="instagram">Instagram</option>
                <option value="twitter">X (Twitter)</option>
                <option value="linkedin">LinkedIn</option>
                <option value="tiktok">TikTok</option>
                <option value="youtube">YouTube</option>
                <option value="github">GitHub</option>
                <option value="wechat">WeChat</option>
                <option value="xiaohongshu">Xiaohongshu</option>
                <option value="custom">Custom URL</option>
              </select>
            </div>

            {formData.platform && formData.platform !== 'custom' && (
              <div>
                <label htmlFor="ci-username" className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.platform === 'wechat' ? 'WeChat ID' : 'Username or profile ID'}
                </label>
                <input
                  id="ci-username"
                  type="text"
                  className={fieldClass}
                  placeholder={formData.platform === 'xiaohongshu' ? 'profile ID or full URL' : 'username'}
                  value={formData.username || ''}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                />
                {formData.platform === 'wechat' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Encoded as text (“WeChat ID: …”). A scanner shows the ID; it does not open WeChat.
                  </p>
                )}
                {formData.platform === 'xiaohongshu' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Paste a profile URL, or a profile ID. A plain name becomes a profile link and only works if that ID is correct.
                  </p>
                )}
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
                  className={fieldClass}
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
                  className={fieldClass}
                  placeholder="Ada"
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
                  className={fieldClass}
                  placeholder="Lovelace"
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
                className={fieldClass}
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
                className={fieldClass}
                placeholder="Software Developer"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ci-phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  id="ci-phone"
                  type="tel"
                  className={fieldClass}
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
                  className={fieldClass}
                  placeholder="ada@example.com"
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
                className={fieldClass}
                placeholder="https://example.com"
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
                className={fieldClass}
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
      <p className="block text-sm font-medium text-gray-700 mb-2">Content</p>
      {renderInputs()}
    </div>
  );
};

export default ContentInputs;
