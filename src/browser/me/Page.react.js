import './Page.scss';
import AuthLogout from '../auth/Logout.react';
import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import React, { PropTypes } from 'react';
import linksMessages from '../../common/app/linksMessages';
import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';

const messages = defineMessages({
  h2: {
    defaultMessage: '{displayName}',
    id: 'me.page.h2'
  }
});

class Page extends Component {

  static propTypes = {
    intl: intlShape.isRequired,
    viewer: PropTypes.object
  };

  render() {
    const { intl, viewer } = this.props;
    const title = intl.formatMessage(linksMessages.me);
    const displayName = viewer.displayName || viewer.email;

    return (
      <div className="me-page">
        <Helmet title={title} />
        <h2>
          <FormattedMessage {...messages.h2} values={{ displayName }} />
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

Page = injectIntl(Page);

export default connect(state => ({
  viewer: state.users.viewer
}))(Page);
