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
    'gatsby-transformer-remark',
    'gatsby-plugin-netlify-cms',
    'gatsby-plugin-sass',
  ],
};
