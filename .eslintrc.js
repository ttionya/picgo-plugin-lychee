module.exports = {
  extends: ['@ttionya/eslint-config/typescript'],

  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
}
