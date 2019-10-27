import React from "react"
import { graphql } from 'gatsby'
import { Link } from "gatsby";
import { withI18n } from '../i18n';
import routes from '../helpers/routes';

import styles from './vacancies.module.scss';
import { format } from '../helpers/date';
import ItemPreview from '../components/ItemPreview';
import Layout from '../components/layouts/default';


class Vacancies extends React.Component {
  renderPlace(key) {
    const { t } = this.props;

    switch (key) {
      case 'guatemala': return t('pages_vacancies_group_title_guatemala');
      case 'nicaragua': return t('pages_vacancies_group_title_nicaragua');
      case 'guatemala-nicaragua': return t('pages_vacancies_group_title_guatemala_nicaragua');
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

    // Sort items manually, because gatsby doesn't support sorting by multiple fields :(
    const sortedEdges = [...edges];
    sortedEdges.sort((x, y) => {
      const xIsPinned = x.node.frontmatter.is_pinned;
      const yIsPinned = y.node.frontmatter.is_pinned;
      const xDate = new Date(x.node.frontmatter.date);
      const yDate = new Date(y.node.frontmatter.date);
      if (xIsPinned !== yIsPinned) {
        return xIsPinned ? -1 : 1;
      }
      if (xDate !== yDate) {
        return xDate > yDate ? -1 : 1;
      }
      return 0;
    });


    return sortedEdges.map((edge) => {
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
      <Layout location={this.props.location}>
        <div>
          {this.renderItems()}
        </div>
      </Layout>
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
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            place
            short_description
            is_pinned
            date
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
