// import './UserVetos.scss';
import * as vetosActions from '../../common/vetos/actions';
import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import VetosTable from './VetosTable.react';
import { connect } from 'react-redux';
import { queryFirebase } from '../../common/lib/redux-firebase';

class UserVetos extends Component {

  static propTypes = {
    h2: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    userVetos: PropTypes.object
  };

  render() {
    const { h2, userVetos } = this.props;

    return (
      <div className="user-vetos">
        <h2>{h2}</h2>
        <VetosTable vetos={userVetos} />
      </div>
    );
  }

}

UserVetos = queryFirebase(UserVetos, ({ setUserVetos, userId }) => ({
  path: 'vetos',
  params: [
    ['orderByChild', 'creatorId'],
    ['equalTo', userId]
  ],
  on: {
    value: snapshot => setUserVetos(userId, snapshot.val())
  }
}));

export default connect((state, ownProps) => ({
  userVetos: state.vetos.usersVetos.get(ownProps.userId)
}), vetosActions)(UserVetos);
