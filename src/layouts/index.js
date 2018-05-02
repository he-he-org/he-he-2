import React from 'react'
import Link from "gatsby-link";

export default ({ children }) => (
  <div>
    <div>
      <Link style={{ marginRight: 20 }} to="/">Main</Link>
      <Link style={{ marginRight: 20 }} to="/blog/">Blog</Link>
      <Link style={{ marginRight: 20 }} to="/vacancies/">Vacancies</Link>
    </div>
    <hr/>
    <div>
      {children()}
    </div>
  </div>
)
