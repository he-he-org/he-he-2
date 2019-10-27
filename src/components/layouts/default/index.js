import React from "react";
import { Link } from "gatsby";
import PropTypes from "prop-types";
import { graphql, StaticQuery } from "gatsby";

import cn from "classnames";
import routes from "../../../helpers/routes.js";
import {
  DEFAULT_LANGUAGE_CODE,
  LANGUAGE_CODES,
  LANGUAGES
} from "../../../constants.js";
import styles from "./index.module.scss";
import "./globals.css";

import Logo from "./logo.png";
import MediaIcon from "../../MediaIcon";

import InstagramIcon from "../../../../assets/icons/instagram.png";
import FacebookIcon from "../../../../assets/icons/facebook.svg";
import HeHeIcon from "../../../../assets/icons/he-he.png";
import VkIcon from "../../../../assets/icons/vk.svg";
import { withI18n } from "../../../i18n";

const renderMenuItem = (route, title, isActive) => {
  return (
    <Link
      key={route}
      className={cn(styles.menuItem, isActive && styles.isActive)}
      to={route}
    >
      {title}
    </Link>
  );
};

class DefaultLayout extends React.Component {
  getDataEdges(data) {
    return data.allMarkdownRemark ? data.allMarkdownRemark.edges : [];
  }

  getVolunteerPlaces(data) {
    return this.getDataEdges(data)
      .map(({ node }) => node)
      .filter(({ fields }) => fields.collection === "volunteer-places");
  }

  renderLanguageSwitch() {
    console.log("this", this);
    const { location, language } = this.props;

    const pathnameParts = location.pathname.split("/").filter(part => !!part);

    // Remove first part if it's a language
    if (
      pathnameParts.length > 0 &&
      LANGUAGE_CODES.some(x => x === pathnameParts[0])
    ) {
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
              to={parts.length > 0 ? `/${parts.join("/")}/` : "/"}
            >
              {code.toUpperCase()}
            </Link>
          );
        })}
      </div>
    );
  }

  renderContent(data) {
    const { children, language, t, location } = this.props;

    return (
      <div className={styles.root}>
        <div className={styles.top}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.logoContainer}>
                <Link to={routes.index({ language })}>
                  <img src={Logo} className={styles.logo} />
                </Link>
              </div>
              {this.renderLanguageSwitch()}
            </div>
            <div className={styles.menu}>
              <div className={styles.menuSection}>
                {this.getVolunteerPlaces(data).map(({ frontmatter }) =>
                  renderMenuItem(
                    routes.volunteerPlace({
                      language,
                      place: frontmatter.name
                    }),
                    language === DEFAULT_LANGUAGE_CODE
                      ? frontmatter.title
                      : frontmatter[`title_${language}`],
                    location.pathname.startsWith(
                      routes.volunteerPlace({
                        language,
                        place: frontmatter.name
                      })
                    )
                  )
                )}
                {renderMenuItem(
                  routes.vacancies({ language }),
                  t("layouts_index_menu_vacancies"),
                  location.pathname.startsWith(routes.vacancies({ language }))
                )}
                {renderMenuItem(
                  routes.blog({ language }),
                  t("layouts_index_menu_blog"),
                  location.pathname.startsWith(routes.blog({ language }))
                )}
              </div>
            </div>
          </div>
          <div className={styles.body}>{children}</div>
          <div className={styles.footer}>
            <MediaIcon
              image={InstagramIcon}
              url={"https://www.instagram.com/health2help/"}
            />
            <MediaIcon
              image={FacebookIcon}
              url={"https://www.facebook.com/healthandhelporg/"}
            />
            <MediaIcon image={VkIcon} url={"https://vk.com/hehe_volunteers"} />
            <MediaIcon image={HeHeIcon} url={"https://he-he.org/"} />
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <StaticQuery query={query} render={data => this.renderContent(data)} />
    );
  }
}

let component = withI18n(DefaultLayout);
component.propTypes = {
  location: PropTypes.object
};
export default component;

export const query = graphql`
  query LayoutQuery {
    allMarkdownRemark(
      filter: { fields: { collection: { ne: "noop" } } }
      sort: { fields: [frontmatter___order, frontmatter___date], order: ASC }
    ) {
      edges {
        node {
          id
          frontmatter {
            name
            title
            title_ru
            title_es
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
