import * as vetosActions from '../../common/vetos/actions';
import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, FormattedRelative, defineMessages } from 'react-intl';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { queryFirebase } from '../../common/lib/redux-firebase';

const messages = defineMessages({
  heading: {
    defaultMessage: 'Vetoed',
    id: 'vetos.vetoedVetos.heading'
  }
});

class VetoedVetos extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    userYesVotes: PropTypes.object
  };

  render() {
    const { userYesVotes } = this.props;
    // TODO: Refactor loading to support empty collection, then use it here.
    if (!userYesVotes) return null;

    return (
      <div className="user-vetos">
        <h2>
          <FormattedMessage {...messages.heading} />
        </h2>
        <table className="table table-sm">
          <tbody>
            {userYesVotes.map(vote =>
              <tr key={vote.vetoId}>
                <td>
                  <Link to={`/vetos/${vote.vetoId}`}>{vote.vetoName}</Link>
                </td>
                <td>
                  <FormattedRelative value={vote.createdAt} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

}

VetoedVetos = queryFirebase(VetoedVetos, ({ onUserYesVotes, user }) => ({
  path: `vetos-votes/yes/votes/${user.id}`,
  params: [
    ['orderByChild', 'createdAt'],
    ['limitToLast', 100]
  ],
  on: {
    value: snapshot => onUserYesVotes(user.id, snapshot.val())
  }
}));

export default connect((state, { user }) => ({
  userYesVotes: state.vetos.usersYesVotes.get(user.id)
}), vetosActions)(VetoedVetos);
