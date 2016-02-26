import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

class Header extends Component {

  static propTypes = {
    msg: PropTypes.object.isRequired,
    viewer: PropTypes.object
  };

  render() {
    const { msg, viewer } = this.props;

    return (
      <header>
        <Link to="/">
          <img
            className="img-fluid"
            height="190"
            src={require('./logo-400px.png')}
            width="400"
          />
        </Link>
        <ul>
          {viewer &&
            <li><Link activeClassName="active" to="/me">{msg.me}</Link></li>
          }
        </ul>
      </header>
    );
  }

}

export default connect(state => ({
  msg: state.intl.msg.app.links,
  viewer: state.users.viewer
}))(Header);
