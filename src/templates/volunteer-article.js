import React from "react";

import styles from './blog.module.scss';
import { format } from '../helpers/date';
import { withI18n } from '../i18n';
import MarkdownContent from '../components/MarkdownContent';

export default withI18n((props) => {
  const { data, language } = props;
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
  query VolunteerArticleQuery($slug: String!) {
    markdownRemark(
      fields: { 
        slug: { eq: $slug }
        collection: { eq: "volunteer-articles" }
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
