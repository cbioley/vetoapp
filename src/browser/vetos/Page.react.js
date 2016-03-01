import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import LastVetos from './LastVetos.react';
import React, { PropTypes } from 'react';
import UserVetos from './UserVetos.react';
import { connect } from 'react-redux';

class Page extends Component {

  static propTypes = {
    viewer: PropTypes.object
  }

  render() {
    const { viewer } = this.props;

    return (
      <div className="suggest-veto">
        <Helmet title="Veta" />
        <div className="row">
          <div className="col-md-8">
            {viewer &&
              <UserVetos h2="Tebou navržená veta" userId={viewer.id} />
            }
            <LastVetos />
          </div>
        </div>
      </div>
    );
  }

}

export default connect(state => ({
  viewer: state.users.viewer
}))(Page);
