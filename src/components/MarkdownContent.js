import React from "react"
import styles from './MarkdownContent.module.scss';
import Cheerio from 'cheerio';

import Hypher from 'hypher';
import HypherEnglishRules from 'hyphenation.en-us';
import HypherRussianRules from 'hyphenation.ru';
const hEn = new Hypher(HypherEnglishRules);
const hRu = new Hypher(HypherRussianRules);

const addHyphens = (text) => {
  return hRu.hyphenateText(hEn.hyphenateText(text))
};

class MarkdownContent extends React.Component {
  render() {
    const $ = Cheerio.load(this.props.html);
    const changeDom = (i, el) => {
      if (el.type === 'text') {
        return el.data = addHyphens(el.data);
      } else if (el.type === 'tag' || el.type === 'root') {
        return $(el).contents().each(changeDom)
      }
      return el;
    };
    $.root().each(changeDom);
    const newHtml = $("body").html();

    return (
      <div className={styles.root} dangerouslySetInnerHTML={{ __html: newHtml }} />
    )
  }
}

export default MarkdownContent

