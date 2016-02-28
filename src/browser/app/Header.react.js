import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { IndexLink, Link } from 'react-router';
import { connect } from 'react-redux';

class Header extends Component {

  static propTypes = {
    msg: PropTypes.object.isRequired,
    notFound: PropTypes.bool.isRequired,
    viewer: PropTypes.object
  };

  render() {
    const { msg, notFound, viewer } = this.props;
    const showNavTabs = viewer && !notFound;

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
        {showNavTabs &&
          <nav className="nav nav-tabs" role="navigation">
            <li className="nav-item">
              <IndexLink
                activeClassName="active"
                className="nav-link"
                to="/"
              >{msg.home}</IndexLink>
            </li>
            <li className="nav-item">
              <Link
                activeClassName="active"
                className="nav-link"
                to="/suggest-veto"
              >{msg.suggestVeto}</Link>
            </li>
            <li className="nav-item">
              <Link
                activeClassName="active"
                className="nav-link"
                to="/me"
              >{msg.me}</Link>
            </li>
            <li className="nav-item">
              <Link activeClassName="active"
                className="nav-link"
                to="/about"
              >{msg.about}</Link>
            </li>
          </nav>
        }
      </header>
    );
  }

}

export default connect(state => ({
  msg: state.intl.msg.app.links,
  viewer: state.users.viewer
}))(Header);
