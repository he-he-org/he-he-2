import React from 'react'
import Link from "gatsby-link";
import { withI18n } from '../i18n';
import routes from '../helpers/routes';
import { LANGUAGES } from '../constants';

export default withI18n(({ children, language, t }) => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Link style={{ marginRight: 20 }} to={routes.index({ language })}>{t('layouts_index_menu_main')}</Link>
          <Link style={{ marginRight: 20 }} to={routes.blog({ language })}>{t('layouts_index_menu_blog')}</Link>
          <Link style={{ marginRight: 20 }} to={routes.vacancies({ language })}>{t('layouts_index_menu_vacancies')}</Link>
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
