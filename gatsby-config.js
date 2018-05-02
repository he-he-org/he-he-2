module.exports = {
  siteMetadata: {
    title: `Health & Help Second Site`,
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blog`,
        path: `${__dirname}/src/pages/blog/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `vacancies`,
        path: `${__dirname}/src/pages/vacancies/`,
      },
    },
    'gatsby-transformer-remark',
  ],
};
