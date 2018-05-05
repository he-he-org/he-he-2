import React from "react"
import Link from "gatsby-link";

import MarkdownContent from '../components/MarkdownContent';

import styles from "./index.module.scss";

export default ({ data }) => {
  console.log("data", data)
  const post = data.markdownRemark;
  return (
    <div className={styles.styles}>
      <MarkdownContent html={post.html}/>
    </div>
  );
}

export const query = graphql`
  query IndexPostQuery {
    markdownRemark(
      fields: { 
        slug: { eq: "index" }
        collection: { eq: "pages" } 
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
