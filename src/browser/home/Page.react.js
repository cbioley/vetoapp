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
        <Helmet title={msg.title} />
        <div className="row">
          <div className="col-md-8">
            {!viewer ?
              <div className="no-viewer">
                <FormattedHTMLMessage defaultMessage={msg.infoText} />
                <Link className="btn btn-info btn-lg" to="/login">
                  <FormattedHTMLMessage
                    defaultMessage="Jo, to dává smysl. Chci se přidat."
                  />
                </Link>
              </div>
            :
              <div className="viewer">
                <p>
                  <FormattedHTMLMessage
                    defaultMessage={`
                      Během několika dnů bude vetoapp spuštěna.
                      <br />
                      Zatím si poslechni tuhle písničku.
                    `}
                  />
                </p>
                <iframe
                  allowFullScreen
                  frameBorder="0"
                  height="315"
                  max-width="420"
                  src="https://www.youtube.com/embed/2ERApRREtkQ"
                ></iframe>
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
