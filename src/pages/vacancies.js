import React from "react"
import Link from "gatsby-link";
import { withLanguage } from '../helpers/i18n';
import routes from '../helpers/routes';

export default withLanguage(({ data, language }) => (
  <div>
    <h1>Vacancies ({ language })</h1>
    <div>
      {data.allMarkdownRemark && data.allMarkdownRemark.edges.map((edge) => {
        const { node } = edge;
        const { frontmatter } = node;
        return (
          <p key={node.id}><Link to={routes.vacanciesItem({ language, slug: node.fields.slug })}>{frontmatter.date}: {frontmatter.title}</Link></p>
        );
      })}
    </div>
  </div>
))


export const query = graphql`
  query VacanciesQuery($language: String!) {
    allMarkdownRemark(
      filter: {
        fields: {
          collection: {eq: "vacancies"},
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
