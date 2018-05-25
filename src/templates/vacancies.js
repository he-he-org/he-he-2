import React from "react";
import MarkdownContent from '../components/MarkdownContent';
import cn from 'classnames';

import styles from './vacancies.module.scss';
import { withI18n } from '../i18n';
import { format } from '../helpers/date';

function prepareMap(map) {
  if (!map) {
    return {}
  }

  const result = {};
  Object.keys(map).filter(key => !!map[key]).forEach((key) => {
    result[key] = map[key];
  });
  return result
}

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

class RequirementPair extends React.Component {
  render() {
    return (
      <div className={styles.requirementPair}>
        <div className={styles.requirementPairLabel}><TextWithNote text={this.props.label}/></div>
        <div className={styles.requirementPairValue}>{this.props.value}</div>
      </div>
    )
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
    const { children } = this.props;
    return React.Children.map(children, (child, i) => (
      child && <div key={i} className={styles.columnsCell}>
        {child}
      </div>
    ));
  }

  render() {
    let childrenCountEven = React.Children.map(this.props.children, (x) => !!x).filter(x => x).length % 2 === 0;
    let className = cn(
      styles.columns,
      styles[`columns-count-${this.props.columns}`],
      childrenCountEven ? styles.columnsChildrenCountEven : styles.columnsChildrenCountOdd,
    );
    return (
      <div className={className}>
        {this.renderColumns()}
      </div>
    )
  }
}

class Matrix extends React.Component {
  renderPair = (key) => {
    const { keyTitles, valueTitles, map } = this.props;

    return (
      <RequirementPair
        label={keyTitles[key]}
        value={valueTitles[map[key]]}
      />
    )
  };

