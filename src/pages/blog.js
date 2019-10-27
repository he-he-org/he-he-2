import React from "react"
import { Link } from "gatsby";
import { graphql } from 'gatsby'
import { withI18n } from '../i18n';
import routes from '../helpers/routes';
import { format } from '../helpers/date';

import Layout from '../components/layouts/default'
import styles from './blog.module.scss';
import ItemPreview from '../components/ItemPreview';

class Blog extends React.Component {
  renderItems() {
    const { data, language, t } = this.props;

    const edges = data.allMarkdownRemark ? data.allMarkdownRemark.edges : [];

    if (edges.length === 0) {
      return <div className={styles.noItemsMessage}>{t('pages_blog_no_posts_yet')}</div>
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
          url={routes.blogPost({ language, slug: node.fields.slug })}
          image={fields.image_thumbnail}
        >
          <div className={styles.itemDate}>
            {frontmatter.is_pinned
              ? t('blog_post_is_pinned')
              : format(frontmatter.date, language)}
          </div>
          <div className={styles.itemShortDescription}>
            {frontmatter.short_description}
          </div>
        </ItemPreview>
      );
    });
  }

  render() {
    return (
      <Layout location={this.props.location}>
        <div className={styles.root}>
          {this.renderItems()}
        </div>
      </Layout>
    );
  }
}

export default withI18n(Blog)

export const query = graphql`
  query BlogQuery($language: String!) {
    allMarkdownRemark(
      filter: {
        fields: {
          collection: {eq: "blog"}
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
            date
            short_description
            is_pinned
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
