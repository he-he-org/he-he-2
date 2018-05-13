import React from "react";

import styles from './blog.module.scss';
import { format } from '../helpers/date';
import { withI18n } from '../i18n';
import MarkdownContent from '../components/MarkdownContent';

export default withI18n(({ data, language }) => {
  const post = data.markdownRemark;
  return (
    <div className={styles.root}>
      <div className={styles.title}>{post.frontmatter.title}</div>
      <div className={styles.date}>{format(post.frontmatter.date, language, { format: 'LL' })}</div>
      <MarkdownContent html={post.html}/>
    </div>
  );
});

export const query = graphql`
  query BlogPostQuery($slug: String!) {
    markdownRemark(
      fields: { 
        slug: { eq: $slug }
        collection: { eq: "blog" } 
      }
      frontmatter: {
        is_hidden: { ne: true }
      }      
    ) {
      html
      frontmatter {
        date
        title
      }
    }
  }
`;
