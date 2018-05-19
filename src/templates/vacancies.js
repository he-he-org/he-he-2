import React from "react";
import MarkdownContent from '../components/MarkdownContent';

import styles from './vacancies.module.scss';
import { withI18n } from '../i18n';

class TextWithNote extends React.Component {
  render() {
    let children = [];

    let rest = this.props.text;
    let match;
    while(match = rest.match(/^(.*?)\[(.*?)\](.*)$/)) {
      const [_, prefix, note, postfix] = match;
      children.push(prefix);
      children.push(<span className={styles.note}>*<div>{note}</div></span>);
      rest = postfix;
    }
    children.push(rest);

    return React.createElement(
      'span',
      null,
      ...children,
    );
  }
}

class Block extends React.Component {
  render() {
    return (
      <div className={styles.parametersBlock}>
        <div className={styles.parametersBlockTitle}>{this.props.title}</div>
        {this.props.description && <div className={styles.parametersBlockDescription}>{this.props.description}</div>}
        <div className={styles.parametersBlockContent}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

class Matrix extends React.Component {
  renderPair = (key) => {
    const { keyTitles, valueTitles, map } = this.props;

    return (
      <div key={key} className={styles.matrixRow}>
        <div className={styles.matrixKey}><TextWithNote text={keyTitles[key]}/></div>
        <div className={styles.matrixValue}>{valueTitles[map[key]]}</div>
      </div>
    )
  }

  renderColumns() {
    const { map, columns } = this.props;

    const columnsCount = columns || 1;
    const keys = Object.keys(map);
    const itemsPerColumn = Math.ceil(keys.length / columnsCount);

    const result = [];

    for (let i = 0; i < columnsCount; i += 1) {
      result.push(
        <div className={styles.matrixColumn} key={`column_${i}`}>
          {keys.slice(i * itemsPerColumn, i * itemsPerColumn + itemsPerColumn).map(this.renderPair)}
        </div>
      )
    }

    return result;
  }

  render() {
    return (
      <div className={styles.matrix}>
        {this.renderColumns()}
      </div>
    )
  }
}

class Vacancies extends React.Component {
  getVacancy() {
    return this.props.data.markdownRemark;
  }

  renderTitle() {
    const vacancy = this.getVacancy();
    return (
      <div className={styles.title}>{vacancy.frontmatter.title}</div>
    )
  }

  renderPlace() {
    const { t } = this.props;
    const vacancy = this.getVacancy();
    const { place } = vacancy.frontmatter;

    let placeTitle = place;

    switch (place) {
      case 'guatemala': placeTitle = t('pages_vacancies_group_title_guatemala'); break;
      case 'nicaragua': placeTitle = t('pages_vacancies_group_title_nicaragua'); break;
      case 'online': placeTitle = t('pages_vacancies_group_title_online'); break;
      default:
    }

    return (
      <div className={styles.place}>{placeTitle}</div>
    )
  };

  renderAids() {
    const vacancy = this.getVacancy();

    const map = vacancy.frontmatter.humanitarian_aid;

    if (!map) {
      return null;
    }

    const keysTitles = {
      farmacy_by_list: 'Медикаменты[по списку от проекта H&H]',
      supplies_by_list: 'Медицинскиерасходники[по списку от проекта H&H]',
      equipment_by_list: 'Медицинское оборудование[по списку от проекта H&H]',
      for_children: 'Детские вещи',
      building_materials: 'Строительные материалы',
    };

    const valuesTitles = {
      'will_be_given': 'будет выдано проектом H&H, не возмещаются расходы на провоз багажа',
      'pack_yourself': 'собрать самостоятельно, не возмещаются расходы на покупку гум.помощи и провоз багажа',
      'price_compensation': 'проект H&H возместит расходы на покупки',
      'transport_compensation': 'проект H&H возместит расходы на провоз багажа',
    };

    return (
      <Block
        title="Гуманитарная помощь"
        description="Для большинства волонтеров действует правило - необходимо привезти с собой некоторое количество гуманитарной помощи. Ниже расположен список того, что мы хотели бы получить от соискателя на эту вакансию"
      >
        <Matrix
          keyTitles={keysTitles}
          valueTitles={valuesTitles}
          map={map}
        />
      </Block>
    )
  }

  renderAdditionalSkills() {
    const vacancy = this.getVacancy();

    const map = vacancy.frontmatter.additional_skills;

    if (!map) {
      return null;
    }

    const keysTitles = {
      driving: 'Вождение автомобиля',
      motorcycling: 'Вождение мотоцикла',
      cooking: 'Приготовление пищи',
      photo_video: 'Съемка фото и видео[на полу- или профессиональную камеру]',
    };

    const valuesTitles = {
      'must': 'обязательно',
      'desirable': 'желательно',
      'advantage': 'приемущество',
    };

    return (
      <Block title="Дополнительные навыки">
        <Matrix
          keyTitles={keysTitles}
          valueTitles={valuesTitles}
          map={map}
          columns={2}
        />
      </Block>
    )
  }

  renderBody() {
    const vacancy = this.getVacancy();

    return (
      <MarkdownContent html={vacancy.html} />
    )
  }


  render() {
    const { data, t } = this.props;
    const vacancy = this.getVacancy();
    const { frontmatter } = vacancy;
    return (
      <div className={styles.root}>
        {this.renderTitle()}
        {this.renderPlace()}
        {this.renderAids()}
        {this.renderAdditionalSkills()}
        {this.renderBody()}
      </div>
    );
  }
}

export default withI18n(Vacancies);

export const query = graphql`
  query VacancyPostQuery($slug: String!) {
    markdownRemark(
      fields: {
        slug: { eq: $slug }
        collection: { eq: "vacancies" }
      }
      frontmatter: {
        is_hidden: { ne: true }
      }
    ) {
      html
      frontmatter {
        title
        place
        title
        short_description
        image
        date
        place
        price
        humanitarian_aid {
          building_materials
          equipment_by_list
          farmacy_by_list
          for_children
          supplies_by_list
        }
        age_restrictions
        required_languages {
          english
          russian
          spain
        }
        education
        volunteer_type
        term
        term_custom
        work_time
        rest_time
        conditions {
          food
          home
          payment
          place_to_stay
          salary
          tickets_one_way
          tickets_two_ways
          travel_compensations
        }
        additional_skills {
          cooking
          driving
          motorcycling
          photo_video
        }
        other_conditions {
          accounting_of_medicines
          domestic_purchases
          drugstore_logistics
          emergencies
          house_calls
          night_shifts
          patient_escort_to_the_hospital
          pr_within_community
          providing_of_lectures
          spanish_classes
          statistics_conducting
          stuff_organization
        }
        additional_info
      }
    }
  }
`;
