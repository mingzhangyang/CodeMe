export const SAMPLES = [
  {
    id: 'link',
    title: 'Website',
    blurb: 'Rounded blue link',
    contentType: 'url',
    content: 'https://codeme.orangely.xyz',
    style: {
      dotStyle: 'rounded',
      cornerStyle: 'rounded',
      backgroundPattern: 'solid',
      foregroundColor: '#1d4ed8',
      backgroundColor: '#ffffff',
      gradientDirection: 'diagonal',
      gradientEndColor: '#bfdbfe',
      errorCorrectionLevel: 'M'
    },
    logo: null
  },
  {
    id: 'social',
    title: 'Social',
    blurb: 'Profile on a soft gradient',
    contentType: 'social',
    content: 'https://instagram.com/codeme',
    style: {
      dotStyle: 'rounded',
      cornerStyle: 'rounded',
      backgroundPattern: 'gradient',
      foregroundColor: '#be185d',
      backgroundColor: '#fdf2f8',
      gradientDirection: 'diagonal',
      gradientEndColor: '#fbcfe8',
      errorCorrectionLevel: 'M'
    },
    logo: null
  },
  {
    id: 'vcard',
    title: 'Contact',
    blurb: 'A card you can save',
    contentType: 'vcard',
    content: [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'FN:Ada Lovelace',
      'N:Lovelace;Ada;;;',
      'ORG:CodeMe',
      'TITLE:Creator',
      'TEL:+1-202-555-0143',
      'EMAIL:ada@codeme.orangely.xyz',
      'URL:https://codeme.orangely.xyz',
      'END:VCARD'
    ].join('\n'),
    style: {
      dotStyle: 'square',
      cornerStyle: 'rounded',
      backgroundPattern: 'solid',
      foregroundColor: '#111827',
      backgroundColor: '#f9fafb',
      gradientDirection: 'diagonal',
      gradientEndColor: '#bfdbfe',
      errorCorrectionLevel: 'Q'
    },
    logo: null,
    cardEnabled: true,
    cardName: 'Ada Lovelace',
    cardSubtitle: 'Creator · CodeMe'
  },
  {
    id: 'logo',
    title: 'With logo',
    blurb: 'Mark in the center',
    contentType: 'url',
    content: 'https://codeme.orangely.xyz',
    style: {
      dotStyle: 'rounded',
      cornerStyle: 'rounded',
      backgroundPattern: 'solid',
      foregroundColor: '#0f172a',
      backgroundColor: '#ffffff',
      gradientDirection: 'diagonal',
      gradientEndColor: '#bfdbfe',
      errorCorrectionLevel: 'H'
    },
    logo: { url: '/logo.svg', name: 'CodeMe', width: 64, height: 64 }
  }
];

export const getSample = (id) => SAMPLES.find((sample) => sample.id === id) || null;

export const configFromSample = (sample) => ({
  content: sample.content,
  contentType: sample.contentType,
  ...sample.style,
  logo: sample.logo || null,
  logoSize: sample.logo ? 0.22 : 0.2,
  cardEnabled: Boolean(sample.cardEnabled),
  cardName: sample.cardName || '',
  cardSubtitle: sample.cardSubtitle || ''
});
