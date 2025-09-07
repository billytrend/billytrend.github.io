/** @type {import('prettier').Config} */
module.exports = {
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  tabWidth: 2,
  overrides: [
    { files: '*.md', options: { proseWrap: 'always' } },
    { files: '*.yml', options: { singleQuote: false } },
  ],
};
