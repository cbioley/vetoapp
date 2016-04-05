import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { Link } from 'react-router';

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
    value: PropTypes.object,
    vetoId: PropTypes.string.isRequired
  };

  render() {
    const { value, vetoId } = this.props;

    if (!value || !value.total) return null;

    return (
      <sup className="label label-info votes-yes-total">
        <Link to={`/vetos/${vetoId}/votes`}>
          <FormattedMessage
            {...messages.votesYesTotal}
            values={{ count: value.total }}
          />
        </Link>
      </sup>
    );
  }

}
