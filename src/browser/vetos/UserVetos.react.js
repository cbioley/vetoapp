import * as vetosActions from '../../common/vetos/actions';
import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import VetosTable from './VetosTable.react';
import { connect } from 'react-redux';
import { queryFirebase } from '../../common/lib/redux-firebase';
import { FormattedMessage, defineMessages } from 'react-intl';

const messages = defineMessages({
  heading: {
    defaultMessage: 'Suggested vetos',
    id: 'vetos.userVetos.heading'
  }
});

class UserVetos extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    userVetos: PropTypes.object
  };

  render() {
    const { userVetos } = this.props;

    return (
      <div className="user-vetos">
        <h2>
          <FormattedMessage {...messages.heading} />
        </h2>
        <VetosTable hideCreator vetos={userVetos} />
      </div>
    );
  }

}

UserVetos = queryFirebase(UserVetos, ({ setUserVetos, user }) => ({
  path: 'vetos',
  params: [
    ['orderByChild', 'creatorId'],
    ['equalTo', user.id]
  ],
  on: {
    value: snapshot => setUserVetos(user.id, snapshot.val())
  }
}));

export default connect((state, { user }) => ({
  userVetos: state.vetos.usersVetos.get(user.id)
}), vetosActions)(UserVetos);
