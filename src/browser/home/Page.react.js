import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import React, { PropTypes } from 'react';
import TotalVotes from '../vetos/TotalVotes.react';
import getDefaultCountryByLocale from '../../common/countries/getDefaultCountryByLocale';
import { FormattedHTMLMessage, defineMessages } from 'react-intl';
import { Link } from 'react-router';
import { connect } from 'react-redux';

export const messages = defineMessages({
  intro: {
    defaultMessage: `
      <p>
        There are so many laws that not even lawyers can make sense of them.
        We cannot put our trust in politicians – they have so much work drafting
        new laws that they have no time left to repeal old ones.
      </p>
      <p>
        Luckily, we can help ourselves. Constitutions of almost all countries
        over the world states: <b>The people are the source of all power in the
        State.</b> Freer countries like Switzerland know the people’s veto.
        We can have it, too. Let’s not wait for elections, change things now.
      </p>`,
    id: 'home.intro'
  },
  callToAction: {
    defaultMessage: 'Yeah, that makes sense. I\'m in.',
    id: 'home.callToAction'
  }
});

class Page extends Component {

  static propTypes = {
    currentLocale: PropTypes.string.isRequired,
    viewer: PropTypes.object
  };

  render() {
    const { currentLocale, viewer } = this.props;
    const country = getDefaultCountryByLocale(currentLocale);

    return (
      <div className="home-page">
        <Helmet title="Vetoapp" />
        <div className="row">
          <div className="col-md-8">
            {!viewer &&
              <div className="no-viewer">
                <FormattedHTMLMessage {...messages.intro} />
                <Link className="btn btn-info btn-lg m-b-1" to="/login">
                  <FormattedHTMLMessage {...messages.callToAction} />
                </Link>
              </div>
            }
            <TotalVotes country={country} />
          </div>
        </div>
      </div>
    );
  }

}

export default connect(state => ({
  currentLocale: state.intl.currentLocale,
  viewer: state.users.viewer
}))(Page);
