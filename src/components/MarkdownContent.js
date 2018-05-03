import React from "react"
import styles from './MarkdownContent.module.scss';

class MarkdownContent extends React.Component {
  render() {
    return (
      <div className={styles.root} dangerouslySetInnerHTML={{ __html: this.props.html }} />
    )
  }
}

export default MarkdownContent

