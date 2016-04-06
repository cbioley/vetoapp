import './VetoedBy.scss';
import * as vetosActions from '../../common/vetos/actions';
import Component from 'react-pure-render/component';
import Flag from '../countries/Flag.react';
import Helmet from 'react-helmet';
import React, { PropTypes } from 'react';
import loading from '../lib/loading';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { queryFirebase } from '../../common/lib/redux-firebase';

// TODO: Pure, or stateless functional component with shouldComponentUpdate.
const Vote = ({ vote }) =>
  <li>
    <Link to={`/users/${vote.userId}`}>
      <img className="img-circle" src={vote.userProfileImageURL} />
      {vote.userDisplayName}
    </Link>
  </li>;

Vote.propTypes = {
  vote: PropTypes.object.isRequired,
};

class VetoedBy extends Component {

  static propTypes = {
    veto: PropTypes.object.isRequired,
    votes: PropTypes.object.isRequired
  };

  render() {
    const { veto, votes } = this.props;

    return (
      <div className="vetoed-by-page">
        <div className="row">
          <div className="col-md-10">
            <Helmet title={veto.name} />
            <h2>
              <Link to={`/vetos/${veto.id}`}>
                {veto.name}
              </Link>
              {' '}
              <Flag country={veto.country} />
            </h2>
            <ol>
              {votes.map(vote =>
                <Vote key={vote.userId} vote={vote} />
              )}
            </ol>
          </div>
        </div>
      </div>
    );
  }

}

VetoedBy = loading(VetoedBy, ['veto', 'votes']);

VetoedBy = queryFirebase(VetoedBy, ({ onVeto, params: { vetoId } }) => ({
  path: `vetos/${vetoId}`,
  on: { value: snapshot => onVeto(vetoId, snapshot.val()) }
}));

VetoedBy = queryFirebase(VetoedBy, ({ onUserVote, params: { vetoId } }) => ({
  path: `vetos-votes/yes/vetos/${vetoId}`,
  params: [
    ['orderByChild', 'createdAt']
    // TODO: Add pagination once we will have a lot of vetos.
  ],
  on: { all: args => onUserVote(vetoId, args) }
}));

export default connect(({ users, vetos }, { params: { vetoId } }) => ({
  veto: vetos.map.get(vetoId),
  votes: vetos.usersVotes.get(vetoId)
}), vetosActions)(VetoedBy);

