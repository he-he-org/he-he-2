import React from "react";

// import styles from './I18nWidget.module.scss';
import { def } from "netlify-cms";
import styles from "./I18nWidget.styles";
import { List } from "immutable";
import String from "netlify-cms-widget-string";
import PropTypes from "prop-types";
console.log("String", String);

const Component = String.controlComponent;

function serialize() {
  return List(newValue);
}

function deserialize(value) {
  return value ? value.toJS() : [];
}

export default class extends React.Component {
  getValue = () => {
    return deserialize(this.props.value);
  };

  handleChange = newValue => {
    this.props.onChange(List(newValue));
  };

  handleDelete = i => {
    const value = this.getValue();
    this.handleChange([...value.slice(0, i), ...value.slice(i + 1)]);
  };

  handleChangeItem = (i, text) => {
    const value = this.getValue();
    this.handleChange(value.map((item, j) => (i === j ? text : item)));
  };

  handleAdd = () => {
    this.handleChange([...this.getValue(), ""]);
  };

  render() {
    return (
      <div style={styles.root}>
        {this.getValue().map((x, i) => (
          <div key={i} style={styles.item}>
            <input
              className={this.props.classNameWrapper}
              style={styles.input}
              value={x}
              onChange={e => this.handleChangeItem(i, e.target.value)}
            />
            <button
              className={this.props.classNameWrapper}
              style={styles.deleteButton}
              onClick={() => this.handleDelete(i)}
            >
              Delete
            </button>
          </div>
        ))}
        <button
          className={this.props.classNameWrapper}
          onClick={this.handleAdd}
        >
          Add
        </button>
      </div>
    );
  }
}
