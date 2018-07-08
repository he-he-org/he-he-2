import React from 'react'
import Link from 'gatsby-link';
import cn from 'classnames';
import { withI18n } from '../i18n';
import routes from '../helpers/routes';
import { DEFAULT_LANGUAGE_CODE, LANGUAGES, LANGUAGE_CODES } from '../constants';

import styles from './index.module.scss';
import './globals.css';

import Logo from './logo.png';
import MediaIcon from '../components/MediaIcon';

import InstagramIcon from '../../assets/icons/instagram.png';
import FacebookIcon from '../../assets/icons/facebook.svg';
import HeHeIcon from '../../assets/icons/he-he.png';

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

  renderLanguageSwitch() {
    const { location, language } = this.props;

    const pathnameParts = location.pathname.split('/').filter((part) => !!part);

    // Remove first part if it's a language
    if (pathnameParts.length > 0 && LANGUAGE_CODES.some((x) => x === pathnameParts[0])) {
      pathnameParts.shift();
    }

    return (
      <div className={styles.languageSwitch}>
        {LANGUAGES.map(({ code, title }) => {

          const parts = pathnameParts.slice(0, 1);
          if (code !== DEFAULT_LANGUAGE_CODE) {
            parts.unshift(code);
          }

          return (
            <Link
              key={code}
              className={cn(code === language && styles.isActive)}
              to={parts.length > 0 ? `/${parts.join('/')}/` : '/'}
            >
              {code.toUpperCase()}
            </Link>
          );
        })}
      </div>
    );
  }

  render() {
    const { children, language, t, location } = this.props;

    return (
      <div className={styles.root}>
        <div className={styles.top}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.logoContainer}>
                <Link to={routes.index({ language })}><img src={Logo} className={styles.logo} /></Link>
              </div>
              {this.renderLanguageSwitch()}
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
          <div className={styles.footer}>
            <MediaIcon image={InstagramIcon} url={'https://www.instagram.com/health2help/'}/>
            <MediaIcon image={FacebookIcon} url={'https://www.facebook.com/healthandhelporg/'}/>
            <MediaIcon image={HeHeIcon} url={'https://he-he.org/'}/>
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
