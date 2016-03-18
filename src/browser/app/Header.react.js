import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import linksMessages from '../../common/app/linksMessages';
import { FormattedMessage } from 'react-intl';
import { IndexLink, Link } from 'react-router';
import { connect } from 'react-redux';

class Header extends Component {

  static propTypes = {
    viewer: PropTypes.object
  };

  render() {
    const { viewer } = this.props;

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
        <nav className="nav nav-tabs" role="navigation">
          <li className="nav-item">
            <IndexLink activeClassName="active" className="nav-link" to="/">
              <FormattedMessage {...linksMessages.home} />
            </IndexLink>
          </li>
          <li className="nav-item">
            <Link activeClassName="active" className="nav-link" to="/suggest-veto">
              <FormattedMessage {...linksMessages.suggestVeto} />
            </Link>
          </li>
          <li className="nav-item">
            <Link activeClassName="active" className="nav-link" to="/vetos">
              <FormattedMessage {...linksMessages.vetos} />
            </Link>
          </li>
          <li className="nav-item">
            <Link activeClassName="active" className="nav-link" to="/about">
              <FormattedMessage {...linksMessages.about} />
            </Link>
          </li>
          {viewer ?
            <li className="nav-item">
              <Link activeClassName="active" className="nav-link" to="/me">
                <FormattedMessage {...linksMessages.me} />
              </Link>
            </li>
          :
            <li className="nav-item">
              <Link activeClassName="active" className="nav-link" to="/login">
                <FormattedMessage {...linksMessages.login} />
              </Link>
            </li>
          }
        </nav>
      </header>
    );
  }

}

export default connect(state => ({
  viewer: state.users.viewer
}))(Header);
