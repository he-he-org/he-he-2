import React from "react"
import Link from "gatsby-link";

import styles from "./index.module.css";

export default () => {
  return (
    <div>
      <h1>Hi!</h1>
      <Link to="/blog/" className={styles.link}>Blog</Link>
    </div>
  );
}
