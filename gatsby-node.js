const { LANGUAGES, DEFAULT_LANGUAGE_CODE } = require(`./src/constants`);
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

exports.onCreatePage= ({ page, boundActionCreators }) => {
  const { createPage } = boundActionCreators;

  // Make pages for all languages, except of default (page for default already created)
  LANGUAGES.forEach(({ code }) => {
    if (code !== DEFAULT_LANGUAGE_CODE) {
      createPage({
        ...page,
        path: `/${code}${page.path}`,
        context: {
          ...page.context,
        }
      })
    }
  })
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
        if (node.fields.collection !== 'noop') {
          LANGUAGES.forEach(({ code }) => {
            let pagePath = `${node.fields.collection}/${node.fields.slug}`;
            if (code !== DEFAULT_LANGUAGE_CODE) {
              pagePath = `/${code}` + pagePath;
            }
            createPage({
              path: pagePath,
              component: path.resolve(`./src/templates/${node.fields.collection}.js`),
              context: {
                // Data passed to context is available in page queries as GraphQL variables.
                slug: node.fields.slug,
              },
            });
          })
        }
      });
      resolve()
    })
  })
};
