import './Locales.scss';
import * as intlActions from '../../common/intl/actions';
import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

class Locales extends Component {

  static propTypes = {
    currentLocale: PropTypes.string.isRequired,
    // locales: PropTypes.arrayOf(React.PropTypes.string),
    setCurrentLocale: PropTypes.func.isRequired
  };

  render() {
    const { currentLocale, setCurrentLocale } = this.props;

    return (
      <div className="locales">
        {/* TODO: Generate flags from server config. */}
        <button
          className="btn btn-secondary"
          type="button"
          disabled={currentLocale === 'en'}
          onClick={() => setCurrentLocale('en')} // eslint-disable-line react/jsx-no-bind
        >
          <div
            style={{ width: 50, height: 50 }}
            className="flag flag-icon-background flag-icon-us"
            title="us"
          ></div>
        </button>
        <button
          className="btn btn-secondary"
          type="button"
          disabled={currentLocale === 'cs'}
          onClick={() => setCurrentLocale('cs')} // eslint-disable-line react/jsx-no-bind
        >
          <div
            style={{ width: 50, height: 50 }}
            className="flag flag-icon-background flag-icon-cz"
            title="cz"
          ></div>
        </button>
      </div>
    );
  }

}

export default connect(state => ({
  currentLocale: state.intl.currentLocale,
  locales: state.intl.locales
}), intlActions)(Locales);

