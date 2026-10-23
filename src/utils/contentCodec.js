export const parseSocial = (content) => {
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

const escapeVCard = (value) =>
  String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\r|\n/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,');

const escapeVCardUri = (value) => String(value || '').replace(/[\r\n]+/g, '');

const unescapeVCard = (value) => {
  let out = '';
  for (let i = 0; i < value.length; i += 1) {
    if (value[i] === '\\' && i + 1 < value.length) {
      const next = value[i + 1];
      if (next === 'n' || next === 'N') out += '\n';
      else if (next === ';') out += ';';
      else if (next === ',') out += ',';
      else if (next === '\\') out += '\\';
      else out += next;
      i += 1;
    } else {
      out += value[i];
    }
  }
  return out;
};

const splitUnescaped = (value, separator) => {
  const parts = [];
  let current = '';
  for (let i = 0; i < value.length; i += 1) {
    if (value[i] === '\\' && i + 1 < value.length) {
      current += value[i] + value[i + 1];
      i += 1;
    } else if (value[i] === separator) {
      parts.push(current);
      current = '';
    } else {
      current += value[i];
    }
  }
  parts.push(current);
  return parts;
};

const unfoldVCard = (content) => {
  const property = /^(?:BEGIN|END|VERSION|FN|N|ORG|TITLE|TEL|EMAIL|URL|ADR)(?:;[^:]*)?:/i;
  const lines = [];
  content.split(/\r?\n/).forEach((line) => {
    const folded = line.startsWith(' ') || line.startsWith('\t');
    if (lines.length && (folded || !property.test(line))) {
      lines[lines.length - 1] += folded ? line.slice(1) : `\n${line}`;
      return;
    }
    lines.push(line);
  });
  return lines;
};

const parseAddress = (value) => {
  const parts = splitUnescaped(value, ';');
  const street = parts.length >= 7 ? parts.slice(2, parts.length - 4).join(';') : parts[2] || '';
  return unescapeVCard(street);
};

export const parseVCard = (content) => {
  const data = {};
  let formattedName = '';
  let structuredName = null;

  unfoldVCard(content).forEach((line) => {
    const [rawKey, ...rest] = line.split(':');
    const key = (rawKey || '').trim();
    // Never trim property values: otherwise restoring then editing a vCard
    // silently modifies user data (including names, organizations and links).
    const value = rest.join(':');
    if (!key) return;
    if (key === 'FN') {
      formattedName = value;
    } else if (key === 'N' || key.startsWith('N;')) {
      structuredName = value;
    } else if (!value) {
      return;
    } else if (key.startsWith('ORG')) data.organization = unescapeVCard(value);
    else if (key.startsWith('TITLE')) data.title = unescapeVCard(value);
    else if (key.startsWith('TEL')) data.phone = unescapeVCard(value);
    else if (key.startsWith('EMAIL')) data.email = unescapeVCard(value);
    else if (key.startsWith('URL')) data.website = value;
    else if (key.startsWith('ADR')) data.address = parseAddress(value);
  });

  if (formattedName) {
    const [firstName, ...lastParts] = unescapeVCard(formattedName).split(' ');
    data.firstName = firstName || '';
    data.lastName = lastParts.join(' ');
  }

  if (structuredName !== null) {
    const [lastName = '', firstName = ''] = splitUnescaped(structuredName, ';');
    data.lastName = unescapeVCard(lastName);
    data.firstName = unescapeVCard(firstName);
  }

  return data;
};

export const seedToForm = (contentType, seed = '') => {
  if (!seed) return {};
  if (contentType === 'url' || contentType === 'text') return { content: seed };
  if (contentType === 'social') return parseSocial(seed);
  if (contentType === 'vcard') return parseVCard(seed);
  return {};
};

export const generateVCard = (data) => {
  const lines = [];
  const text = (value) => escapeVCard(value || '');
  if (data.firstName || data.lastName) {
    const formatted = `${data.firstName || ''} ${data.lastName || ''}`.trim();
    lines.push(`FN:${text(formatted)}`);
    lines.push(`N:${text(data.lastName)};${text(data.firstName)};;;`);
  }
  if (data.organization) lines.push(`ORG:${text(data.organization)}`);
  if (data.title) lines.push(`TITLE:${text(data.title)}`);
  if (data.phone) lines.push(`TEL:${text(data.phone)}`);
  if (data.email) lines.push(`EMAIL:${text(data.email)}`);
  if (data.website) lines.push(`URL:${escapeVCardUri(data.website)}`);
  if (data.address) lines.push(`ADR:;;${text(data.address)};;;;`);
  if (lines.length === 0) return '';
  return ['BEGIN:VCARD', 'VERSION:3.0', ...lines, 'END:VCARD'].join('\n');
};

const normalizeHandle = (value) => (value || '').trim().replace(/^@+/, '');

const formatXiaohongshu = (username) => {
  const value = (username || '').trim();
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  const handle = value.replace(/^@+/, '');
  if (!handle) return '';
  return `https://www.xiaohongshu.com/user/profile/${handle}`;
};

export const generateSocialContent = (data) => {
  if (!data.platform) return '';
  if (data.platform === 'custom') return (data.customUrl || '').trim();
  if (data.platform === 'xiaohongshu') return formatXiaohongshu(data.username);

  const username = normalizeHandle(data.username);
  if (!username) return '';

  const platforms = {
    instagram: `https://instagram.com/${username}`,
    twitter: `https://x.com/${username}`,
    linkedin: `https://linkedin.com/in/${username}`,
    tiktok: `https://tiktok.com/@${username}`,
    youtube: `https://youtube.com/@${username}`,
    github: `https://github.com/${username}`,
    wechat: `WeChat ID: ${username}`
  };
  return platforms[data.platform] || '';
};

export const generateFormattedContent = (type, data) => {
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

