import React from "react"
import Link from "gatsby-link";
import { withI18n } from '../i18n';
import routes from '../helpers/routes';
import { format } from '../helpers/date';

import styles from './blog.module.scss';
import ItemPreview from '../components/ItemPreview';

export default withI18n((props) => {
  const { data, language, t } = props;
  return (
    <div className={styles.root}>
      {data.allMarkdownRemark && data.allMarkdownRemark.edges.map((edge) => {
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
      })}
    </div>
  );
})



export const query = graphql`
  query BlogQuery($language: String!) {
    allMarkdownRemark(
      filter: {
        fields: {
          collection: {eq: "blog"}
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
