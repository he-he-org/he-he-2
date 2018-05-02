const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);
const slug = require(`slug`);

exports.onCreateNode = ({ node, getNode, boundActionCreators }) => {
  if (node.internal.type === `MarkdownRemark`) {
    const { createNodeField } = boundActionCreators;

    const parent = getNode(node.parent);
    const fileSlug = slug(parent.name);

    createNodeField({
      node,
      name: `slug`,
      value: fileSlug,
    });
    createNodeField({
      node,
      name: `collection`,
      value: parent.sourceInstanceName
    })
  }
};

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators;
  return new Promise((resolve, reject) => {
    graphql(`
      {
        allMarkdownRemark {
          edges {
            node {
              fields {
                slug
                collection
              }
            }
          }
        }
      }
    `).then(result => {
      result.data.allMarkdownRemark.edges.forEach(({ node }) => {
        console.log("node.fields", node.fields)
        createPage({
          path: `${node.fields.collection}/${node.fields.slug}`,
          component: path.resolve(`./src/templates/${node.fields.collection}.js`),
          context: {
            // Data passed to context is available in page queries as GraphQL variables.
            slug: node.fields.slug,
          },
        })
      });
      resolve()
    })
  })
};
