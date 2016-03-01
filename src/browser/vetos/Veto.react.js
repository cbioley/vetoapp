// import * as vetosActions from '../../common/vetos/actions';
import Component from 'react-pure-render/component';
// import Helmet from 'react-helmet';
import React, { PropTypes } from 'react';
// import Textarea from 'react-textarea-autosize';
// import countries from './countries';
// import focusInvalidField from '../lib/focusInvalidField';
import { connect } from 'react-redux';
// import { fields } from '../../common/lib/redux-fields';

// const CountriesOptions = countries.map(({ name, code }) =>
//   <option key={code} value={code}>{name}</option>
// );

class Veto extends Component {

  static propTypes = {
    veto: PropTypes.object
  };

  // constructor(props) {
  //   super(props);
  //   // this.onFormSubmit = this.onFormSubmit.bind(this);
  // }

  // async onFormSubmit(e) {
  //   e.preventDefault();
  //   const { fields, suggestVeto } = this.props;
  //   const result = await suggestVeto(fields.$values()).payload.promise;
  //   if (result.error) {
  //     focusInvalidField(this, result.payload);
  //   }
  // }

  render() {
    return (
      <div className="veto-detail">
        Soon.
      </div>
    );
  }

}

// SuggestVeto = fields(SuggestVeto, {
//   path: 'suggestVeto',
//   fields: ['name', 'reason', 'country'],
//   getInitialState: () => ({ country: 'CZ' })
// });

export default connect(state => ({
  msg: state.intl.msg
  // veto: state.vetos
}))(Veto);
