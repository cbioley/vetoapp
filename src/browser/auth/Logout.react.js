import * as authActions from '../../common/auth/actions';
import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, defineMessages } from 'react-intl';

const messages = defineMessages({
  logout: {
    defaultMessage: 'Logout',
    id: 'auth.logout.logout'
  }
});

class Logout extends Component {

  static propTypes = {
    logout: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  logout() {
    const { logout } = this.props;
    // Redirect user to root page before logout since logout recycles app state.
    this.context.router.replace('/');
    logout();
  }

  render() {
    return (
      <div className="logout">
        <button
          className="btn btn-danger-outline btn-sm"
          onClick={this.logout}
        ><FormattedMessage {...messages.logout} /></button>
      </div>
    );
  }

}

export default connect(null, authActions)(Logout);
