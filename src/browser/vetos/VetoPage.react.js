import * as vetosActions from '../../common/vetos/actions';
import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import Linkify from 'react-linkify';
import Loading from '../lib/Loading.react';
import NotFound from '../notfound/Page.react';
import React, { PropTypes } from 'react';
import Vote from './Vote.react';
import VoteRecord from '../../common/vetos/Vote';
import VotesYesTotal from './VotesYesTotal.react';
import buttonsMessages from '../../common/app/buttonsMessages';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { queryFirebase } from '../../common/lib/redux-firebase';

class VetoPage extends Component {

  static propTypes = {
    veto: PropTypes.object,
    viewer: PropTypes.object,
    vote: PropTypes.object,
    votesYesTotal: PropTypes.number
  };

  render() {
    const { veto, viewer, vote, votesYesTotal } = this.props;
    const isLoading =
      veto === undefined ||
      vote === undefined ||
      votesYesTotal === undefined;

    return (
      <div className="veto-page">
        <div className="row">
          <div className="col-md-10">
            {isLoading ?
              <Loading />
            : !veto ?
              <NotFound />
            :
              <div className="view">
                <Helmet title={veto.name} />
                <h2>
                  {veto.name}{' '}
                  <VotesYesTotal count={votesYesTotal} />
                </h2>
                <p>
                  <Linkify properties={{ target: '_blank' } }>
                    {veto.reason}
                  </Linkify>
                </p>
                {viewer && viewer.id === veto.creatorId &&
                  <p>
                    <Link to={`/vetos/${veto.id}/edit`}>
                      <FormattedMessage {...buttonsMessages.edit} />
                    </Link>
                  </p>
                }
                <Vote {...{ veto, vote, votesYesTotal }} />
              </div>
            }
          </div>
        </div>
      </div>
    );
  }

}

VetoPage = queryFirebase(VetoPage, ({ setVeto, params: { vetoId } }) => ({
  path: `vetos/${vetoId}`,
  on: {
    value: snapshot => setVeto(vetoId, snapshot.val())
  }
}));

VetoPage = queryFirebase(VetoPage, ({ onVote, viewer, veto }) => ({
  path: viewer && veto && `vetos-votes-yes/${VoteRecord.id(viewer, veto)}`,
  on: {
    value: snapshot => onVote(snapshot.key(), snapshot.val())
  }
}));

VetoPage = queryFirebase(VetoPage, ({ onVoteYesTotal, params: { vetoId } }) => ({
  path: `vetos-votes-yes-total/${vetoId}`,
  on: {
    value: snapshot => onVoteYesTotal(vetoId, snapshot.val())
  }
}));

export default connect(({ users, vetos }, { params: { vetoId } }) => {
  const veto = vetos.map.get(vetoId);
  const viewer = users.viewer;
  const voteId = veto && viewer && VoteRecord.id(viewer, veto);
  const vote = veto && viewer && vetos.votes.get(voteId) || null;
  const votesYesTotal = vetos.votesYesTotal.get(vetoId);
  return { veto, viewer, vote, votesYesTotal };
}, vetosActions)(VetoPage);
