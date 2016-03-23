import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import React, { PropTypes } from 'react';
import { FormattedHTMLMessage, defineMessages } from 'react-intl';
import { Link } from 'react-router';
import { connect } from 'react-redux';

export const messages = defineMessages({
  intro: {
    defaultMessage: `Luckily, we can help ourselves. The Constitution of the
      Czech Republic states: The people are the source of all power in the
      State. Freer countries like Switzerland know the people’s veto. We can
      have it, too. Let’s not wait for elections, change things now. There are
      so many laws that not even lawyers can make sense of them. We cannot put
      our trust in politicians – they have so much work drafting new laws that
      they have no time left to repeal old ones.`,
    id: 'home.intro'
  },
  callToAction: {
    defaultMessage: 'Yeah, that makes sense. I\'m in.',
    id: 'home.callToAction'
  }
});

class Page extends Component {

  static propTypes = {
    viewer: PropTypes.object
  };

  render() {
    const { viewer } = this.props;

    return (
      <div className="home-page">
        <Helmet title="Vetoapp" />
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

export default connect(state => ({
  viewer: state.users.viewer
}))(Page);
