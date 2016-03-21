import * as vetosActions from '../../common/vetos/actions';
import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import React, { PropTypes } from 'react';
import Textarea from 'react-textarea-autosize';
import ValidationError from '../../common/app/ValidationError.react';
import buttonsMessages from '../../common/app/buttonsMessages';
import countries from './countries';
import focusInvalidField from '../../common/lib/validation/focusInvalidField';
import linksMessages from '../../common/app/linksMessages';
import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { fields } from '../../common/lib/redux-fields';
import { replace } from 'react-router-redux';

const CountriesOptions = countries.map(({ name, code }) =>
  <option key={code} value={code}>{name}</option>
);

const messages = defineMessages({
  nameLabel: {
    defaultMessage: 'Which the law is so bad it should be vetoed?',
    id: 'vetos.suggestVeto.nameLabel'
  },
  namePlaceholder: {
    defaultMessage: 'The law about...',
    id: 'vetos.suggestVeto.namePlaceholder'
  },
  reasonLabel: {
    defaultMessage: 'Why the law should be vetoed?',
    id: 'vetos.suggestVeto.reasonLabel'
  },
  reasonPlaceholder: {
    defaultMessage: 'The law violates en.wikipedia.org/wiki/Non-aggression_principle',
    id: 'vetos.suggestVeto.reasonPlaceholder'
  },
  whichCountry: {
    defaultMessage: 'In which country?',
    id: 'vetos.suggestVeto.whichCountry'
  }
});

class SuggestVetoPage extends Component {

  static propTypes = {
    currentLocale: PropTypes.string.isRequired,
    fields: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    replace: PropTypes.func.isRequired,
    suggestVeto: PropTypes.func.isRequired,
    vetos: PropTypes.object.isRequired,
    viewer: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  async onFormSubmit(e) {
    e.preventDefault();
    const { fields, replace, suggestVeto } = this.props;
    const values = fields.$values();
    const result = await suggestVeto(values).payload.promise;
    if (result.error) {
      focusInvalidField(this, result.payload);
      return;
    }
    fields.$reset();
    replace(`vetos/${result.payload.id}`);
  }

  render() {
    const { currentLocale, fields, intl, vetos, viewer } = this.props;
    const title = intl.formatMessage(linksMessages.suggestVeto);

    return (
      <div className="suggest-veto">
        <Helmet title={title} />
        <div className="row">
          <div className="col-md-10">
            <form onSubmit={this.onFormSubmit}>
              <fieldset className="form-group" disabled={vetos.suggestVetoFormDisabled}>
                <fieldset className="form-group">
                  <label htmlFor="suggest-veto-name">
                    <FormattedMessage {...messages.nameLabel} />
                  </label>
                  <input
                    className="form-control"
                    id="suggest-veto-name"
                    maxLength="1000"
                    placeholder={intl.formatMessage(messages.namePlaceholder)}
                    {...fields.name}
                  />
                  {currentLocale === 'cs' &&
                    <small className="text-muted">
                      <a target="_blank" href="http://www.zakonyprolidi.cz">
                        zakonyprolidi.cz
                      </a>
                    </small>
                  }
                </fieldset>
                <fieldset className="form-group">
                  <label htmlFor="suggest-veto-reason">
                    <FormattedMessage {...messages.reasonLabel} />
                  </label>
                  <Textarea
                    className="form-control"
                    id="suggest-veto-reason"
                    maxLength="10000"
                    maxRows={100}
                    minRows={3}
                    placeholder={intl.formatMessage(messages.reasonPlaceholder)}
                    useCacheForDOMMeasurements
                    {...fields.reason}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <label htmlFor="suggest-veto-country">
                    <FormattedMessage {...messages.whichCountry} />
                  </label>
                  <select
                    // TODO: Use value for preselect country.
                    className="form-control c-select"
                    style={{ display: 'block', maxWidth: '25em' }}
                    id="suggest-veto-country"
                    {...fields.country}
                  >{CountriesOptions}</select>
                </fieldset>
                {viewer ?
                  <button
                    type="submit"
                    className="btn btn-primary"
                  ><FormattedMessage {...buttonsMessages.submit} /></button>
                :
                  <Link
                    className="btn btn-primary"
                    to={{
                      pathname: '/login',
                      state: { nextPathname: 'suggest-veto' }
                    }}
                  >
                    <FormattedMessage {...buttonsMessages.submit} />
                  </Link>
                }
              </fieldset>
            </form>
            <ValidationError error={vetos.suggestVetoFormError} />
          </div>
        </div>
      </div>
    );
  }

}

SuggestVetoPage = fields(SuggestVetoPage, {
  path: 'suggestVeto',
  fields: ['name', 'reason', 'country'],
  // TODO: Detect from intl.currentLocale.
  getInitialState: () => ({ country: 'CZ' })
});

SuggestVetoPage = injectIntl(SuggestVetoPage);

export default connect(state => ({
  currentLocale: state.intl.currentLocale,
  vetos: state.vetos,
  viewer: state.users.viewer
}), { ...vetosActions, replace })(SuggestVetoPage);
