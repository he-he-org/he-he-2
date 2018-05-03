import React from "react";

import styles from './blog.module.scss';

export default ({ data }) => {
  const post = data.markdownRemark;
  return (
    <div className={styles.root}>
      <div className={styles.title}>{post.frontmatter.title}</div>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </div>
  );
};

export const query = graphql`
  query BlogPostQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
    }
  }
`;
