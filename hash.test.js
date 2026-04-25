const { test } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { hashString } = require('./hash');

test('hashString returns correct HMAC-SHA256 hex', () => {
  const value = 'hello world';
  const salty = 'mysecret';
  const expected = crypto.createHmac('sha256', salty).update(value).digest('hex');
  assert.strictEqual(hashString(value, salty), expected);
});

test('hashString returns 64-char hex string', () => {
  const result = hashString('test', 'salt');
  assert.strictEqual(typeof result, 'string');
  assert.strictEqual(result.length, 64);
  assert.match(result, /^[0-9a-f]+$/);
});

test('different salts produce different hashes', () => {
  const hash1 = hashString('hello', 'salt1');
  const hash2 = hashString('hello', 'salt2');
  assert.notStrictEqual(hash1, hash2);
});

test('same inputs always produce same hash', () => {
  assert.strictEqual(hashString('abc', 'xyz'), hashString('abc', 'xyz'));
});
