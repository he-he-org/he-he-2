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

const articleTopicFilter = (topic) => (article) => article.frontmatter.topics.split(',').some((topicName) => topicName === topic.frontmatter.name);
const articlePlaceFilter = (place) => (article) => article.frontmatter.places.split(',').some((placeName) => placeName === place.frontmatter.name);

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators;

  const blogAndVacanciesPromise = new Promise((resolve, reject) => {
    graphql(`
      {
        allMarkdownRemark(
          filter: {
            frontmatter: {
              is_hidden: {ne: true}
            }
          }
        ) {
          edges {
            node {
              fields {
                slug
                collection
              }
              frontmatter {
                language
                version
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
          let version = node.frontmatter.version;
          let versionSuffix = version ? `-${version}` : '';
          if (language !== DEFAULT_LANGUAGE_CODE) {
            pagePath = `${language}/` + pagePath;
          }
          createPage({
            path: pagePath,
            component: path.resolve(`./src/templates/${node.fields.collection}${versionSuffix}.js`),
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
    const placesP = graphql(`
      {
        allMarkdownRemark(
          filter: {
            fields: {
              collection: {eq: "volunteer-places"}
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
                title_es
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

    const topicsP = graphql(`
      {
        allMarkdownRemark(
          filter: {
            fields: {
              collection: {eq: "volunteer-topics"}
            }
          }
          sort: {fields: [frontmatter___order], order: ASC},
        ) {
          edges {
            node {
              id
              frontmatter {
                name
                title
                title_ru
                title_es
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

    const articlesP = graphql(`
      {
        allMarkdownRemark(
          filter: {
            fields: {
              collection: {eq: "volunteer-articles"}
            }
            frontmatter: {
              is_hidden: {ne: true}
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
                places
                date
                is_pinned
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
        let nodes = result.data.allMarkdownRemark.edges.map(({ node }) => node);
        return nodes;
      }

      return [];
    }).then((nodes) => {
      const sortedNodes = [...nodes];
      sortedNodes.sort((x, y) => {
        const xIsPinned = x.frontmatter.is_pinned;
        const yIsPinned = y.frontmatter.is_pinned;
        const xDate = new Date(x.frontmatter.date);
        const yDate = new Date(y.frontmatter.date);
        if (xIsPinned !== yIsPinned) {
          return xIsPinned ? -1 : 1;
        }
        if (xDate !== yDate) {
          return xDate > yDate ? -1 : 1;
        }
        return 0;
      });
      return sortedNodes;
    });

    Promise.all([placesP, topicsP, articlesP])
      .then(([places, topics, articles]) => {
      LANGUAGES.forEach(({ code }) => {
        let baseLanguagePath = `/`;
        if (code !== DEFAULT_LANGUAGE_CODE) {
          baseLanguagePath = `/${code}` + baseLanguagePath;
        }

        const languageArticles = articles.filter(({ frontmatter }) => frontmatter.language === code);
        places.forEach((place) => {

          const basePlacePath = baseLanguagePath + `${place.frontmatter.name}/`;

          const placeArticles = languageArticles.filter(articlePlaceFilter(place));

          // Filter out topics without articles
          const placeTopics = topics.filter((topic) => {
            return placeArticles.some(articleTopicFilter(topic)) ;
          });

          // Create page for place with no topic selected
          createPage({
            path: basePlacePath,
            component: path.resolve(`./src/templates/volunteer-topic.js`),
            context: {
              topic: null,
              place,
              topics: placeTopics,
              articles: placeArticles,
            },
          });

          // Create page for place for each topic
          placeTopics.forEach((topic) => {
            const placeAndTopicArticles = placeArticles.filter(articleTopicFilter(topic));

            let baseTopicPath = basePlacePath + `topic/${topic.frontmatter.name}/`;

            createPage({
              path: baseTopicPath,
              component: path.resolve(`./src/templates/volunteer-topic.js`),
              context: {
                topic,
                place,
                topics: placeTopics,
                articles: placeAndTopicArticles,
              },
            });

          });

          // Create page for each article in topic
          articles.forEach((article) => {
            createPage({
              path: basePlacePath + `${article.fields.slug}/`,
              component: path.resolve(`./src/templates/volunteer-article.js`),
              context: {
                slug: article.fields.slug,
              },
            });
          })
        })
      });
      resolve();
    })
  });

  return Promise.all([blogAndVacanciesPromise, volunteerPromise]);
};
