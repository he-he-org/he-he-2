import React from "react";
import MarkdownContent from '../components/MarkdownContent';

import styles from './vacancies.module.scss';
import { withI18n } from '../i18n';

class TextWithNote extends React.Component {
  render() {
    let children = [];

    let rest = this.props.text || '';
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

class Columns extends React.Component {
  renderColumns() {
    const { children, columns } = this.props;

    const childrenArray = React.Children.toArray(children);
    const columnsCount = columns || 1;
    const itemsPerColumn = Math.ceil(childrenArray.length / columnsCount);

    const result = [];

    for (let i = 0; i < columnsCount; i += 1) {
      result.push(
        <div className={styles.columnsColumn} key={`column_${i}`}>
          {childrenArray.slice(i * itemsPerColumn, i * itemsPerColumn + itemsPerColumn)}
        </div>
      )
    }

    return result;
  }

  render() {
    return (
      <div className={styles.columns}>
        {this.renderColumns()}
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
  };

  renderColumns() {
    const { map, columns } = this.props;

    const columnsCount = columns || 1;
    const keys = Object.keys(map).filter((key) => !!map[key]);
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

class Features extends React.Component {
  renderItem = (key) => {
    const { titles } = this.props;

    return (
      <div key={key} className={styles.featureItem}>
        <TextWithNote text={titles[key]}/>
      </div>
    )
  };

  render() {
    const { map, columns } = this.props;
    return (
      <div className={styles.features}>
        <Columns columns={columns}>
          {Object.keys(map).filter((key) => map[key] === true).map(this.renderItem)}
        </Columns>
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

  renderShortDescription() {
    const vacancy = this.getVacancy();
    return (
      <div className={styles.shortDescription}>{vacancy.frontmatter.short_description}</div>
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
      supplies_by_list: 'Медицинские расходники[по списку от проекта H&H]',
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
          columns={2}
        />
      </Block>
    )
  }

  renderLanguages() {
    const vacancy = this.getVacancy();

    const map = vacancy.frontmatter.required_languages;

    if (!map) {
      return null;
    }

    const keysTitles = {
      spanish: 'Испанский',
      english: 'Английский',
      russian: 'Русский',
    };

    const valuesTitles = {
      'a': 'A (Элементарное владение)',
      'a1': 'A1 (Уровень выживания)',
      'a2': 'A2 (Предпороговый уровень)',
      'b': 'B (Самодостаточное владение)',
      'b1': 'B1 (Пороговый уровень)',
      'b2': 'B2 (Пороговый продвинутый уровен)',
      'c': 'C (Свободное владение)',
      'c1': 'C1 (Уровень профессионального владения)',
      'c2': 'C2 (Уровень владения в совершенстве)',
    };

    return (
      <Block
        title="Владение языками"
        description="В клинике мы используем несколько основных языков общения, ниже приведены минимальные требования по владению ими"
      >
        <Matrix
          keyTitles={keysTitles}
          valueTitles={valuesTitles}
          map={map}
          columns={1}
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
      'advantage': 'преимущество',
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

  renderConditions() {
    const vacancy = this.getVacancy();

    const map = vacancy.frontmatter.conditions;

    if (!map) {
      return null;
    }

    const titles = {
      food: 'Питание[вегетарианское] 3 раза в день',
      place_to_stay: 'Размещение: вместе с другими волонтерами[2-3 человека в комнате]',
      tickets_two_ways: 'Компенсация авиабилетов в обе стороны[Уточнить у координатора]',
      tickets_one_way: 'Компенсация авиабилетов в одну сторону[Уточнить у координатора]',
      travel_compensations: 'Космпенсация стоимости дорожных расходов[Уточнить у координатора]',
      payment: 'Денежное вознаграждение',
      salary: 'Зарплата',
      home: 'Жилье индивидуальное, оплачивается волонтером[Цену можно уточнить у координатора]',
    };

    return (
      <Block title="Условия">
        <Features
          titles={titles}
          map={map}
          columns={2}
        />
      </Block>
    )
  }

  renderOtherConditions() {
    const vacancy = this.getVacancy();

    const map = vacancy.frontmatter.other_conditions;

    if (!map) {
      return null;
    }

    const titles = {
      night_shifts: 'Ночная смена',
      emergencies: 'Неотложные ситуации',
      house_calls: 'Выезд на дом',
      patient_escort_to_the_hospital: 'Сопровождение пациентов в госпиталь',
      stuff_organization: 'Организация работы среднего и младшего медицинского персонала',
      statistics_conducting: 'Ведение медицинской документации и сбор статистики',
      accounting_of_medicines: 'Учет использования и хранения медикаментов',
      drugstore_logistics: 'Логистика аптеки',
      providing_of_lectures: 'Организация и проведение образовательных лекций',
      pr_within_community: 'Создание и поддержание благоприятного имиджа проекта в глазах коммьюнити',
      spanish_classes: 'Организация и проведения занятий по испанскому для волонтёров[с разными языковыми уровнями минимум 3 раза в неделю 1 час и более]',
      cleaning: 'Уборка личных комнат волонтеров и хозяйственного блока[мытье посуды, стирка и т.д.]',
      domestic_purchases: 'Осуществление оптовых закупок еды и хозяйственного инвентаря',
    };

    return (
      <Block title="Дополнительные условия">
        <Features
          titles={titles}
          map={map}
          columns={2}
        />
      </Block>
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
        {this.renderShortDescription()}
        {this.renderAids()}
        {this.renderLanguages()}
        {this.renderAdditionalSkills()}
        {this.renderConditions()}
        {this.renderOtherConditions()}
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
          spanish
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
