import React from "react";

// import styles from './I18nWidget.module.scss';
import styles from "./I18nWidget.styles";
import { List } from "immutable";

const ruToEn = ["фисвуапршолдьтщзйкыегмцчня", "abcdefghijklmnopqrstuvwxyz"];
const enToRu = [
  "f,dult`;pbqrkvyjghcnea[wxio]sm'.z",
  "абвгдеёжзийклмнопрстуфхцчшщъыьэюя"
];

function fixString(str, mapping) {
  return str
    .split("")
    .map(x => {
      return mapping[1][mapping[0].indexOf(x)] || x;
    })
    .join("");
}

export default class extends React.Component {
  state = {
    search: ""
  };

  renderSearch() {
    return (
      <div style={styles.search}>
        <span>Search: </span>
        <input
          style={styles.searchInput}
          onChange={e => {
            this.setState({ search: e.target.value });
          }}
          value={this.state.search}
        />
      </div>
    );
  }

  handleChangeText(key, field, value) {
    const newValue = this.props.value.toJS().map(item => {
      if (item.key === key) {
        return {
          ...item,
          [field]: value
        };
      }
      return item;
    });
    this.props.onChange(List(newValue));
  }

  renderItem(item) {
    return (
      <div key={item.key} style={styles.item}>
        <div style={styles.itemKey}>{item.key}</div>
        <div style={styles.itemText}>
          <span style={styles.itemTextSpan}>English:</span>
          <input
            style={styles.itemTextInput}
            onChange={e =>
              this.handleChangeText(item.key, "en", e.target.value)
            }
            type="text"
            value={item.en}
          />
        </div>
        <div style={styles.itemText}>
          <span style={styles.itemTextSpan}>Russian:</span>
          <input
            style={styles.itemTextInput}
            onChange={e =>
              this.handleChangeText(item.key, "ru", e.target.value)
            }
            type="text"
            value={item.ru}
          />
        </div>
        <div style={styles.itemText}>
          <span style={styles.itemTextSpan}>Spanish:</span>
          <input
            style={styles.itemTextInput}
            onChange={e =>
              this.handleChangeText(item.key, "es", e.target.value)
            }
            type="text"
            value={item.es}
          />
        </div>
      </div>
    );
  }

  renderItems(items) {
    const { search } = this.state;

    return items
      .filter(item => {
        if (search === "") {
          return true;
        }

        return Object.values(item).some(value => {
          let valueLower = value.toLowerCase();
          let searchLower = search.toLowerCase();
          return (
            valueLower.includes(searchLower) ||
            valueLower.includes(fixString(searchLower, ruToEn)) ||
            valueLower.includes(fixString(searchLower, enToRu))
          );
        });
      })
      .map(item => this.renderItem(item));
  }

  render() {
    const { value, field } = this.props;

    return (
      <div style={styles.root}>
        {this.renderSearch()}
        {this.renderItems(value.toJS())}
      </div>
    );
  }
}
