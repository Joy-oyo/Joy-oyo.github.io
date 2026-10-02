const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const filename = path.resolve(__dirname, '../src/lib/contact.ts');
const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const contact = { exports: {} };
vm.runInNewContext(compiled, { module: contact, exports: contact.exports, URL }, { filename });
const { contactMailto, validateContact } = contact.exports;
const valid = {
  name: 'Test Visitor', about: 'Product designer at Example', email: 'visitor@example.com',
  linkedin: '', message: 'I would like to discuss a design collaboration.',
};

test('opens a draft addressed to Joy with every questionnaire answer', () => {
  const fields = { ...valid, linkedin: 'https://www.linkedin.com/in/test-visitor' };
  const draft = new URL(contactMailto(fields));
  assert.equal(draft.protocol, 'mailto:');
  assert.equal(draft.pathname, 'joychen0709@gmail.com');
  assert.ok(draft.searchParams.get('subject').includes(fields.name));
  for (const value of Object.values(fields)) assert.ok(draft.searchParams.get('body').includes(value));
});

test('encodes Unicode and reserved characters without introducing mail headers', () => {
  const message = '你好 Joy! R&D + design? #ideas\n&bcc=someone@example.com';
  const draft = new URL(contactMailto({ ...valid, name: 'Zoë & 李', message }));
  assert.equal(draft.searchParams.size, 2);
  assert.equal(draft.searchParams.has('bcc'), false);
  assert.ok(draft.searchParams.get('body').includes(message));
  assert.equal(draft.searchParams.get('subject'), 'Let’s connect — Zoë & 李');
});

test('LinkedIn is optional and whitespace is trimmed', () => {
  const result = validateContact({ ...valid, name: '  Test Visitor  ' });
  assert.equal(Object.keys(result.errors).length, 0);
  assert.equal(result.fields.name, 'Test Visitor');
  assert.match(new URL(contactMailto(result.fields)).searchParams.get('body'), /LinkedIn: Not provided/);
});

test('requires answers and rejects invalid addresses, URLs, and oversized fields', () => {
  for (const input of [null, {}, { ...valid, about: ' ' }, { ...valid, message: '' }, { ...valid, name: 'Name\r\nBcc: other@example.com' }, { ...valid, email: 'a@@example.com' }, { ...valid, linkedin: 'https://linkedin.com.evil.example/in/a' }, { ...valid, linkedin: 'javascript:alert(1)' }, { ...valid, message: 'x'.repeat(5001) }]) {
    assert.ok(Object.keys(validateContact(input).errors).length > 0);
  }
});
