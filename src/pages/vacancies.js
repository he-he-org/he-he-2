import React from "react"
import Link from "gatsby-link";
import { withI18n } from '../i18n';
import routes from '../helpers/routes';

import styles from './vacancies.module.scss';
import { format } from '../helpers/date';
import ItemPreview from '../components/ItemPreview';


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

  renderItems() {
    const { data, language, t } = this.props;

    const edges = data.allMarkdownRemark ? data.allMarkdownRemark.edges : [];

    if (edges.length === 0) {
      return <div className={styles.noItemsMessage}>{t('pages_vacancies_no_items_yet')}</div>
    }

    return edges.map((edge) => {
      const { node } = edge;
      const { fields, frontmatter } = node;

      return (
        <ItemPreview
          key={node.id}
          title={frontmatter.title}
          url={routes.vacanciesItem({ language, slug: node.fields.slug })}
          image={fields.image_thumbnail}
        >
          <div className={styles.itemPlace}>{this.renderPlace(frontmatter.place)}</div>
          <div className={styles.itemShortDescription}>{frontmatter.short_description}</div>
        </ItemPreview>
      )
    });
  }

  render() {
    return (
      <div>
        {this.renderItems()}
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
          is_hidden: {ne: true}
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
            short_description
          }
          fields {
            slug
            image_thumbnail
          }
        }
      }
    }
  }
`;
