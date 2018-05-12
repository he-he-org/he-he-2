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
    'gatsby-transformer-remark',
    'gatsby-plugin-netlify-cms',
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
