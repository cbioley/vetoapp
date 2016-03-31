// eslint-disable react/jsx-no-bind
import * as intlActions from '../../common/intl/actions';
import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

// TODO: Refactor.
// import { FormattedMessage, defineMessages } from 'react-intl';
// const messages = defineMessages({
//   czech: {
//     defaultMessage: 'czech',
//     id: 'about.tldr'
//   },
//   english: {
//     defaultMessage: 'english',
//     id: 'about.english'
//   }
// });

class LocaleSwitch extends Component {

  static propTypes = {
    currentLocale: PropTypes.string.isRequired,
    setCurrentLocale: PropTypes.func.isRequired
  };

  render() {
    const { currentLocale, setCurrentLocale } = this.props;

    return (
      <span>
        <span className="text-muted">{
          currentLocale === 'en' ? 'english' : 'čeština'
        }</span>
        {' · '}
        <a
          href="#"
          onClick={e => {
            e.preventDefault();
            const locale = currentLocale === 'en' ? 'cs' : 'en';
            setCurrentLocale(locale);
          }}
        >
          {currentLocale === 'en' ? 'čeština' : 'english'}
        </a>
      </span>
    );
  }

}

export default connect(state => ({
  currentLocale: state.intl.currentLocale,
  locales: state.intl.locales
}), intlActions)(LocaleSwitch);

