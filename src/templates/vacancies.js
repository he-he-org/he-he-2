import React from "react";
import { graphql } from "gatsby";
import MarkdownContent from "../components/MarkdownContent";
import cn from "classnames";

import styles from "./vacancies.module.scss";
import { withI18n } from "../i18n";
import { format } from "../helpers/date";
import Layout from "../components/layouts/default";

function prepareMap(map) {
  if (!map) {
    return {};
  }

  const result = {};
  Object.keys(map)
    .filter(key => !!map[key])
    .forEach(key => {
      result[key] = map[key];
    });
  return result;
}

class TextWithNote extends React.Component {
  render() {
    let children = [];

    let rest = this.props.text || "";
    let match;
    while ((match = rest.match(/^(.*?)\[(.*?)\](.*)$/))) {
      const [_, prefix, note, postfix] = match;
      children.push(prefix);
      children.push(
        <span className={styles.note}>
          *<div>{note}</div>
        </span>
      );
      rest = postfix;
    }
    children.push(rest);

    return React.createElement("span", null, ...children);
  }
}

class RequirementPair extends React.Component {
  render() {
    return (
      <div className={styles.requirementPair}>
        {this.props.label && (
          <div className={styles.requirementPairLabel}>
            <TextWithNote text={this.props.label} />
          </div>
        )}
        {this.props.value && (
          <div className={styles.requirementPairValue}>{this.props.value}</div>
        )}
      </div>
    );
  }
}

