import Component from 'react-pure-render/component';
import LocaleSwitch from '../intl/LocaleSwitch.react';
import React from 'react';
import { FormattedHTMLMessage, defineMessages } from 'react-intl';

// Messages collocation ftw.
// https://github.com/yahoo/react-intl/wiki/API#definemessages
const messages = defineMessages({
  madeByHtml: {
    defaultMessage: `
      made by <a href="https://twitter.com/steida">steida</a>,
      report an <a href="https://github.com/steida/vetoapp/issues/new">issue</a>`,
    id: 'footer.madeByHtml'
  }
});

export default class Footer extends Component {

  render() {
    return (
      <footer>
        <p>
          <FormattedHTMLMessage {...messages.madeByHtml} />
          ,{' '}
          <LocaleSwitch />
        </p>
      </footer>
    );
  }

}
