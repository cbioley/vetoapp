import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import LastVetos from './LastVetos.react';
import React, { PropTypes } from 'react';
import UserVetos from './UserVetos.react';
import linksMessages from '../../common/app/linksMessages';
import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';

const messages = defineMessages({
  yourVetos: {
    defaultMessage: 'Your vetos',
    id: 'vetos.page.yourVetos'
  }
});

class Page extends Component {

  static propTypes = {
    intl: intlShape.isRequired,
    viewer: PropTypes.object
  }

  render() {
    const { intl, viewer } = this.props;
    const title = intl.formatMessage(linksMessages.vetos);

    return (
      <div className="vetos-page">
        <Helmet title={title} />
        <div className="row">
          <div className="col-md-10">
            <LastVetos />
            <br />
            {viewer &&
              <div>
                <h2>
                  <FormattedMessage {...messages.yourVetos} />
                </h2>
                <UserVetos userId={viewer.id} />
              </div>
            }
          </div>
        </div>
      </div>
    );
  }

}

Page = injectIntl(Page);

export default connect(state => ({
  viewer: state.users.viewer
}))(Page);