class Block extends React.Component {
  render() {
    return (
      <div className={styles.parametersBlock}>
        <div className={styles.parametersBlockTitle}>{this.props.title}</div>
        {this.props.description && (
          <div className={styles.parametersBlockDescription}>
            {this.props.description}
          </div>
        )}
        <div className={styles.parametersBlockContent}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

class Columns extends React.Component {
  renderCell = (child, i) => {
    return (
      <div key={i} className={styles.columnsCell}>
        {child}
      </div>
    );
  };

  renderColumn = (children, i) => {
    return (
      <div key={i} className={styles.columnsColumn}>
        {children.map(this.renderCell)}
      </div>
    );
  };

  renderColumns() {
    const { children } = this.props;
    return React.Children.map(
      children,
      (child, i) =>
        child && (
          <div key={i} className={styles.columnsCell}>
            {child}
          </div>
        )
    );
  }

  render() {
    const childrenArray = React.Children.toArray(this.props.children);
    const childPerColumn = Math.ceil(childrenArray.length / this.props.columns);

    const columns = [];
    for (let i = 0; i < childrenArray.length; i += childPerColumn) {
      columns.push(childrenArray.slice(i, i + childPerColumn));
    }

    return (
      <div className={styles.columns}>{columns.map(this.renderColumn)}</div>
    );
  }
}

class Matrix extends React.Component {
  renderPair = key => {
    const { keyTitles, valueTitles, map } = this.props;

    return (
      <RequirementPair
        key={key}
        label={keyTitles[key]}
        value={valueTitles[map[key]]}
      />
    );
  };

  render() {
    const { map } = this.props;
    const keys = Object.keys(map).filter(key => !!map[key]);

    return (
      <div className={styles.matrix}>
        <Columns columns={this.props.columns}>
          {keys.map(this.renderPair)}
        </Columns>
      </div>
    );
  }
}

class Features extends React.Component {
  renderItem = key => {
    const { titles } = this.props;

    return (
      <div key={key} className={styles.featureItem}>
        <TextWithNote text={titles[key]} />
      </div>
    );
  };

  renderCustom() {
    if (!this.props.custom) {
      return null;
    }

    return this.props.custom
      .split(/\s*;\s*/)
      .filter(x => !!x)
      .map((feature, i) => (
        <div key={`custom_${i}`} className={styles.featureItem}>
          <TextWithNote text={feature} />
        </div>
      ));
  }

  render() {
    const { map, columns } = this.props;
    return (
      <div className={styles.features}>
        <Columns columns={columns}>
          {Object.keys(map)
            .filter(key => map[key] === true)
            .map(this.renderItem)}
          {this.renderCustom()}
        </Columns>
      </div>
    );
  }
}

class Vacancies extends React.Component {
  getVacancy() {
    return this.props.data.markdownRemark;
  }

  renderTitle() {
    const vacancy = this.getVacancy();
    return <div className={styles.title}>{vacancy.frontmatter.title}</div>;
  }

  renderShortDescription() {
    const vacancy = this.getVacancy();
    return (
      <div className={styles.shortDescription}>
        {vacancy.frontmatter.short_description}
      </div>
    );
  }

  renderPlace() {
    const { t } = this.props;
    const vacancy = this.getVacancy();
    const { place } = vacancy.frontmatter;

    let placeTitle = place;

    switch (place) {
      case "guatemala":
        placeTitle = t("pages_vacancies_group_title_guatemala");
        break;
      case "nicaragua":
        placeTitle = t("pages_vacancies_group_title_nicaragua");
        break;
      case "guatemala-nicaragua":
        placeTitle = t("pages_vacancies_group_title_guatemala_nicaragua");
        break;
      case "online":
        placeTitle = t("pages_vacancies_group_title_online");
        break;
      default:
    }

    return <div className={styles.place}>{placeTitle}</div>;
  }

  renderImage() {
    const vacancy = this.getVacancy();

    return <img src={vacancy.frontmatter.image} className={styles.image} />;
  }

  renderPrice() {
    const { t } = this.props;
    const vacancy = this.getVacancy();
    const { frontmatter } = vacancy;

    if (!frontmatter.price) {
      return null;
    }

    return (
      <RequirementPair
        label={t("vacancies_price_label")}
        value={frontmatter.price}
      />
    );
  }

  renderAgeRestrictions() {
    const { t } = this.props;
    const vacancy = this.getVacancy();
    const { frontmatter } = vacancy;

    if (!frontmatter.age_restrictions) {
      return null;
    }

    const titles = {
      plus_16: t("vacancies_age_titles_plus_16"),
      plus_18: t("vacancies_age_titles_plus_18")
    };

    return (
      <RequirementPair
        label={t("vacancies_age_label")}
        value={titles[frontmatter.age_restrictions]}
      />
    );
  }

  renderEducation() {
    const { t } = this.props;
    const vacancy = this.getVacancy();
    const { frontmatter } = vacancy;

    if (!frontmatter.education) {
      return null;
    }

    const titles = {
      md: t("vacancies_education_titles_md"),
      nurse: t("vacancies_education_titles_nurse"),
      higher_education: t("vacancies_education_titles_higher_education")
    };

    return (
      <RequirementPair
        label={t("vacancies_education_label")}
        value={titles[frontmatter.education]}
      />
    );
  }

  renderVolunteerType() {
    const { t } = this.props;
    const vacancy = this.getVacancy();
    const { frontmatter } = vacancy;

    if (!frontmatter.volunteer_type) {
      return null;
    }

    const titles = {
      any: t("vacancies_volunteer_type_any"),
      family: t("vacancies_volunteer_type_family"),
      group: t("vacancies_volunteer_type_group")
    };

    return (
      <RequirementPair
        label={t("vacancies_volunteer_type_label")}
        value={titles[frontmatter.volunteer_type]}
      />
    );
  }

  renderTerm() {
    const { t } = this.props;
    const { language } = this.props;
    const vacancy = this.getVacancy();
    const { frontmatter } = vacancy;

    if (!frontmatter.term) {
      return null;
    }

    const titles = {
      week: t("vacancies_term_titles_week"),
      month: t("vacancies_term_titles_month"),
      several_months: t("vacancies_term_titles_several_months"),
      year: t("vacancies_term_titles_year"),
      custom: t("vacancies_term_titles_custom")
    };

    let text;
    if (frontmatter.term === "custom" && frontmatter.term_custom) {
      text = frontmatter.term_custom;
    } else {
      text = titles[frontmatter.term];
    }

    return <RequirementPair label={t("vacancies_term_label")} value={text} />;
  }

  renderWorkTime() {
    const { t } = this.props;
    const vacancy = this.getVacancy();
    const { frontmatter } = vacancy;

    if (!frontmatter.work_time) {
      return null;
    }

    return (
      <RequirementPair
        label={t("vacancies_work_time_label")}
        value={frontmatter.work_time}
      />
    );
  }

  renderRestTime() {
    const { t } = this.props;
    const vacancy = this.getVacancy();
    const { frontmatter } = vacancy;

    if (!frontmatter.rest_time) {
      return null;
    }

    return (
      <RequirementPair
        label={t("vacancies_rest_time_label")}
        value={frontmatter.rest_time}
      />
    );
  }

  renderAidTransportation() {
    const { t } = this.props;
    const vacancy = this.getVacancy();
    const { frontmatter } = vacancy;

    if (!frontmatter.aids_transportation) {
      return null;
    }

    return <RequirementPair value={t("vacancies_aids_transportation")} />;
  }

  renderMainRequirements() {
    const { t } = this.props;

    const children = [
      this.renderPrice(),
      this.renderAgeRestrictions(),
      this.renderEducation(),
      this.renderVolunteerType(),
      this.renderTerm(),
      this.renderWorkTime(),
      this.renderRestTime(),
      this.renderAidTransportation()
    ].filter(x => !!x);

    if (children.length === 0) {
      return null;
    }

    return (
      <Block title={t("vacancies_main_requirements")}>
        {React.createElement(
          Columns,
          {
            columns: 2
          },
          ...children
        )}
      </Block>
    );
  }

  renderAids() {
    const { t } = this.props;
    const vacancy = this.getVacancy();

    if (!vacancy.frontmatter.aids_transportation) {
      return null;
    }

    const map = prepareMap(vacancy.frontmatter.humanitarian_aid);

    if (Object.keys(map).length === 0) {
      return null;
    }

    const keysTitles = {
      farmacy_by_list: t(
        "vacancies_humanitarian_aid_key_titles_farmacy_by_list"
      ),
      supplies_by_list: t(
        "vacancies_humanitarian_aid_key_titles_supplies_by_list"
      ),
      equipment_by_list: t(
        "vacancies_humanitarian_aid_key_titles_equipment_by_list"
      ),
      for_children: t("vacancies_humanitarian_aid_key_titles_for_children"),
      building_materials: t(
        "vacancies_humanitarian_aid_key_titles_building_materials"
      )
    };

    const valuesTitles = {
      will_be_given: t("vacancies_humanitarian_aid_value_titles_will_be_given"),
      pack_yourself: t("vacancies_humanitarian_aid_value_titles_pack_yourself"),
      price_compensation: t(
        "vacancies_humanitarian_aid_value_titles_price_compensation"
      ),
      transport_compensation: t(
        "vacancies_humanitarian_aid_value_titles_transport_compensation"
      )
    };

    return (
      <Block
        title={t("vacancies_humanitarian_aid_label")}
        description={t("vacancies_humanitarian_aid_description")}
      >
        <Matrix
          keyTitles={keysTitles}
          valueTitles={valuesTitles}
          map={map}
          columns={2}
        />
      </Block>
    );
  }

  renderAdvantageLanguage() {
    const { t } = this.props;
    const vacancy = this.getVacancy();
    const { frontmatter } = vacancy;

    if (!frontmatter.main_language) {
      return null;
    }

    const titles = {
      spanish: t("vacancies_languages_advantage_titles_spanish"),
      english: t("vacancies_languages_advantage_titles_english"),
      russian: t("vacancies_languages_advantage_titles_russian")
    };

    return (
      <div className={styles.mainLanguage}>
        <RequirementPair
          label={t("vacancies_languages_advantage_label")}
          value={titles[frontmatter.main_language]}
        />
      </div>
    );
  }

  renderLanguages() {
    const { t } = this.props;
    const vacancy = this.getVacancy();

    const map = prepareMap(vacancy.frontmatter.required_languages);

    if (Object.keys(map).length === 0) {
      return null;
    }

    const keysTitles = {
      spanish: t("vacancies_languages_key_titles_spanish"),
      english: t("vacancies_languages_key_titles_english"),
      russian: t("vacancies_languages_key_titles_russian")
    };

    const valuesTitles = {
      a: t("vacancies_languages_value_titles_a"),
      a1: t("vacancies_languages_value_titles_a1"),
      a2: t("vacancies_languages_value_titles_a2"),
      b: t("vacancies_languages_value_titles_b"),
      b1: t("vacancies_languages_value_titles_b1"),
      b2: t("vacancies_languages_value_titles_b2"),
      c: t("vacancies_languages_value_titles_c"),
      c1: t("vacancies_languages_value_titles_c1"),
      c2: t("vacancies_languages_value_titles_c2")
    };

    return (
      <Block
        title={t("vacancies_languages_block_label")}
        description={t("vacancies_languages_block_description")}
      >
        <Matrix
          keyTitles={keysTitles}
          valueTitles={valuesTitles}
          map={map}
          columns={1}
        />
        {this.renderAdvantageLanguage()}
      </Block>
    );
  }

  renderAdditionalSkills() {
    const { t } = this.props;
    const vacancy = this.getVacancy();

    const map = prepareMap(vacancy.frontmatter.additional_skills);

    if (Object.keys(map).length === 0) {
      return null;
    }

    if (!map) {
      return null;
    }

    const keysTitles = {
      driving: t("vacancies_additional_skills_key_titles_driving"),
      motorcycling: t("vacancies_additional_skills_key_titles_motorcycling"),
      cooking: t("vacancies_additional_skills_key_titles_cooking"),
      photo_video: t("vacancies_additional_skills_key_titles_photo_video")
    };

    const valuesTitles = {
      must: t("vacancies_additional_skills_value_titles_must"),
      desirable: t("vacancies_additional_skills_value_titles_desirable"),
      advantage: t("vacancies_additional_skills_value_titles_advantage")
    };

    return (
      <Block title={t("vacancies_additional_skills_block_label")}>
        <Matrix
          keyTitles={keysTitles}
          valueTitles={valuesTitles}
          map={map}
          columns={2}
        />
      </Block>
    );
  }

  renderConditions() {
    const { t } = this.props;
    const vacancy = this.getVacancy();

    const map = prepareMap(vacancy.frontmatter.conditions);

    if (Object.keys(map).length === 0) {
      return null;
    }

    const titles = {
      food: t("vacancies_conditions_titles_food"),
      place_to_stay: t("vacancies_conditions_titles_place_to_stay"),
      tickets_two_ways: t("vacancies_conditions_titles_tickets_two_ways"),
      tickets_one_way: t("vacancies_conditions_titles_tickets_one_way"),
      travel_compensations: t(
        "vacancies_conditions_titles_travel_compensations"
      ),
      payment: t("vacancies_conditions_titles_payment"),
      salary: t("vacancies_conditions_titles_salary"),
      home: t("vacancies_conditions_titles_home")
    };

    return (
      <Block title={t("vacancies_conditions_block_label")}>
        <Features titles={titles} map={map} columns={2} />
      </Block>
    );
  }

  renderOtherConditions() {
    const { t } = this.props;

    const vacancy = this.getVacancy();

    const map = prepareMap(vacancy.frontmatter.other_conditions);

    if (
      Object.keys(map).length === 0 &&
      !vacancy.frontmatter.other_conditions_custom
    ) {
      return null;
    }

    const titles = {
      night_shifts: t("vacancies_other_conditions_titles_night_shifts"),
      emergencies: t("vacancies_other_conditions_titles_emergencies"),
      house_calls: t("vacancies_other_conditions_titles_house_calls"),
      patient_escort_to_the_hospital: t(
        "vacancies_other_conditions_titles_patient_escort_to_the_hospital"
      ),
      stuff_organization: t(
        "vacancies_other_conditions_titles_stuff_organization"
      ),
      statistics_conducting: t(
        "vacancies_other_conditions_titles_statistics_conducting"
      ),
      accounting_of_medicines: t(
        "vacancies_other_conditions_titles_accounting_of_medicines"
      ),
      drugstore_logistics: t(
        "vacancies_other_conditions_titles_drugstore_logistics"
      ),
      providing_of_lectures: t(
        "vacancies_other_conditions_titles_providing_of_lectures"
      ),
      pr_within_community: t(
        "vacancies_other_conditions_titles_pr_within_community"
      ),
      spanish_classes: t("vacancies_other_conditions_titles_spanish_classes"),
      cleaning: t("vacancies_other_conditions_titles_cleaning"),
      domestic_purchases: t(
        "vacancies_other_conditions_titles_domestic_purchases"
      )
    };

    return (
      <Block title={t("vacancies_other_conditions_block_label")}>
        <Features
          titles={titles}
          map={map}
          columns={2}
          custom={vacancy.frontmatter.other_conditions_custom}
        />
      </Block>
    );
  }

  renderBody() {
    const vacancy = this.getVacancy();

    return <MarkdownContent html={vacancy.html} />;
  }

  renderSubmitButton() {
    const { t } = this.props;
    const vacancy = this.getVacancy();
    const { frontmatter } = vacancy;

    if (!frontmatter.questionnaire_link) {
      return null;
    }

    return (
      <div className={styles.submitFormButton}>
        <a href={frontmatter.questionnaire_link} target="_blank">
          {t("vacancies_submit_form_button")}
        </a>
      </div>
    );
  }

  render() {
    return (
      <Layout location={this.props.location}>
        <div className={styles.root}>
          {this.renderTitle()}
          {this.renderPlace()}
          {this.renderShortDescription()}
          {this.renderImage()}
          {this.renderMainRequirements()}
          {this.renderLanguages()}
          {this.renderAdditionalSkills()}
          {this.renderConditions()}
          {this.renderOtherConditions()}
          {this.renderAids()}
          {this.renderBody()}
          {this.renderSubmitButton()}
        </div>
      </Layout>
    );
  }
}

export default withI18n(Vacancies);

export const query = graphql`
  query VacancyPostQuery($slug: String!) {
    markdownRemark(
      fields: { slug: { eq: $slug }, collection: { eq: "vacancies" } }
      frontmatter: { is_hidden: { ne: true } }
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
        term_custom
        work_time
        rest_time
        aids_transportation
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
        questionnaire_link
      }
    }
  }
`;
