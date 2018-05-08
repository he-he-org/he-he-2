import React from "react"
import Link from "gatsby-link";

import MarkdownContent from '../components/MarkdownContent';

import styles from "./index.module.scss";

export default ({ data }) => {
  const post = data.markdownRemark;
  return (
    <div className={styles.styles}>
      <MarkdownContent html={post.html}/>
    </div>
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
