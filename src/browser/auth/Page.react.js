import Component from 'react-pure-render/component';
import FirebaseLogin from '../firebase/Login.react';
import Helmet from 'react-helmet';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

class Page extends Component {

  static propTypes = {
    msg: PropTypes.object,
    viewer: PropTypes.object
  };

  render() {
    const { msg, viewer } = this.props;

    return (
      <div className="login-page">
        <Helmet title={msg.title} />
        {!viewer ?
          <div className="no-viewer">
            <FirebaseLogin />
          </div>
        :
          <div className="viewer">
            Přihlášení proběhlo úspěšně. Pokračujte prosím
            {' '} <Link to="/">zde</Link>.
          </div>
        }
      </div>
    );
  }

}

export default connect(state => ({
  msg: state.intl.msg.auth.login,
  viewer: state.users.viewer
}))(Page);
