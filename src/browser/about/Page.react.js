import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import React, { PropTypes } from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import { connect } from 'react-redux';

class Page extends Component {

  static propTypes = {
    msg: PropTypes.object
  };

  render() {
    const { msg } = this.props;

    return (
      <div className="me-page">
        <Helmet title={msg.app.links.about} />
        <div className="row">
          <div className="col-md-8">
            <FormattedHTMLMessage defaultMessage={msg.home.infoText} />
          </div>
        </div>
      </div>
    );
  }

}

export default connect(state => ({
  msg: state.intl.msg
}))(Page);
