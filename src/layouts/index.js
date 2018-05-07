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
    <div className={styles.root}>
      <div className={styles.top}>
        <div className={styles.header}>
          <div className={styles.logoContainer}>
            <Link to={routes.index({ language })}><img src={Logo} className={styles.logo} /></Link>
          </div>
          <div className={styles.menu}>
            <div className={styles.menuSection}>
              {renderMenuItem(routes.volunteer({ language }), t('layouts_index_menu_volunteer'), location.pathname.startsWith(routes.volunteer({ language })))}
              {renderMenuItem(routes.vacancies({ language }), t('layouts_index_menu_vacancies'), location.pathname.startsWith(routes.vacancies({ language })))}
              {renderMenuItem(routes.blog({ language }), t('layouts_index_menu_blog'), location.pathname.startsWith(routes.blog({ language })))}
            </div>
          </div>
        </div>
        <div className={styles.body}>
          {children()}
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.menu}>
          <div className={styles.menuSection}>
            {LANGUAGES.map(({ code, title }) => (
              renderMenuItem(routes.index({ language: code }), title, code === language && styles.isActive )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
})
