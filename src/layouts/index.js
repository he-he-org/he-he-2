import React from 'react'
import Link from "gatsby-link";
import { withLanguage } from '../helpers/i18n';
import routes from '../helpers/routes';
import { LANGUAGES } from '../constants';

export default withLanguage(({ children, language }) => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Link style={{ marginRight: 20 }} to={routes.index({ language })}>Main</Link>
          <Link style={{ marginRight: 20 }} to={routes.blog({ language })}>Blog</Link>
          <Link style={{ marginRight: 20 }} to={routes.vacancies({ language })}>Vacancies</Link>
        </div>
        <div>
          {LANGUAGES.map(({ code, title }) => (
            <Link key={code} style={{ marginLeft: 20 }} to={routes.index({ language: code })}>{title}</Link>
          ))}
        </div>
      </div>
      <hr/>
      <div>
        {children()}
      </div>
    </div>
  );
})
