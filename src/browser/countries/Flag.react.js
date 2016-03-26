import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';

export default class Flag extends Component {

  static propTypes = {
    country: PropTypes.string.isRequired
  };

  render() {
    const { country } = this.props;

    return (
      <span
        className={`flag flag-icon flag-icon-${country.toLowerCase()}`}
        title={country.toUpperCase()}
      />
    );
  }

}
