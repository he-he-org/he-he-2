import React from "react";
import Link from "gatsby-link";
import cn from 'classnames';
import MarkdownContent from '../components/MarkdownContent';

import styles from './volunteer-topic.module.scss';
import { withI18n } from '../i18n';
import routes from '../helpers/routes';
import ItemPreview from '../components/ItemPreview';
import { DEFAULT_LANGUAGE_CODE } from '../constants';

class VolunteerTemplate extends React.Component {
  renderTopics() {
    const { language } = this.props;
    const { topics, topic } = this.props.pathContext;

    const currentTopicRoute = topic && routes.volunteerTopic({ language, slug: topic.frontmatter.name })

    return (
      <div className={styles.topics}>
        {topics.map(({ frontmatter }) => {
          let route = routes.volunteerTopic({ language, slug: frontmatter.name });
          let isActiveTopic = (route === currentTopicRoute);
          return (
            <Link
              className={cn(styles.topic, isActiveTopic && styles.isActive)}
              key={frontmatter.name}
              to={isActiveTopic ? routes.volunteer({ language }) : route}
            >
              {language === DEFAULT_LANGUAGE_CODE ? frontmatter.title : frontmatter[`title_${language}`]}
            </Link>
          );
        })}
      </div>
    )
  }

  renderArticles() {
    const { language, t } = this.props;
    const { articles } = this.props.pathContext;

    if (articles.length === 0) {
      return <div className={styles.noItemsMessage}>{t('pages_volunteer_no_articles_yet')}</div>
    }

    return (
      <div className={styles.articles}>
        {articles.map(({ id, fields, frontmatter }) => {
          return (
            <ItemPreview
              url={routes.volunteerArticle({ language, slug: fields.slug })}
              key={id}
              image={fields.image_thumbnail}
              title={frontmatter.title}
            />
          );
        })}
      </div>
    )
  }

  render() {
    return (
      <div className={styles.root}>
        {this.renderTopics()}
        {this.renderArticles()}
      </div>
    );
  }
}

export default withI18n(VolunteerTemplate);

// export const query = graphql`
//   query ValunteerQuery($topic: String!) {
//     markdownRemark(fields: { slug: { eq: $slug } }) {
//       html
//       frontmatter {
//         date
//         title
//       }
//     }
//   }
// `;
