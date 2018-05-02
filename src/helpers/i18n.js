import React from 'react';
import { DEFAULT_LANGUAGE_CODE, LANGUAGE_CODES } from '../constants';

export const withLanguage = (WrappedComponent) => {
  return class extends React.Component {
    render() {
      const { location } = this.props;
      const { pathname } = location;

      let language = DEFAULT_LANGUAGE_CODE;
      const pathnameParts = pathname.split('/').filter((x) => !!x);
      if (pathnameParts.length > 0 && LANGUAGE_CODES.indexOf(pathnameParts[0]) !== -1) {
        language = pathnameParts[0];
      }

      return <WrappedComponent {...this.props} language={language}  />
    }
  }
};

