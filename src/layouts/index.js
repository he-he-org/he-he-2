import React from 'react'
import Link from 'gatsby-link';
import cn from 'classnames';
import { withI18n } from '../i18n';
import routes from '../helpers/routes';
import { DEFAULT_LANGUAGE_CODE, LANGUAGES, PLACES } from '../constants';

import styles from './index.module.scss';
import './globals.css';

import Logo from './logo.png';

const renderMenuItem = (route, title, isActive) => {
  return <Link key={route} className={cn(styles.menuItem, isActive && styles.isActive)} to={route}>{title}</Link>
};

class Index extends React.Component {
  getDataEdges() {
    return this.props.data.allMarkdownRemark ? this.props.data.allMarkdownRemark.edges : [];
  }

  getVolunteerPlaces() {
    return this.getDataEdges().map(({ node }) => node).filter(({ fields }) => fields.collection === 'volunteer-places');
  }

  render() {
    const { children, language, t, location } = this.props;

    return (
      <div className={styles.root}>
        <div className={styles.top}>
          <div className={styles.header}>
            <div className={styles.logoContainer}>
              <Link to={routes.index({ language })}><img src={Logo} className={styles.logo} /></Link>
            </div>
            <div className={styles.menu}>
              <div className={styles.menuSection}>
                {this.getVolunteerPlaces().map(({ frontmatter }) => (
                  renderMenuItem(
                    routes.volunteerPlace({ language, place: frontmatter.name }),
                    language === DEFAULT_LANGUAGE_CODE ? frontmatter.title : frontmatter[`title_${language}`],
                    location.pathname.startsWith(routes.volunteerPlace({ language, place: frontmatter.name }))
                  )
                ))}
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
  };}


export default withI18n(Index)

export const query = graphql`
  query LayoutQuery {
    allMarkdownRemark(
      filter: {
        fields: {
          collection: {ne: "noop"}
        }
      }
      sort: {
        fields: [frontmatter___order,frontmatter___date], order: ASC 
      }
    ) {
      edges {
        node {
          id
          frontmatter {
            name
            title
            title_ru
          }
          fields {
            slug
            collection
          }
        }
      }
    }
  }
`;
