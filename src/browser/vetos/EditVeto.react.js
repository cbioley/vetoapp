import * as vetosActions from '../../common/vetos/actions';
import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import React, { PropTypes } from 'react';
import Textarea from 'react-textarea-autosize';
import ValidationError from '../../common/app/ValidationError.react';
import buttonsMessages from '../../common/app/buttonsMessages';
import confirmMessages from '../../common/app/confirmMessages';
import focusInvalidField from '../../common/lib/validation/focusInvalidField';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { fields } from '../../common/lib/redux-fields';
import { replace } from 'react-router-redux';

class EditVeto extends Component {

  static propTypes = {
    deleteVeto: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    replace: PropTypes.func.isRequired,
    saveVeto: PropTypes.func.isRequired,
    veto: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.onCancelClick = this.onCancelClick.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onSaveClick = this.onSaveClick.bind(this);
  }

  onCancelClick() {
    const { intl } = this.props;
    if (!this.isDirty()) {
      this.cancelEdit();
      return;
    }
    const unsavedChanges = intl.formatMessage(confirmMessages.unsavedChanges);
    if (confirm(unsavedChanges)) { // eslint-disable-line no-alert
      this.cancelEdit();
    }
  }

  onDeleteClick() {
    const { deleteVeto, fields, intl, replace, veto } = this.props;
    const areYouSure = intl.formatMessage(confirmMessages.areYouSure);
    if (!confirm(areYouSure)) return; // eslint-disable-line no-alert
    deleteVeto(veto.toJS());
    fields.$reset();
    replace('/vetos');
  }

  onFormSubmit(e) {
    e.preventDefault();
  }

  async onSaveClick() {
    const { fields, saveVeto, veto } = this.props;
    if (!this.isDirty()) {
      this.cancelEdit();
      return;
    }
    const { name, reason } = fields.$values();
    const json = veto.merge({ name, reason }).toJS();
    const result = await saveVeto(json).payload.promise;
    if (result.error) {
      fields.error.setValue(result.payload);
      focusInvalidField(this, result.payload);
      return;
    }
    this.cancelEdit();
  }

  cancelEdit() {
    const { fields, replace, veto } = this.props;
    fields.$reset();
    replace(`/vetos/${veto.id}`);
  }

  isDirty() {
    const { fields, veto } = this.props;
    return !(
      fields.name.value === veto.name &&
      fields.reason.value === veto.reason
    );
  }

  render() {
    const { fields, veto } = this.props;

    return (
      <div className="edit">
        <Helmet title={veto.name} />
        <form onSubmit={this.onFormSubmit}>
          <input
            className="form-control"
            maxLength="1000"
            {...fields.name}
          />
          <br />
          <Textarea
            // Important. When textarea is not inside a form, React
            // has a serious rendering problems.
            className="form-control"
            maxLength="10000"
            maxRows={100}
            minRows={3}
            useCacheForDOMMeasurements
            {...fields.reason}
          />
          <br />
          <button
            type="button"
            className="btn btn-primary"
            onClick={this.onSaveClick}
          ><FormattedMessage {...buttonsMessages.save} /></button>
          {' '}
          <button
            type="button"
            className="btn btn-success"
            onClick={this.onCancelClick}
          ><FormattedMessage {...buttonsMessages.cancel} /></button>
          {' '}
          <button
            type="button"
            className="btn btn-warning"
            onClick={this.onDeleteClick}
          ><FormattedMessage {...buttonsMessages.delete} /></button>
        </form>
        <br />
        {fields.error.value &&
          <ValidationError error={fields.error.value} />
        }
      </div>
    );
  }

}

EditVeto = injectIntl(EditVeto);

EditVeto = fields(EditVeto, {
  path: ({ veto }) => ['vetos', veto.id],
  fields: ['name', 'reason', 'error'],
  getInitialState: ({ veto }) => veto.toJS()
});

export default connect(null, { ...vetosActions, replace })(EditVeto);
