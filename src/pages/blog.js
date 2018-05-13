import React from "react"
import Link from "gatsby-link";
import { withI18n } from '../i18n';
import routes from '../helpers/routes';
import { format } from '../helpers/date';

import styles from './blog.module.scss';
import ItemPreview from '../components/ItemPreview';

class Blog extends React.Component {
  renderItems() {
    const { data, language, t } = this.props;

    const edges = data.allMarkdownRemark ? data.allMarkdownRemark.edges : [];

    if (edges.length === 0) {
      return <div className={styles.noItemsMessage}>{t('pages_blog_no_posts_yet')}</div>
    }

    return edges.map((edge) => {
      const { node } = edge;
      const { fields, frontmatter } = node;
      return (
        <ItemPreview
          key={node.id}
          title={frontmatter.title}
          url={routes.blogPost({ language, slug: node.fields.slug })}
          image={fields.image_thumbnail}
        >
          <div className={styles.itemDate}>{format(frontmatter.date, language)}</div>
          <div className={styles.itemShortDescription}>{frontmatter.shortDescription}</div>
        </ItemPreview>
      );
    });
  }

  render() {
    return (
      <div className={styles.root}>
        {this.renderItems()}
      </div>
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
      sort: {
        fields: [frontmatter___date], order: DESC 
      }
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            date
            shortDescription
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
