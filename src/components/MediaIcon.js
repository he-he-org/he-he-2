import React from "react"
import styles from './MediaIcon.module.scss';
import { Link } from "gatsby";

class MediaIcon extends React.Component {
  render() {
    return (
      <a
        className={styles.root}
        target="_blank"
        href={this.props.url}
      >
        <img
          alt={this.props.image}
          width="32"
          height="32"
          className={styles.image}
          src={this.props.image}
        />
      </a>
    )
  }
}

export default MediaIcon
