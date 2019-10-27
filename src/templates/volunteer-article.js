import React from "react";
import { graphql } from 'gatsby'

import styles from './blog.module.scss';
import { format } from '../helpers/date';
import { withI18n } from '../i18n';
import MarkdownContent from '../components/MarkdownContent';
import Layout from '../components/layouts/default';

export default withI18n((props) => {
  const { data, language, location } = props;
  const post = data.markdownRemark;
  return (
    <Layout location={location}>
      <div className={styles.root}>
        <div className={styles.title}>{post.frontmatter.title}</div>
        <div className={styles.date}>{format(post.frontmatter.date, language, { format: 'LL' })}</div>
        <MarkdownContent html={post.html}/>
      </div>
    </Layout>
  );
});

export const query = graphql`
  query VolunteerArticleQuery($slug: String!) {
    markdownRemark(
      fields: { 
        slug: { eq: $slug }
        collection: { eq: "volunteer-articles" }
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
