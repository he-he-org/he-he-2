import React from "react"
import Link from "gatsby-link";


export default ({ data }) => (
  <div>
    <h1>Vacancies</h1>
    <div>
      {data.allMarkdownRemark.edges.map((edge) => {
        const { node } = edge;
        const { frontmatter } = node;
        return (
          <p key={node.id}><Link to={`/vacancies/${node.fields.slug}/`}>{frontmatter.date}: {frontmatter.title}</Link></p>
        );
      })}
    </div>
  </div>
)


export const query = graphql`
  query VacanciesQuery {
    allMarkdownRemark(
      filter: {
        fields: {collection: {eq: "vacancies"}}
      },
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
