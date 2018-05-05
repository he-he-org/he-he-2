import React from "react"
import styles from './ItemPreview.module.scss';
import Link from "gatsby-link";

class ItemPreview extends React.Component {
  renderImage() {
    if (!this.props.image) {
      return null;
    }

    return (
      <div
        className={styles.image}
        style={{ backgroundImage: `url(${this.props.image})` }}
      >
        {this.props.title}
      </div>
    )
  }

  render() {
    return (
      <Link className={styles.root} to={this.props.url}>
        {this.renderImage()}
        {this.props.children && (
          <div className={styles.body}>
            {this.props.children}
          </div>
        )}
      </Link>
    )
  }
}

export default ItemPreview
