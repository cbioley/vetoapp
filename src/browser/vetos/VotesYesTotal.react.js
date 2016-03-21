import './VotesYesTotal.scss';
import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

const messages = defineMessages({
  votesYesTotal: {
    defaultMessage: `vetoed by {count} {count, plural,
      one { citizen }
      other { citizens }
    }`,
    id: 'vetos.votesYesTotal'
  }
});

export default class VotesYesTotal extends Component {

  static propTypes = {
    count: PropTypes.number
  };

  render() {
    const { count } = this.props;

    if (!count) return null;

    return (
      <sup className="label label-info votes-yes-total">
        <FormattedMessage
          {...messages.votesYesTotal}
          values={{ count }}
        />
      </sup>
    );
  }

}
