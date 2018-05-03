import React from "react"
import Link from "gatsby-link";
import { withI18n } from '../i18n';
import routes from '../helpers/routes';

import styles from './vacancies.module.scss';
import { format } from '../helpers/date';


class Vacancies extends React.Component {
  renderPlace(key) {
    const { t } = this.props;

    switch (key) {
      case 'guatemala': return t('pages_vacancies_group_title_guatemala');
      case 'nicaragua': return t('pages_vacancies_group_title_nicaragua');
      case 'online': return t('pages_vacancies_group_title_online');
      default:
        return key;
    }
  }

  // renderGroup(key, nodes) {
  //   const { language } = this.props;
  //   return (
  //     <div key={key}>
  //       <div className={styles.groupTitle}>{this.renderPlace(key)}</div>
  //       <div>
  //         {nodes.map((node) => {
  //           const { frontmatter } = node;
  //
  //           return (
  //             <Link
  //               key={node.id}
  //               className={styles.item}
  //               to={routes.vacanciesItem({ language, slug: node.fields.slug })}
  //             >
  //               <div className={styles.itemTitle}>{frontmatter.title}</div>
  //               <div className={styles.itemPlace}>{this.renderPlace(key)}</div>
  //             </Link>
  //           );
  //         })}
  //       </div>
  //     </div>
  //   )
  // };

  render() {
    const { data, language } = this.props;

    const groups = {};

    if (data.allMarkdownRemark) {
      data.allMarkdownRemark.edges.forEach((edge) => {
        const { node } = edge;
        const { frontmatter } = node;

        const { place } = frontmatter;

        if (!groups[place]) {
          groups[place] = [];
        }

        groups[place].push(node);
      })
    }

    return (
      <div>
        {data.allMarkdownRemark && data.allMarkdownRemark.edges.map((edge) => {
          const { node } = edge;
          const { frontmatter } = node;
          return (
            <Link
              key={node.id}
              className={styles.item}
              to={routes.vacanciesItem({ language, slug: node.fields.slug })}
            >
              <div className={styles.itemTitle}>{frontmatter.title}</div>
              <div className={styles.itemPlace}>{this.renderPlace(frontmatter.place)}</div>
            </Link>
          );
        })}
      </div>
    )
  }
}

export default withI18n(Vacancies)


export const query = graphql`
  query VacanciesQuery($language: String!) {
    allMarkdownRemark(
      filter: {
        fields: {
          collection: {eq: "vacancies"},
        }
        frontmatter: {
          language: {eq: $language}
        }
      }
      sort: {
        fields: [frontmatter___date], order: DESC 
      }
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            place
          }
          fields {
            slug
          }
        }
      }
    }
  }
`;
