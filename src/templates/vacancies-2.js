import React from "react";
import { graphql } from "gatsby";
import MarkdownContent from "../components/MarkdownContent";
import cn from "classnames";

import { withI18n } from "../i18n";
import { format } from "../helpers/date";
import Layout from "../components/layouts/default";
import styles from "./vacancies-2.module.scss";
import config from "../../content/configs/vacancies.json";

const handlers = {
  note: note => (
    <span className={styles.note}>
      *<div>{note}</div>
    </span>
  ),
  link: (text, url) => <a href={url}>{text}</a>
};

function capitalizeFirstLetter(text) {
  return text.substr(0, 1).toLocaleLowerCase() + text.substr(1)
}

function prepareText(text) {
  let children = [];

  let rest = text || "";
  let match;
  while ((match = rest.match(/^(.*?)\[(.+?)\|(.+?)\](.*)$/))) {
    const [_, prefix, tag, tagBody, postfix] = match;
    const [tagName, ...params] = tag.split(":");
    children.push(prefix);
    if (handlers[tagName]) {
      children.push(handlers[tagName](tagBody, params));
    }
    rest = postfix;
  }
  children.push(rest);

  return React.createElement("span", null, ...children);
}

class Vacancies2 extends React.Component {
  getData() {
    return this.props.data.markdownRemark;
  }

  renderTitle(data) {
    return <h1 className={styles.title}>{data.frontmatter.title}</h1>;
  }

  renderShortDescription(data) {
    return (
      <p className={cn(styles.plainText, styles.shortDescription)}>
        {data.frontmatter.short_description}
      </p>
    );
  }

  renderImage(data) {
    return <img src={data.frontmatter.image} className={styles.image} />;
  }


  renderAdvantages(data, config) {
    const { t, language } = this.props;
    return (
      <>
        <h2 className={styles.subtitle}>{t("vacancies_2_advantages")}</h2>
        <ul className={styles.featureList}>
          {config.advantages.map(x => (
            <li className={cn(styles.plainText)} key={x.name}>
              {prepareText(capitalizeFirstLetter(x[language]))}
            </li>
          ))}
          {data.frontmatter.custom_advantages.map((text, i) => (
            <li className={cn(styles.plainText)} key={i}>
              {prepareText(capitalizeFirstLetter(text))}
            </li>
          ))}
        </ul>
      </>
    );
  }

  renderSupplies(data, config) {
    const { t, language } = this.props;
    return (
      <div>
        <h2 className={styles.subtitle}>{t("vacancies_2_supplies")}</h2>
        <ul className={styles.featureList}>
          {config.supplies.map(x => (
            <li className={cn(styles.plainText)} key={x.name}>
              {prepareText(capitalizeFirstLetter(x[language]))}
            </li>
          ))}
          {data.frontmatter.custom_supplies.map((text, i) => (
            <li className={cn(styles.plainText)} key={i}>
              {prepareText(capitalizeFirstLetter(text))}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  renderDuties(data, config) {
    const { t, language } = this.props;
    return (
      <div>
        <h2 className={styles.subtitle}>{t("vacancies_2_duties")}</h2>
        <h3 className={cn(styles.plainText, styles.subsubtitle)}>{t("vacancies_2_duties_common")}</h3>
        <ul className={styles.featureList}>
          {config.duties.map(x => (
            <li className={cn(styles.plainText)} key={x.name}>
              {prepareText(capitalizeFirstLetter(x[language]))}
            </li>
          ))}
        </ul>
        <h3 className={cn(styles.plainText, styles.subsubtitle)}>
          {t("vacancies_2_duties_professional")}
        </h3>
        <ul className={styles.featureList}>
          {data.frontmatter.custom_duties.map((text, i) => (
            <li className={cn(styles.plainText)} key={i}>
              {prepareText(capitalizeFirstLetter(text))}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  renderRequirements(data, config) {
    const { t, language } = this.props;
    return (
      <div>
        <h2 className={styles.subtitle}>{t("vacancies_2_requirements")}</h2>
        <ul className={styles.featureList}>
          {config.requirements.map(x => (
            <li className={cn(styles.plainText)} key={x.name}>
              {prepareText(capitalizeFirstLetter(x[language]))}
            </li>
          ))}
          {data.frontmatter.professional_requirements.map((text, i) => (
            <li className={cn(styles.plainText)} key={i}>
              {prepareText(capitalizeFirstLetter(text))}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  renderPlace(data) {
    const { t } = this.props;
    const { place } = data.frontmatter;

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

    return (
      <span className={cn(styles.plainText, styles.place)}>
        {t("vacancies_2_place")}{" "}
        <b className={styles.value}>{prepareText(placeTitle)}</b>
      </span>
    );
  }

  renderTerm(data) {
    const { t } = this.props;
    const { frontmatter } = data;

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

    return (
      <span className={cn(styles.plainText, styles.term)}>
        {t("vacancies_2_duration")}{" "}
        <b className={styles.value}>{prepareText(text)}</b>
      </span>
    );
  }

  renderCost(data) {
    const { t } = this.props;
    const { frontmatter } = data;
    return (
      <span className={cn(styles.plainText, styles.cost)}>
        {t("vacancies_2_cost")}{" "}
        <b className={styles.value}>
          {prepareText(frontmatter.cost || t("vacancies_2_cost_free"))}
        </b>
      </span>
    );
  }

  renderSubmitButton(data) {
    const { t } = this.props;
    const { frontmatter } = data;

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

  renderFinalText(data) {
    const { t } = this.props;
    return (
      <p className={cn(styles.plainText, styles.finalText)}>
        {t("vacancies_2_final_text")}
      </p>
    );
  }

  renderBody() {
    const data = this.getData();

    return <MarkdownContent html={data.html} />;
  }

  render() {
    const data = this.getData();

    return (
      <Layout location={this.props.location}>
        <div className={styles.root}>
          {this.renderTitle(data)}
          {this.renderShortDescription(data)}
          {this.renderImage(data)}
          <p className={styles.plainText}>
            {this.renderPlace(data)}
            <br />
            {this.renderTerm(data)}
            <br />
            {this.renderCost(data)}
            <br />
          </p>
          {this.renderAdvantages(data, config)}
          {this.renderSupplies(data, config)}
          {this.renderDuties(data, config)}
          {this.renderRequirements(data, config)}
          {this.renderBody()}
          {this.renderFinalText()}
          {this.renderSubmitButton(data)}
        </div>
      </Layout>
    );
  }
}

export default withI18n(Vacancies2);

export const query = graphql`
  query Vacancy2PostQuery($slug: String!) {
    markdownRemark(
      fields: { slug: { eq: $slug }, collection: { eq: "vacancies" } }
      frontmatter: { is_hidden: { ne: true } }
    ) {
      html
      frontmatter {
        title
        place
        term
        short_description
        image
        custom_advantages
        custom_supplies
        custom_duties
        professional_requirements
        questionnaire_link
      }
    }
  }
`;
