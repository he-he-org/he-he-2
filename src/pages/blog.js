import React from "react"
import Link from "gatsby-link";
import { withLanguage } from '../helpers/i18n';
import routes from '../helpers/routes';

export default withLanguage((props) => {
  const { data, language } = props;
  return (
    <div>
      <h1>Blog ({language})</h1>
      <div>
        {data.allMarkdownRemark && data.allMarkdownRemark.edges.map((edge) => {
          const { node } = edge;
          const { frontmatter } = node;
          return (
            <p key={node.id}><Link to={routes.blogPost({ language, slug: node.fields.slug })}>{frontmatter.date}: {frontmatter.title}</Link></p>
          );
        })}
      </div>
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
            date(formatString: "DD MMMM, YYYY")
          }
          fields {
            slug
          }
        }
      }
    }
  }
`;
