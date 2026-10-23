import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSocial, seedToForm, generateFormattedContent, generateVCard, parseVCard } from '../src/utils/contentCodec.js';
import { SAMPLES, configFromSample } from '../src/data/samples.js';

test('plain text and URL preserve exact content', () => {
  const value = '  https://example.com/a;b?items=1,2%25  ';
  for (const type of ['text', 'url']) {
    assert.equal(seedToForm(type, value).content, value);
    assert.equal(generateFormattedContent(type, { content: value }), value);
  }
});

test('social URLs preserve malformed and valid percent sequences', () => {
  for (const link of [
    'https://instagram.com/alice%', 'https://instagram.com/alice%25',
    'https://x.com/user%2Fname', 'https://github.com/name%40example',
    'https://tiktok.com/@alice', 'https://youtube.com/@alice'
  ]) {
    const restored = seedToForm('social', link);
    assert.notEqual(restored.platform, 'custom');
    assert.equal(generateFormattedContent('social', restored), link);
  }
  const unrelated = 'https://netflix.com/account';
  assert.deepEqual(parseSocial(unrelated), { platform: 'custom', customUrl: unrelated });
});

test('WeChat ID and Xiaohongshu profile URLs preserve data', () => {
  for (const original of [
    'WeChat ID: alice_123',
    'https://www.xiaohongshu.com/user/profile/abc123'
  ]) {
    assert.equal(generateFormattedContent('social', seedToForm('social', original)), original);
  }
});

test('vCard whitespace, special address, and URI survive restore then unrelated edit', () => {
  const original = {
    firstName: 'Ada', lastName: 'Lovelace',
    organization: ' Research Lab  ', title: ' Engineer ',
    phone: '+1-202-555-0143',
    address: 'Suite 2; Floor, East Wing \\north\nUpstairs  ',
    website: 'https://example.com/a;b?items=1,2&path=C:\\notes'
  };
  const encoded = generateVCard(original);
  const restored = seedToForm('vcard', encoded);
  for (const key of ['organization', 'title', 'address', 'website']) {
    assert.equal(restored[key], original[key], key);
  }
  assert.equal(generateVCard(restored), encoded);
  assert.equal(generateVCard({ ...restored, phone: '555-2222' }),
    generateVCard({ ...original, phone: '555-2222' }));
});

test('vCard structured names preserve blank given or family name', () => {
  for (const person of [
    { firstName: '', lastName: 'Lovelace' },
    { firstName: 'Mary Jane', lastName: '' },
    { firstName: 'Ada', lastName: 'Lovelace' }
  ]) {
    const encoded = generateVCard(person);
    const parsed = parseVCard(encoded);
    assert.equal(parsed.firstName, person.firstName);
    assert.equal(parsed.lastName, person.lastName);
    assert.equal(generateVCard(parsed), encoded);
  }
});

test('homepage sample definitions carry actual editable payloads', () => {
  assert.equal(SAMPLES.length, 4);
  for (const sample of SAMPLES) {
    const config = configFromSample(sample);
    assert.ok(sample.content.trim());
    assert.equal(config.content, sample.content);
    assert.equal(config.contentType, sample.contentType);
  }
});
