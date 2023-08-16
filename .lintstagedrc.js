module.exports = {
  '*.{js,ts}': ['prettier --write', 'eslint --ext .js,.ts --fix'],
  '*.json': ['prettier --write'],
}
