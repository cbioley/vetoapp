import './Page.scss';
import AuthLogout from '../auth/Logout.react';
import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

class Page extends Component {

  static propTypes = {
    msg: PropTypes.object,
    viewer: PropTypes.object
  };

  render() {
    const { msg, viewer } = this.props;
    const displayName = viewer.displayName || viewer.email;

    return (
      <div className="me-page">
        <Helmet title={msg.title} />
        <h2>
          <FormattedMessage
            defaultMessage={msg.h2}
            id={'msg.me.h2'}
            values={{ displayName }}
          />
        </h2>
        {viewer.profileImageURL &&
          <img
            className="profile-image-url img-circle"
            src={viewer.profileImageURL}
          />
        }
        <AuthLogout />
      </div>
    );
  }

}

export default connect(state => ({
  msg: state.intl.msg.me,
  viewer: state.users.viewer
}))(Page);
