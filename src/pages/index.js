import React from 'react'
import { graphql } from 'gatsby'

import MarkdownContent from '../components/MarkdownContent';

import styles from './index.module.scss';
import Layout from '../components/layouts/default';

export default ({ location, data }) => {
  const post = data.markdownRemark;

  return (
    <Layout location={location}>
      <div className={styles.styles}>
        <MarkdownContent html={post.html}/>
      </div>
    </Layout>
  );
}

export const query = graphql`
  query IndexPostQuery($language: String!) {
    markdownRemark(
      fields: { 
        collection: { eq: "pages" }
      }
      frontmatter: {
        name: { eq: "index" }
        language: { eq: $language } 
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
