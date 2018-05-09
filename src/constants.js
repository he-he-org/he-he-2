// IMPORTANT: this should be a ES5 module, because gatsby-node use it to

const LANGUAGES = [
  { code: 'en', title: 'English' },
  { code: 'ru', title: 'Русский' },
];
const LANGUAGE_CODES = LANGUAGES.map(({ code }) => code);
const DEFAULT_LANGUAGE_CODE = 'en';

module.exports = {
  LANGUAGES,
  LANGUAGE_CODES,
  DEFAULT_LANGUAGE_CODE,
};

