const { LANGUAGES, DEFAULT_LANGUAGE_CODE } = require(`./src/constants`);
const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);
const slug = require(`slug`);

exports.onCreateNode = ({ node, getNode, boundActionCreators }) => {
  if (node.internal.type === `MarkdownRemark`) {
    const { createNodeField, deleteNode } = boundActionCreators;

    const parent = getNode(node.parent);
    createNodeField({
      node,
      name: `slug`,
      value: slug(parent.name),
    });
    createNodeField({
      node,
      name: `collection`,
      value: parent.name === 'noop' ? 'noop' : parent.sourceInstanceName,
    })
  }
};

exports.onCreatePage= ({ page, boundActionCreators }) => {
  const { createPage, deletePage } = boundActionCreators;

  // Make pages for all languages, except of default (page for default already created)
  deletePage(page);
  LANGUAGES.forEach(({ code }) => {
    createPage({
      ...page,
      path: `${code === DEFAULT_LANGUAGE_CODE ? '' : `/${code}`}${page.path}`,
      context: {
        ...page.context,
        language: code,
      }
    })
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
              frontmatter {
                language
              }
            }
          }
        }
      }
    `).then(result => {
      result.data.allMarkdownRemark.edges.forEach((edge) => {
        const { node } = edge;
        if (node.fields.collection !== 'noop') {
          LANGUAGES.forEach(({ code }) => {
            let pagePath = `${node.fields.collection}/${node.fields.slug}`;
            let language = node.frontmatter.language;
            if (language !== DEFAULT_LANGUAGE_CODE) {
              pagePath = `${language}/` + pagePath;
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
