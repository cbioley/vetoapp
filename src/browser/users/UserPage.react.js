import * as usersActions from '../../common/users/actions';
import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import ProfileImage from '../users/ProfileImage.react';
import React, { PropTypes } from 'react';
import UserVetos from '../vetos/UserVetos.react';
import VetoedVetos from '../vetos/VetoedVetos.react';
import linksMessages from '../../common/app/linksMessages';
import loading from '../lib/loading';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { queryFirebase } from '../../common/lib/redux-firebase';

class UserPage extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    viewer: PropTypes.object.isRequired
  };

  render() {
    const { user, viewer } = this.props;
    const userIsViewer = viewer && viewer.id === user.id;

    return (
      <div className="user-page">
        <Helmet title={user.displayName} />
        <h2>
          {user.displayName}
          {' '}
          {userIsViewer &&
            <Link to="/me">
              <sup className="label label-info">
                <FormattedMessage {...linksMessages.me} />
              </sup>
            </Link>
          }
        </h2>
        <ProfileImage url={user.profileImageURL} />
        <UserVetos user={user} />
        <VetoedVetos user={user} />
      </div>
    );
  }

}

// Hmm, these HOC's can be composed as well :-)

UserPage = loading(UserPage, ['user']);

UserPage = queryFirebase(UserPage, ({ onUser, params }) => ({
  path: `users/${params.userId}`,
  on: { value: snapshot => onUser(params.userId, snapshot.val()) }
}));

export default connect((state, { params }) => ({
  user: state.users.map.get(params.userId),
  viewer: state.users.viewer
}), usersActions)(UserPage);

