import React from "react";
import MarkdownContent from '../components/MarkdownContent';

import styles from './vacancies.module.scss';
import { withI18n } from '../i18n';

const renderPlace = (place, t) => {
  switch (place) {
    case 'guatemala': return t('pages_vacancies_group_title_guatemala');
    case 'nicaragua': return t('pages_vacancies_group_title_nicaragua');
    case 'online': return t('pages_vacancies_group_title_online');
    default:
      return place;
  }
};

export default withI18n(({ data, t }) => {
  const vacancy = data.markdownRemark;
  return (
    <div className={styles.root}>
      <div className={styles.title}>{vacancy.frontmatter.title}</div>
      <div className={styles.place}>{renderPlace(vacancy.frontmatter.place, t)}</div>
      <MarkdownContent html={vacancy.html} />
    </div>
  );
});

export const query = graphql`
  query VacancyPostQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        place
      }
    }
  }
`;
