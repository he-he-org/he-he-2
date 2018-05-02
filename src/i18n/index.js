import React from 'react';
import { DEFAULT_LANGUAGE_CODE, LANGUAGE_CODES } from '../constants';
import IntlMessageFormat from 'intl-messageformat';
import ruTexts from './ru';
import enTexts from './en';

function translate(language, key, params) {
  let texts = null;
  if (language === 'ru') {
    texts = ruTexts
  } else if (language === 'en') {
    texts = enTexts
  } else {
    throw new Error(`Unknown language: ${language}`)
  }

  let result = texts[key];
  if (result === null || result === 'undefined') {
    throw new Error(`Unknown key: ${key}`)
  }
  return new IntlMessageFormat(result, language).format(params);
}

export const withI18n = (WrappedComponent) => {
  return class extends React.Component {
    render() {
      const { location } = this.props;
      const { pathname } = location;

      let language = DEFAULT_LANGUAGE_CODE;
      const pathnameParts = pathname.split('/').filter((x) => !!x);
      if (pathnameParts.length > 0 && LANGUAGE_CODES.indexOf(pathnameParts[0]) !== -1) {
        language = pathnameParts[0];
      }

      return (
        <WrappedComponent
          {...this.props}
          language={language}
          t={(...args) => translate(language, ...args)}
        />
      )
    }
  }
};

