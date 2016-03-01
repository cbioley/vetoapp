import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import React, { PropTypes } from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import { Link } from 'react-router';
import { connect } from 'react-redux';

class Page extends Component {

  static propTypes = {
    msg: PropTypes.object.isRequired,
    viewer: PropTypes.object
  };

  render() {
    const { msg, viewer } = this.props;

    return (
      <div className="home-page">
        <Helmet title={viewer ? 'Přehled' : msg.title} />
        <div className="row">
          <div className="col-md-8">
            {!viewer ?
              <div className="no-viewer">
                <FormattedHTMLMessage defaultMessage={msg.infoText} />
                <Link className="btn btn-info btn-lg m-b-1" to="/login">
                  <FormattedHTMLMessage
                    defaultMessage={msg.callToAction}
                  />
                </Link>
              </div>
            :
              <div className="viewer">
                Soon.
              </div>
            }
          </div>
        </div>
      </div>
    );
  }

}

Page = connect(state => ({
  msg: state.intl.msg.home,
  viewer: state.users.viewer
}))(Page);

export default Page;
