import React from "react";
import { Link } from "gatsby";
import cn from 'classnames';
import MarkdownContent from '../components/MarkdownContent';

import styles from './volunteer-topic.module.scss';
import { withI18n } from '../i18n';
import routes from '../helpers/routes';
import ItemPreview from '../components/ItemPreview';
import { DEFAULT_LANGUAGE_CODE } from '../constants';
import Layout from '../components/layouts/default';

class VolunteerTemplate extends React.Component {
  renderTopics() {
    const { language } = this.props;
    const { topics, topic, place } = this.props.pathContext;

    if (topics.length < 2) {
      return null;
    }

    const currentTopicRoute = topic && routes.volunteerPlaceTopic({ language, place: place.frontmatter.name, topic: topic.frontmatter.name })

    return (
      <div className={styles.topics}>
        {topics.map(({ frontmatter }) => {
          let route = routes.volunteerPlaceTopic({ language, place: place.frontmatter.name, topic: frontmatter.name });
          let isActiveTopic = (route === currentTopicRoute);
          return (
            <Link
              className={cn(styles.topic, isActiveTopic && styles.isActive)}
              key={frontmatter.name}
              to={isActiveTopic ? routes.volunteerPlace({ language, place: place.frontmatter.name }) : route}
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
    const { articles, place, topic } = this.props.pathContext;

    if (articles.length === 0) {
      return <div className={styles.noItemsMessage}>{t('pages_volunteer_no_articles_yet')}</div>
    }

    return (
      <div className={styles.articles}>
        {articles.map(({ id, fields, frontmatter }) => {
          return (
            <ItemPreview
              url={routes.volunteerArticle({ language, place: place.frontmatter.name, slug: fields.slug })}
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
      <Layout location={this.props.location}>
        <div className={styles.root}>
          {this.renderTopics()}
          {this.renderArticles()}
        </div>
      </Layout>
    );
  }
}

export default withI18n(VolunteerTemplate);
