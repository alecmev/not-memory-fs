// eslint-disable-next-line import/no-extraneous-dependencies
const airbnbStyle = require('eslint-config-airbnb-base/rules/style');

module.exports = {
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  rules: {
    'no-restricted-syntax': airbnbStyle.rules['no-restricted-syntax'].filter(
      x => x.selector !== 'ForOfStatement'
    )
  }
};
