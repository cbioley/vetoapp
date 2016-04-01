import './VetoPage.scss';
import * as vetosActions from '../../common/vetos/actions';
import Component from 'react-pure-render/component';
import FacebookComments from './FacebookComments.react';
import Flag from '../countries/Flag.react';
import Helmet from 'react-helmet';
import Linkify from 'react-linkify';
import React, { PropTypes } from 'react';
import Vote from './Vote.react';
import VoteRecord from '../../common/vetos/Vote';
import VotesYesTotal from './VotesYesTotal.react';
import buttonsMessages from '../../common/app/buttonsMessages';
import loading from '../lib/loading';
import { FormattedMessage, defineMessages } from 'react-intl';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { queryFirebase } from '../../common/lib/redux-firebase';

const messages = defineMessages({
  suggestedBy: {
    defaultMessage: 'Suggested by {creatorDisplayName}',
    id: 'vetos.vetoPage.suggestedBy'
  }
});

class VetoPage extends Component {

  static propTypes = {
    veto: PropTypes.object.isRequired,
    viewer: PropTypes.object,
    viewerIsAdmin: PropTypes.bool,
    vote: PropTypes.object,
    votesYesTotal: PropTypes.object
  };

  render() {
    const { veto, viewer, viewerIsAdmin, vote, votesYesTotal } = this.props;
    const showEdit = viewerIsAdmin || viewer && viewer.id === veto.creatorId;

    return (
      <div className="veto-page">
        <div className="row">
          <div className="col-md-10">
            <div className="view">
              <Helmet title={veto.name} />
              <h2>
                {veto.name}{' '}
                <Flag country={veto.country} />
                {' '}
                <VotesYesTotal value={votesYesTotal} />
              </h2>
              <nav className="nav nav-inline">
                <Link to={`/users/${veto.creatorId}`}>
                  <FormattedMessage
                    {...messages.suggestedBy}
                    values={{ creatorDisplayName: veto.creatorDisplayName }}
                  />
                </Link>
                {showEdit &&
                  <Link to={`/vetos/${veto.id}/edit`}>
                    <FormattedMessage {...buttonsMessages.edit} />
                  </Link>
                }
              </nav>
              <p>
                <Linkify>
                  {veto.reason}
                </Linkify>
              </p>
              <Vote {...{ veto, vote, votesYesTotal }} />
            </div>
            <FacebookComments />
          </div>
        </div>
      </div>
    );
  }

}

VetoPage = loading(VetoPage, ['veto'], ({ viewer, vote, votesYesTotal }) =>
  votesYesTotal === undefined ||
  (viewer && vote === undefined) // We fetch vote only for viewer.
);

VetoPage = queryFirebase(VetoPage, ({ setVeto, params: { vetoId } }) => ({
  path: `vetos/${vetoId}`,
  on: {
    value: snapshot => setVeto(vetoId, snapshot.val())
  }
}));

VetoPage = queryFirebase(VetoPage, ({ onVote, veto, viewer }) => ({
  path: viewer && veto && `vetos-votes/yes/votes/${viewer.id}/${veto.id}`,
  on: {
    value: snapshot => onVote(VoteRecord.id(veto, viewer), snapshot.val())
  }
}));

VetoPage = queryFirebase(VetoPage, ({ onVoteYesTotal, params }) => ({
  path: `vetos-votes-yes-total/_all/${params.vetoId}`,
  on: {
    value: snapshot => onVoteYesTotal(params.vetoId, snapshot.val())
  }
}));

export default connect(({ users, vetos }, { params: { vetoId } }) => {
  const veto = vetos.map.get(vetoId);
  return {
    veto,
    viewer: users.viewer,
    viewerIsAdmin: users.viewerIsAdmin,
    vote: vetos.votes.get(VoteRecord.id(veto, users.viewer)),
    votesYesTotal: vetos.votesYesTotals.get(vetoId)
  };
}, vetosActions)(VetoPage);
