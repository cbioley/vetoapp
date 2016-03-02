import Component from 'react-pure-render/component';
import FirebaseLogin from '../firebase/Login.react';
import Helmet from 'react-helmet';
import Logout from './Logout.react';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

class Page extends Component {

  static propTypes = {
    location: PropTypes.object.isRequired,
    msg: PropTypes.object.isRequired,
    viewer: PropTypes.object
  };

  render() {
    const { location, msg, viewer } = this.props;

    return (
      <div className="login-page">
        <Helmet title={msg.loginTitle} />
        {!viewer ?
          <div className="no-viewer">
            <span>
              Přihlašte se prosím pomocí svého Facebook účtu, nebo pomocí
              emailu.
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

export default connect(state => ({
  msg: state.intl.msg.auth,
  viewer: state.users.viewer
}))(Page);
