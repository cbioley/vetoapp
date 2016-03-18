import Component from 'react-pure-render/component';
import FirebaseLogin from '../firebase/Login.react';
import Helmet from 'react-helmet';
import Logout from './Logout.react';
import React, { PropTypes } from 'react';
import linksMessages from '../../common/app/linksMessages';
import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';

const messages = defineMessages({
  callToAction: {
    defaultMessage: 'Please log in with Facebook or email.',
    id: 'auth.callToAction'
  }
});

class Page extends Component {

  static propTypes = {
    intl: intlShape.isRequired,
    location: PropTypes.object.isRequired,
    viewer: PropTypes.object
  };

  render() {
    const { intl, location, viewer } = this.props;
    const title = intl.formatMessage(linksMessages.login);

    return (
      <div className="login-page">
        <Helmet title={title} />
        {!viewer ?
          <div className="no-viewer">
            <span>
              <FormattedMessage {...messages.callToAction} />
            </span>
            <FirebaseLogin location={location} />
          </div>
        :
          <Logout />
        }
      </div>
    );
  }

}

Page = injectIntl(Page);

export default connect(state => ({
  viewer: state.users.viewer
}))(Page);