  render() {
    const { map } = this.props;
    const keys = Object.keys(map).filter((key) => !!map[key]);

    return (
      <div className={styles.matrix}>
        <Columns columns={this.props.columns}>
          {keys.map(this.renderPair)}
        </Columns>
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

  renderCustom() {
    if (!this.props.custom) {
      return null;
    }

    return this.props.custom.split(/\s*;\s*/).filter((x) => !!x).map((feature, i) => (
      <div key={`custom_${i}`} className={styles.featureItem}>
        <TextWithNote text={feature}/>
      </div>
    ))
  }

  render() {
    const { map, columns } = this.props;
    return (
      <div className={styles.features}>
        <Columns columns={columns}>
          {Object.keys(map).filter((key) => map[key] === true).map(this.renderItem)}
          {this.renderCustom()}
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

  renderImage() {
    const vacancy = this.getVacancy();

    return (
      <img src={vacancy.frontmatter.image} className={styles.image} />
    )
  }

  renderPrice() {
    const vacancy = this.getVacancy();
    const { frontmatter } = vacancy;

    if (!frontmatter.price) {
      return null;
    }

    return (
      <RequirementPair
        label={'Цена участия'}
        value={frontmatter.price}
      />
    );
  }

  renderAgeRestrictions() {
    const vacancy = this.getVacancy();
    const { frontmatter } = vacancy;

    if (!frontmatter.age_restrictions) {
      return null;
    }

    const titles = {
      plus_16: 'от 16 лет',
      plus_18: 'от 18 лет',
    };

    return (
      <RequirementPair
        label={'Ограничение по возрасту'}
        value={titles[frontmatter.age_restrictions]}
      />
    );
  }

  renderEducation() {
    const vacancy = this.getVacancy();
    const { frontmatter } = vacancy;

    if (!frontmatter.education) {
      return null;
    }

    const titles = {
      md: 'диплом врача',
      nurse: 'диплом медсестры',
      higher_education: 'законченное высшее образование',
    };

    return (
      <RequirementPair
        label={'Необходимое образование'}
        value={titles[frontmatter.education]}
      />
    );
  }

  renderVolunteerType() {
    const vacancy = this.getVacancy();
    const { frontmatter } = vacancy;

    if (!frontmatter.volunteer_type) {
      return null;
    }

    const titles = {
      any: 'волонтеров из любой точки мира',
      family: 'пары/семьи',
      group: 'группы',
    };

    return (
      <RequirementPair
        label={'Мы принимаем'}
        value={titles[frontmatter.volunteer_type]}
      />
    )
  }

  renderTerm() {
    const { language } = this.props;
    const vacancy = this.getVacancy();
    const { frontmatter } = vacancy;

    if (!frontmatter.term) {
      return null;
    }

    const titles = {
      week: 'познакомиться/привезти донации (не более 1 недели)',
      month: 'короткий период (от 2 недель до месяца)',
      several_months: 'длинный период (до 1 года)',
      year: 'год',
      custom: 'конкретные даты',
    };

    let text;
    if (frontmatter.term === 'custom') {
      if (!frontmatter.term_custom_start || !frontmatter.term_custom_end) {
        return null
      }
      const start = format(frontmatter.term_custom_start, language, { format: 'LL' });
      const end = format(frontmatter.term_custom_end, language, { format: 'LL' });
      text = `от ${start} до ${end}`
    } else {
      text = titles[frontmatter.term]
    }

    return (
      <RequirementPair
        label={'Срок приезда'}
        value={text}
      />
    )
  }

  renderWorkTime() {
    const vacancy = this.getVacancy();
    const { frontmatter } = vacancy;

    if (!frontmatter.work_time) {
      return null;
    }

    return (
      <RequirementPair
        label={'Часы работы'}
        value={frontmatter.work_time}
      />
    )
  }

  renderRestTime() {
    const vacancy = this.getVacancy();
    const { frontmatter } = vacancy;

    if (!frontmatter.rest_time) {
      return null;
    }

    return (
      <RequirementPair
        label={'Часы отдыха / отпуск'}
        value={frontmatter.rest_time}
      />
    )
  }

  renderMainRequirements() {
    const children = [
      this.renderPrice(),
      this.renderAgeRestrictions(),
      this.renderEducation(),
      this.renderVolunteerType(),
      this.renderTerm(),
      this.renderWorkTime(),
      this.renderRestTime(),
    ].filter((x) => !!x);

    if (children.length === 0) {
      return null;
    }

    return (
      <Block
        title="Основные требования"
      >
        {React.createElement(
          Columns,
          {
            columns: 2,
          },
          ...children
        )}
      </Block>
    )
  }

  renderAids() {
    const vacancy = this.getVacancy();

    const map = prepareMap(vacancy.frontmatter.humanitarian_aid);

    if (Object.keys(map).length === 0) {
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

  renderMainLanguage() {
    const vacancy = this.getVacancy();
    const { frontmatter } = vacancy;

    if (!frontmatter.main_language) {
      return null;
    }

    const titles = {
      spanish: 'испанский',
      english: 'английский',
      russian: 'русский',
    };

    return (
      <RequirementPair
        label='Преимущество: '
        value={titles[frontmatter.main_language]}
      />
    )
  }

  renderLanguages() {
    const vacancy = this.getVacancy();

    const map = prepareMap(vacancy.frontmatter.required_languages);

    if (Object.keys(map).length === 0) {
      return null;
    }

    const keysTitles = {
      spanish: 'Испанский',
      english: 'Английский',
      russian: 'Русский',
    };

    const valuesTitles = {
      'a': 'A (элементарное владение)',
      'a1': 'A1 (уровень выживания)',
      'a2': 'A2 (предпороговый уровень)',
      'b': 'B (самодостаточное владение)',
      'b1': 'B1 (пороговый уровень)',
      'b2': 'B2 (пороговый продвинутый уровень)',
      'c': 'C (свободное владение)',
      'c1': 'C1 (уровень профессионального владения)',
      'c2': 'C2 (уровень владения в совершенстве)',
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
        <div className={styles.mainLanguage}>
          {this.renderMainLanguage()}
        </div>
      </Block>
    )
  }

  renderAdditionalSkills() {
    const vacancy = this.getVacancy();

    const map = prepareMap(vacancy.frontmatter.additional_skills);

    if (Object.keys(map).length === 0) {
      return null;
    }

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

  renderConditions() {
    const vacancy = this.getVacancy();

    const map = prepareMap(vacancy.frontmatter.conditions);

    if (Object.keys(map).length === 0) {
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

    const map = prepareMap(vacancy.frontmatter.other_conditions);

    if (Object.keys(map).length === 0 && !vacancy.frontmatter.other_conditions_custom) {
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
          custom={vacancy.frontmatter.other_conditions_custom}
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
        {this.renderShortDescription()}
        {this.renderImage()}
        {this.renderMainRequirements()}
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
        main_language
        required_languages {
          english
          russian
          spanish
        }
        education
        volunteer_type
        term
        term_custom_start
        term_custom_end
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
        other_conditions_custom
      }
    }
  }
`;
