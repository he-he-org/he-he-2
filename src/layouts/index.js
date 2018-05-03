import React from 'react'
import Link from 'gatsby-link';
import cn from 'classnames';
import { withI18n } from '../i18n';
import routes from '../helpers/routes';
import { LANGUAGES } from '../constants';

import styles from './index.module.scss';
import './globals.css';

import Logo from './logo.png';

const renderMenuItem = (route, title, isActive) => {
  return <Link key={route} className={cn(styles.menuItem, isActive && styles.isActive)} to={route}>{title}</Link>
};

export default withI18n(({ children, language, t, location }) => {
  return (
    <div>
      <div className={styles.logoContainer}>
        <Link to={routes.index({ language })}><img src={Logo} className={styles.logo} /></Link>
      </div>
      <div className={styles.menu}>
        <div>
          {renderMenuItem(routes.blog({ language }), t('layouts_index_menu_blog'), location.pathname.startsWith(routes.blog({ language })))}
          {renderMenuItem(routes.vacancies({ language }), t('layouts_index_menu_vacancies'), location.pathname.startsWith(routes.vacancies({ language })))}
        </div>
        <div>
          {LANGUAGES.map(({ code, title }) => (
            renderMenuItem(routes.index({ language: code }), title, code === language && styles.isActive )
          ))}
        </div>
      </div>
      <div className={styles.body}>
        {children()}
      </div>
    </div>
  );
})
