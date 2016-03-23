import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import React from 'react';
import linksMessages from '../../common/app/linksMessages';
import {
  FormattedMessage,
  FormattedHTMLMessage,
  defineMessages,
  injectIntl,
  intlShape
} from 'react-intl';
import { messages as homeMessages } from '../home/Page.react.js';

const messages = defineMessages({
  tldr: {
    defaultMessage: 'no tldr;',
    id: 'about.tldr'
  },
  intro: {
    defaultMessage: 'TODO: no tldr; text',
    id: 'about.intro'
  }
});

class Page extends Component {

  static propTypes = {
    intl: intlShape.isRequired
  };

  render() {
    const { intl } = this.props;
    const title = intl.formatMessage(linksMessages.about);

    return (
      <div className="me-page">
        <Helmet title={title} />
        <div className="row">
          <div className="col-md-8">
            <FormattedHTMLMessage {...homeMessages.intro} />
            <h2>
              <FormattedMessage {...messages.tldr} />
            </h2>
            <FormattedHTMLMessage {...messages.intro} />
          </div>
        </div>
      </div>
    );
  }

}

export default injectIntl(Page);
