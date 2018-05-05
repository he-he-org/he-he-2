const { LANGUAGES, DEFAULT_LANGUAGE_CODE } = require(`./src/constants`);
const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);
const slug = require(`slug`);
const sharp = require('sharp');
const fsExtra = require('fs-extra');

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
    });

    if (node.frontmatter.image) {
      let url = `/thumbnails${node.frontmatter.image}`;
      const filePath = path.resolve(`./public${url}`);
      fsExtra.ensureFileSync(filePath);
      sharp(path.resolve(`./static${node.frontmatter.image}`))
        .resize(320, 240)
        .jpeg({
          quality: 95,
        })
        .toFile(filePath, (err, info) => {
          if (err) {
            console.error(err)
          }
        });
      createNodeField({
        node,
        name: `image_thumbnail`,
        value: url,
      });
    }
  }
};

exports.onCreatePage= ({ page, boundActionCreators }) => {
  const { createPage, deletePage } = boundActionCreators;

  // Delete page and make it again on all languages
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

  const blogAndVacanciesPromise = new Promise((resolve, reject) => {
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
        if (['blog', 'vacancies'].some((x) => x === node.fields.collection)) {
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
        }
      });
      resolve()
    })
  })

  const volunteerPromise = new Promise((resolve, reject) => {
    const topicsP = graphql(`
      {
        allMarkdownRemark(
          filter: {
            fields: {
              collection: {eq: "volunteer-topics"}
            }
          }
        ) {
          edges {
            node {
              id
              frontmatter {
                name
                title
                title_ru
              }
              fields {
                slug,
              }
            }
          }
        }
      }
    `).then(result => {
      if (result.data.allMarkdownRemark) {
        return result.data.allMarkdownRemark.edges.map(({ node }) => node);
      }

      return [];
    });

    // todo: filter by language
    const articlesP = graphql(`
      {
        allMarkdownRemark(
          filter: {
            fields: {
              collection: {eq: "volunteer-articles"}
            }
          }
        ) {
          edges {
            node {
              id
              frontmatter {
                title
                language
                title
                image
                topics
              }
              fields {
                slug
                image_thumbnail
              }
            }
          }
        }
      }
    `).then(result => {
      if (result.data.allMarkdownRemark) {
        return result.data.allMarkdownRemark.edges.map(({ node }) => node);
      }

      return [];
    });

    Promise.all([topicsP, articlesP]).then(([topics, articles]) => {
      LANGUAGES.forEach(({ code }) => {
        let baseVolunteersPagePath = `/volunteer/`;
        if (code !== DEFAULT_LANGUAGE_CODE) {
          baseVolunteersPagePath = `/${code}` + baseVolunteersPagePath;
        }

        const languageArticles = articles.filter(({ frontmatter }) => frontmatter.language === code)

        // Create page with no topic selected
        createPage({
          path: baseVolunteersPagePath,
          component: path.resolve(`./src/templates/volunteer-topic.js`),
          context: {
            topics,
            topic: null,
            articles: languageArticles,
          },
        });

        // Create page for each topic
        topics.forEach((topic) => {
          const topicArticles = languageArticles
            .filter(({ frontmatter }) => frontmatter.topics.split(',').some((topicName) => topicName === topic.frontmatter.name));

          createPage({
            path: `${baseVolunteersPagePath}topic/${topic.frontmatter.name}/`,
            component: path.resolve(`./src/templates/volunteer-topic.js`),
            context: {
              topics,
              topic,
              articles: topicArticles,
            },
          });
        })

        // Create page for each article
        articles.forEach((article) => {
          createPage({
            path: `${baseVolunteersPagePath}${article.fields.slug}/`,
            component: path.resolve(`./src/templates/volunteer-article.js`),
            context: {
              slug: article.fields.slug,
            },
          });
        })

      });
      resolve();
    })
  });

  return Promise.all([blogAndVacanciesPromise, volunteerPromise]);
};
