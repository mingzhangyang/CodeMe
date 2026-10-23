import test from 'node:test';
import assert from 'node:assert/strict';
import { serializeConfig, designSignature, configMatchesItem } from '../src/utils/historySerialization.js';

const config = (logo) => ({
  content: 'https://example.com/a;b?items=1,2', contentType: 'url',
  size: 256, foregroundColor: '#000000', backgroundColor: '#ffffff',
  errorCorrectionLevel: 'H', dotStyle: 'rounded', cornerStyle: 'square',
  backgroundPattern: 'solid', gradientDirection: 'diagonal',
  gradientEndColor: '#bfdbfe', logo, logoSize: 0.2,
  cardEnabled: true, cardName: 'A, B', cardSubtitle: 'QR; Code'
});

test('history retains payload, card metadata and all style choices', () => {
  const source = config(null);
  const saved = serializeConfig(source);
  assert.equal(saved.logoOmitted, false);
  for (const key of Object.keys(source)) assert.deepEqual(saved.config[key], source[key], key);
  assert.equal(configMatchesItem(source, {
    signature: designSignature(saved.config), config: saved.config
  }), true);
});

test('same-prefix, same-size distinct logos never match', () => {
  const prefix = 'data:image/svg+xml;base64,' + 'a'.repeat(120);
  const first = config({ url: prefix + '1', name: 'logo.svg' });
  const second = config({ url: prefix + '2', name: 'logo.svg' });
  const saved = serializeConfig(first).config;
  const item = { signature: designSignature(saved), config: saved };
  assert.equal(designSignature(saved), designSignature(serializeConfig(second).config));
  assert.equal(configMatchesItem(first, item), true);
  assert.equal(configMatchesItem(second, item), false);
});

test('large logos are intentionally omitted and flagged', () => {
  const saved = serializeConfig(config({ url: 'x'.repeat(150001) }));
  assert.equal(saved.logoOmitted, true);
  assert.equal(saved.config.logo, null);
});
