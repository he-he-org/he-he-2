import { DEFAULT_LANGUAGE_CODE } from '../constants';

function r(route) {
  return (params) => {
    let result = '/';
    if (params.language && params.language !== DEFAULT_LANGUAGE_CODE) {
      result += `${params.language}/`;
    }
    route
      .split('/')
      .filter((part) => !!part)
      .map((part) => {
        if (part.startsWith(':')) {
          const paramName = part.substr(1);
          if (params[paramName]) {
            return encodeURIComponent(params[paramName]); // todo: this is not right escaping
          }
          throw new Error(`Missing param: ${paramName}`)
        }
        return part;
      })
      .filter((part) => !!part)
      .forEach((part) => (
        result += `${part}/`
      ));
    return result;
  }
}

export default {
  index: r('/'),
  blog: r('/blog/'),
  blogPost: r('/blog/:slug/'),
  vacancies: r('/vacancies/'),
  vacanciesItem: r('/vacancies/:slug'),
}
