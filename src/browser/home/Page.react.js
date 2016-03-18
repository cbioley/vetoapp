import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import React, { PropTypes } from 'react';
import { FormattedHTMLMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import { Link } from 'react-router';
import { connect } from 'react-redux';

export const messages = defineMessages({
  title: {
    defaultMessage: 'Home',
    id: 'home.title'
  },
  titleLoggedIn: {
    defaultMessage: 'Overview',
    id: 'home.titleLoggedIn'
  },
  intro: {
    defaultMessage: `
      <p>Zákonů je tak strašný množství, že se v nich nevyznají už ani
      právníci. Na poslance spoléhat nemůžeme, mají tolik práce s psaním
      zákonů nových, že na rušení starých jim už nezbývá čas.</p><p>Naštěstí si
      můžeme pomoci sami. V Ústavě ČR je kouzelná věta: <b>Lid je zdrojem veškeré
      státní moci</b>. Svobodnější země jako je třeba Švýcarsko, znají
      <a target="_blank" href="http://mmister.com/lidove-veto-co-to-je-a-proc-to-funguje">lidové veto</a>.
      My ho můžeme mít také. <b>Nečekejme na volby, měňme věci teď</b>.</p>
    `,
    id: 'home.intro'
  },
  callToAction: {
    defaultMessage: 'Yeah, that makes sense. I\'m in.',
    id: 'home.callToAction'
  }
});

class Page extends Component {

  static propTypes = {
    intl: intlShape.isRequired,
    viewer: PropTypes.object
  };

  render() {
    const { intl, viewer } = this.props;
    const titleMessage = viewer ? messages.titleLoggedIn : messages.title;
    const title = intl.formatMessage(titleMessage);

    return (
      <div className="home-page">
        <Helmet title={title} />
        <div className="row">
          <div className="col-md-8">
            {!viewer ?
              <div className="no-viewer">
                <FormattedHTMLMessage {...messages.intro} />
                <Link className="btn btn-info btn-lg m-b-1" to="/login">
                  <FormattedHTMLMessage {...messages.callToAction} />
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

Page = injectIntl(Page);

export default connect(state => ({
  viewer: state.users.viewer
}))(Page);
