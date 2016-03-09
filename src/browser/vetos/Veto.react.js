import './Veto.scss';
import * as vetosActions from '../../common/vetos/actions';
import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import Linkify from 'react-linkify';
import Loading from '../lib/Loading.react';
import React, { PropTypes } from 'react';
import Textarea from 'react-textarea-autosize';
import Vote from './Vote.react';
import VoteRecord from '../../common/vetos/Vote';
import focusInvalidField from '../lib/focusInvalidField';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { fields } from '../../common/lib/redux-fields';
import { queryFirebase } from '../../common/lib/redux-firebase';
import { replace } from 'react-router-redux';

// TODO: Refactor to view and edit components.
class Veto extends Component {

  static propTypes = {
    deleteVeto: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    saveVeto: PropTypes.func.isRequired,
    setVote: PropTypes.func.isRequired,
    veto: PropTypes.object,
    viewer: PropTypes.object,
    vote: PropTypes.object,
    votesYesTotal: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.onCancelClick = this.onCancelClick.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.onEditClick = this.onEditClick.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onSaveClick = this.onSaveClick.bind(this);
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

  isDirty() {
    const { fields, veto } = this.props;
    return !(
      fields.name.value === veto.name &&
      fields.reason.value === veto.reason
    );
  }

  render() {
    const { fields, setVote, veto, viewer, vote, votesYesTotal } = this.props;
    // undefined is absence of evidence, null is evidence of absence ;)
    const isLoading =
      veto === undefined ||
      vote === undefined ||
      votesYesTotal === undefined;
    const isViewerVeto = veto && viewer && viewer.id === veto.creatorId;

    return (
      <div className="veto-page">
        <div className="row">
          <div className="col-md-10">
            {isLoading ?
              <Loading />
            : !veto ?
              <p>This veto doesn't exists.</p>
            :
              <div>
                <Helmet title={veto.name} />
                {!fields.isEdited.value ?
                  <div className="view">
                    <h2>
                      {veto.name}{' '}
                      {!!votesYesTotal &&
                        <sup className="label label-info">
                          vetoed by {votesYesTotal} citizens
                        </sup>
                      }
                    </h2>
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
                    :
                      <Vote
                        setVote={setVote}
                        user={viewer}
                        veto={veto}
                        vote={vote}
                        votesYesTotal={votesYesTotal}
                      />
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

Veto = queryFirebase(Veto, ({ onVote, viewer, veto }) => ({
  path: viewer && veto && `vetos-votes-yes/${VoteRecord.id(viewer, veto)}`,
  on: {
    value: snapshot => onVote(snapshot.key(), snapshot.val())
  }
}));

Veto = queryFirebase(Veto, ({ onVoteYesTotal, params: { vetoId } }) => ({
  path: `vetos-votes-yes-total/${vetoId}`,
  on: {
    value: snapshot => onVoteYesTotal(vetoId, snapshot.val())
  }
}));

export default connect((state, { params: { vetoId } }) => {
  const veto = state.vetos.map.get(vetoId);
  const viewer = state.users.viewer;
  const vote = veto && viewer &&
    state.vetos.votes.get(VoteRecord.id(viewer, veto));
  const votesYesTotal = state.vetos.votesYesTotal.get(vetoId);
  return { veto, viewer, vote, votesYesTotal };
}, { ...vetosActions, replace })(Veto);
