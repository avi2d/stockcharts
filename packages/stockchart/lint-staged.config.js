module.exports = {
  '*.{js,ts,tsx}': ['npx prettier --write', () => 'tsc --skipLibCheck --noEmit', 'npx eslint --fix'],
  '*.json': ['npx prettier --write'],
};
