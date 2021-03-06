module.exports = {
  siteMetadata: {
    title: `Health & Help Second Site`,
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blog`,
        path: `${__dirname}/content/blog/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `vacancies`,
        path: `${__dirname}/content/vacancies/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `vacancies`,
        path: `${__dirname}/content/vacancies-2/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `volunteer-articles`,
        path: `${__dirname}/content/volunteer-articles/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `volunteer-topics`,
        path: `${__dirname}/content/volunteer-topics/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `volunteer-places`,
        path: `${__dirname}/content/volunteer-places/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/content/pages/`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [`gatsby-remark-responsive-iframe`],
      },
    },
    'gatsby-plugin-netlify-cms',
    {
      resolve: `gatsby-plugin-netlify-cms`,
      options: {
        // One convention is to place your Netlify CMS customization code in a
        // `src/cms` directory.
        modulePath: `${__dirname}/src/cms/cms.js`,
      },
    },
    'gatsby-plugin-sass',
    {
      resolve: `gatsby-plugin-yandex-metrika`,
      options: {
        trackingId: '48836000',
        webvisor: false,
        trackHash: false,
      },
    },
  ],
};
