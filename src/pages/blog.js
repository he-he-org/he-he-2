import React from "react"
import Link from "gatsby-link";
import { withI18n } from '../i18n';
import routes from '../helpers/routes';
import { format } from '../helpers/date';

import styles from './blog.module.scss';

export default withI18n((props) => {
  const { data, language, t } = props;
  return (
    <div className={styles.root}>
      {data.allMarkdownRemark && data.allMarkdownRemark.edges.map((edge) => {
        const { node } = edge;
        const { frontmatter } = node;
        return (
          <Link
            key={node.id}
            className={styles.item}
            to={routes.blogPost({ language, slug: node.fields.slug })}
          >
            <div className={styles.itemTitle}>{frontmatter.title}</div>
            <div className={styles.itemShortDescription}>{frontmatter.shortDescription}</div>
            <div className={styles.itemDate}>{format(frontmatter.date)}</div>
          </Link>
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
          }
        }
      }
    }
  }
`;
