import './Page.scss';
import AuthLogout from '../auth/Logout.react';
import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import Locales from './Locales.react';
import ProfileImage from '../users/ProfileImage.react';
import React, { PropTypes } from 'react';
import linksMessages from '../../common/app/linksMessages';
import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import { Link } from 'react-router';
import { connect } from 'react-redux';

const messages = defineMessages({
  heading: {
    defaultMessage: '{displayName}',
    id: 'me.page.heading'
  },
  admin: {
    defaultMessage: 'admin',
    id: 'me.page.admin'
  }
});

class Page extends Component {

  static propTypes = {
    intl: intlShape.isRequired,
    viewer: PropTypes.object,
    viewerIsAdmin: PropTypes.bool
  };

  render() {
    const { intl, viewer, viewerIsAdmin } = this.props;
    const title = intl.formatMessage(linksMessages.me);
    const displayName = viewer.displayName || viewer.email;

    return (
      <div className="me-page">
        <Helmet title={title} />
        <h2>
          <Link to={`/users/${viewer.id}`}>
            <FormattedMessage {...messages.heading} values={{ displayName }} />
          </Link>
          {' '}
          {viewerIsAdmin &&
            <sup className="label label-info">
              <FormattedMessage {...messages.admin} />
            </sup>
          }
        </h2>
        <ProfileImage url={viewer.profileImageURL} />
        <Locales />
        <AuthLogout />
      </div>
    );
  }

}

Page = injectIntl(Page);

export default connect(state => ({
  viewer: state.users.viewer,
  viewerIsAdmin: state.users.viewerIsAdmin
}))(Page);
