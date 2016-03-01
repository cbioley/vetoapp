import * as vetosActions from '../../common/vetos/actions';
import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import React, { PropTypes } from 'react';
import Textarea from 'react-textarea-autosize';
import countries from './countries';
import focusInvalidField from '../lib/focusInvalidField';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { fields } from '../../common/lib/redux-fields';
import { replace } from 'react-router-redux';

const CountriesOptions = countries.map(({ name, code }) =>
  <option key={code} value={code}>{name}</option>
);

class SuggestVeto extends Component {

  static propTypes = {
    fields: PropTypes.object.isRequired,
    msg: PropTypes.object.isRequired,
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
    const result = await suggestVeto(fields.$values()).payload.promise;
    if (result.error) {
      focusInvalidField(this, result.payload);
      return;
    }
    fields.$reset();
    // TODO: Use veto id for redirect.
    // http://localhost:8000/vetos/4k9IjZCje
    replace('vetos');
  }

  render() {
    const { fields, msg, vetos, viewer } = this.props;

    return (
      <div className="suggest-veto">
        <Helmet title={msg.app.links.suggestVeto} />
        <div className="row">
          <div className="col-md-8">
            <form onSubmit={this.onFormSubmit}>
              <fieldset className="form-group" disabled={vetos.suggestVetoFormDisabled}>
                <fieldset className="form-group">
                  <label htmlFor="suggest-veto-name">
                    Který zákon je tak strašný, že je třeba jej vetovat?
                  </label>
                  <input
                    className="form-control"
                    id="suggest-veto-name"
                    maxLength="1000"
                    placeholder="Zákon o ..."
                    {...fields.name}
                  />
                  <small className="text-muted">
                    <a target="_blank" href="http://www.zakonyprolidi.cz">
                      zakonyprolidi.cz
                    </a>
                  </small>
                </fieldset>
                <fieldset className="form-group">
                  <label htmlFor="suggest-veto-reason">
                    Proč je třeba zákon vetovat?
                  </label>
                  <Textarea
                    className="form-control"
                    id="suggest-veto-reason"
                    maxLength="1000"
                    maxRows={10}
                    minRows={3}
                    placeholder={
                      'Zákon porušuje cs.wikipedia.org/wiki/Princip_neagrese'
                    }
                    useCacheForDOMMeasurements
                    {...fields.reason}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <label htmlFor="suggest-veto-country">V které zemi?</label>
                  <select
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
                  >Odeslat</button>
                :
                  <Link className="btn btn-info btn-lg m-b-1" to="/login">
                    Přihlásit se
                  </Link>
                }
              </fieldset>
            </form>
            {vetos.suggestVetoFormError &&
              <div className="alert alert-danger" role="alert">
                {vetos.suggestVetoFormError.message}
              </div>
            }
          </div>
        </div>
      </div>
    );
  }

}

SuggestVeto = fields(SuggestVeto, {
  path: 'suggestVeto',
  fields: ['name', 'reason', 'country'],
  getInitialState: () => ({ country: 'CZ' })
});

export default connect(state => ({
  msg: state.intl.msg,
  vetos: state.vetos,
  viewer: state.users.viewer
}), { ...vetosActions, replace })(SuggestVeto);
