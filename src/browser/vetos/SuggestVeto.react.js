import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import React, { PropTypes } from 'react';
import Textarea from 'react-textarea-autosize';
import countries from './countries';
import { connect } from 'react-redux';
import { fields } from '../../common/lib/redux-fields';

class SuggestVeto extends Component {

  static propTypes = {
    fields: PropTypes.object.isRequired,
    msg: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.countries = countries.map(({ name, code }) => ({ name, code }));
  }

  onFormSubmit(e) {
    e.preventDefault();
    // const { fields } = this.props;
    alert('In progress. Stay tuned!'); // eslint-disable-line no-alert
  }

  render() {
    const { fields, msg } = this.props;

    return (
      <div className="suggest-veto">
        <Helmet title={msg.app.links.suggestVeto} />
        <div className="row">
          <div className="col-md-8">
            <form onSubmit={this.onFormSubmit}>
              <fieldset disabled={false}>
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
                    minRows={2}
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
                    className="form-control"
                    id="suggest-veto-country"
                    {...fields.country}
                  >
                    {countries.map(({ name, code }) =>
                      <option key={code} value={code}>{name}</option>
                    )}
                  </select>
                </fieldset>
                <button
                  type="submit"
                  className="btn btn-primary"
                >{msg.app.links.suggestVeto}</button>
              </fieldset>
            </form>
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
  msg: state.intl.msg
}))(SuggestVeto);
