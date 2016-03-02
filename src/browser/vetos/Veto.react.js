import * as vetosActions from '../../common/vetos/actions';
import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import Linkify from 'react-linkify';
import Loading from '../lib/Loading.react';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { queryFirebase } from '../../common/lib/redux-firebase';
import { replace } from 'react-router-redux';

class Veto extends Component {

  static propTypes = {
    deleteVeto: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    veto: PropTypes.object,
    viewer: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.onDeleteClick = this.onDeleteClick.bind(this);
  }

  onDeleteClick() {
    const { deleteVeto, replace, veto } = this.props;
    if (!confirm('Are you sure?')) return; // eslint-disable-line no-alert
    deleteVeto(veto.id);
    replace('vetos');
  }

  render() {
    const { veto, viewer } = this.props;
    const isViewerVeto = veto && viewer && viewer.id === veto.creatorId;

    return (
      <div className="veto-detail">
        {veto === undefined ?
          <Loading />
        : !veto ?
          <p>This veto doesn't exists. <Link to="/vetos">Other vetos</Link>.</p>
        :
          <div>
            <Helmet title={veto.name} />
            <h2>{veto.name}</h2>
            <p>
              <Linkify properties={{ target: '_blank'} }>{veto.reason}</Linkify>
            </p>
            {isViewerVeto &&
              <button
                className="btn btn-primary"
                onClick={this.onDeleteClick}
              >Delete</button>
            }
          </div>
        }
      </div>
    );
  }

}

Veto = queryFirebase(Veto, ({ setVeto, params: { vetoId } }) => ({
  path: `vetos/${vetoId}`,
  on: {
    value: snapshot => setVeto(vetoId, snapshot.val())
  }
}));

export default connect((state, { params: { vetoId } }) => ({
  veto: state.vetos.map.get(vetoId),
  viewer: state.users.viewer
}), { ...vetosActions, replace })(Veto);
