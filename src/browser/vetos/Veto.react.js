import * as vetosActions from '../../common/vetos/actions';
import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import Linkify from 'react-linkify';
import Loading from '../lib/Loading.react';
import React, { PropTypes } from 'react';
import Textarea from 'react-textarea-autosize';
import Vote from '../../common/vetos/Vote';
import focusInvalidField from '../lib/focusInvalidField';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { fields } from '../../common/lib/redux-fields';
import { queryFirebase } from '../../common/lib/redux-firebase';
import { replace } from 'react-router-redux';

// TODO: Refactor to view, edit, vote etc components.
class Veto extends Component {

  static propTypes = {
    deleteVeto: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    saveVeto: PropTypes.func.isRequired,
    veto: PropTypes.object,
    viewer: PropTypes.object,
    vote: PropTypes.object,
    voteVeto: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.onCancelClick = this.onCancelClick.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.onEditClick = this.onEditClick.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onSaveClick = this.onSaveClick.bind(this);
    this.onVetoCancelClick = this.onVetoCancelClick.bind(this);
    this.onVetoClick = this.onVetoClick.bind(this);
  }

  onCancelClick() {
    const { fields } = this.props;
    if (!this.isDirty()) {
      fields.$reset();
      return;
    }
    if (confirm('You have unsaved changes. Are you sure?')) { // eslint-disable-line no-alert
      fields.$reset();
    }
  }

  onDeleteClick() {
    const { deleteVeto, replace, veto } = this.props;
    if (!confirm('Are you sure?')) return; // eslint-disable-line no-alert
    deleteVeto(veto.toJS());
    replace('vetos');
  }

  onEditClick() {
    const { fields } = this.props;
    fields.isEdited.setValue(true);
  }

  onFormSubmit(e) {
    e.preventDefault();
  }

  async onSaveClick() {
    const { fields, saveVeto, veto } = this.props;
    if (!this.isDirty()) {
      fields.$reset();
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
    fields.$reset();
  }

  onVetoCancelClick() {
    const { veto, voteVeto } = this.props;
    voteVeto(veto.id, false);
  }

  onVetoClick() {
    const { veto, voteVeto } = this.props;
    voteVeto(veto.id, true);
  }

  isDirty() {
    const { fields, veto } = this.props;
    return !(
      fields.name.value === veto.name &&
      fields.reason.value === veto.reason
    );
  }

  render() {
    const { fields, veto, viewer, vote } = this.props;
    const isViewerVeto = veto && viewer && viewer.id === veto.creatorId;

    return (
      <div className="veto-detail">
        <div className="row">
          <div className="col-md-10">
            {veto === undefined ?
              <Loading />
            : !veto ?
              <p>This veto doesn't exists.</p>
            :
              <div>
                <Helmet title={veto.name} />
                {!fields.isEdited.value ?
                  <div className="view">
                    <h2>{veto.name}</h2>
                    <p>
                      <Linkify properties={{ target: '_blank' } }>
                        {veto.reason}
                      </Linkify>
                    </p>
                    {!viewer ?
                      <div className="alert alert-info" role="alert">
                        Pokud se chcete k zákonu vyjádřit, musíte se <b>
                        <Link to={{
                          pathname: '/login',
                          state: { nextPathname: `vetos/${veto.id}` }
                        }}
                        >přihlásit</Link></b>.
                      </div>
                    : isViewerVeto ?
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={this.onEditClick}
                      >Edit</button>
                    : vote && vote.yes ?
                      <div>
                        <div className="alert alert-success" role="alert">
                          <strong>Děkujeme!</strong> Hlasoval jste pro veto
                          zákona.
                        </div>
                        <p>
                          Pokud se nás zde sejde 50 tisíc, můžeme se bavit o tom,
                          zda-li je zákon ještě <a
                            target="_blank"
                            href="https://cs.wikipedia.org/wiki/Legitimita#Legitimita_ve_filosofii"
                          >legitimní</a>.
                        </p>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={this.onVetoCancelClick}
                        >Rozmyslel jsem si to.</button>
                      </div>
                    : <div>
                        <div className="alert alert-info" role="alert">
                          Pokud si myslíte, že zákon je zbytečný, vetujte ho.
                        </div>
                        <button
                          className="btn btn-primary"
                          onClick={this.onVetoClick}
                        >Vetovat zákon</button>
                      </div>
                    }
                  </div>
                :
                  <div className="edit">
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
                      >Save</button>
                      {' '}
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={this.onCancelClick}
                      >Cancel</button>
                      {' '}
                      <button
                        type="button"
                        className="btn btn-warning"
                        onClick={this.onDeleteClick}
                      >Delete</button>
                    </form>
                    <br />
                    {fields.error.value &&
                      <div className="alert alert-danger" role="alert">
                        {fields.error.value.message}
                      </div>
                    }
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </div>
    );
  }

}

Veto = fields(Veto, {
  path: ({ params }) => ['vetos', params.vetoId],
  fields: ['name', 'reason', 'isEdited', 'error'],
  getInitialState: ({ veto }) => veto && veto.toJS()
});

Veto = queryFirebase(Veto, ({ setVeto, params: { vetoId } }) => ({
  path: `vetos/${vetoId}`,
  on: {
    value: snapshot => setVeto(vetoId, snapshot.val())
  }
}));

export default connect((state, ownProps) => {
  const { users: { viewer }, vetos } = state;
  const { params: { vetoId } } = ownProps;
  const veto = vetos.map.get(vetoId);
  return {
    veto,
    viewer,
    vote: veto && viewer
      ? vetos.votes.get(new Vote({ vetoId: veto.id, userId: viewer.id }).id)
      : null
  };
}, { ...vetosActions, replace })(Veto);
