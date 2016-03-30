import * as vetosActions from '../../common/vetos/actions';
import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import {
  FormattedMessage,
  FormattedHTMLMessage,
  defineMessages,
  injectIntl,
  intlShape
} from 'react-intl';

const messages = defineMessages({
  thankYou: {
    defaultMessage: '<strong>Thank you!</strong> You voted against the law.',
    id: 'vetos.vote.thankYou'
  },
  legitimacy: {
    defaultMessage: `
      If another {remainingVotes} citizens will vote against this law, we can
      reconsider whether the law is still valid.
    `,
    id: 'vetos.vote.legitimacy'
  },
  changedMind: {
    defaultMessage: 'I changed my mind',
    id: 'vetos.vote.changedMind'
  },
  vetoIfIrrelevant: {
    defaultMessage: 'If you think the law is irrelevant, veto it.',
    id: 'vetos.vote.vetoIfIrrelevant'
  },
  vetoLaw: {
    defaultMessage: 'Veto law',
    id: 'vetos.vote.vetoLaw'
  }
});

// TODO: Set per country.
const ignoreLawThreshold = 50000;

class Vote extends Component {

  static propTypes = {
    intl: intlShape.isRequired,
    setVote: PropTypes.func.isRequired,
    veto: PropTypes.object.isRequired,
    viewer: PropTypes.object,
    vote: PropTypes.object,
    votesYesTotal: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.onVetoCancelClick = this.onVetoCancelClick.bind(this);
    this.onVetoClick = this.onVetoClick.bind(this);
  }

  onVetoCancelClick() {
    const { setVote, veto } = this.props;
    setVote(veto, false);
  }

  onVetoClick() {
    const { setVote, veto } = this.props;
    setVote(veto, true);
  }

  render() {
    const { intl, veto, viewer, vote, votesYesTotal } = this.props;
    const total = votesYesTotal ? votesYesTotal.total : 0;
    const remainingVotes = ignoreLawThreshold - total;

    return (
      vote && vote.yes ?
        <div>
          <div className="alert alert-success" role="alert">
            <FormattedHTMLMessage {...messages.thankYou} />
          </div>
          <p>
            <FormattedHTMLMessage
              {...messages.legitimacy}
              values={{
                remainingVotes: intl.formatNumber(remainingVotes)
              }}
            />
          </p>
          <button
            className="btn btn-secondary btn-sm"
            onClick={this.onVetoCancelClick}
          ><FormattedMessage {...messages.changedMind} /></button>
        </div>
      :
        <div>
          <div className="alert alert-info" role="alert">
            <FormattedMessage {...messages.vetoIfIrrelevant} />
          </div>
          {viewer ?
            <button
              className="btn btn-primary"
              onClick={this.onVetoClick}
            ><FormattedMessage {...messages.vetoLaw} /></button>
          :
            <Link
              className="btn btn-primary"
              to={{
                pathname: '/login',
                state: { nextPathname: `vetos/${veto.id}` }
              }}
            ><FormattedMessage {...messages.vetoLaw} /></Link>
          }
        </div>
    );
  }

}

Vote = injectIntl(Vote);

export default connect(state => ({
  viewer: state.users.viewer
}), vetosActions)(Vote);
