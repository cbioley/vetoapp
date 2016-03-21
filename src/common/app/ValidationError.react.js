import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

const messages = defineMessages({
  required: {
    defaultMessage: 'Please fill out field.',
    id: 'app.validationError.required'
  },
  fewWordsAtLeast: {
    defaultMessage: `Text is too short. Use at least {minLength} characters.
      You entered {length}.
    `,
    id: 'app.validationError.fewWordsAtLeast'
  }
});

export default class ValidationError extends Component {

  static propTypes = {
    error: PropTypes.object
  };

  render() {
    const { error } = this.props;
    if (!error) return null;
    const message = messages[error.name];

    return (
      <p className="alert alert-danger" role="alert">
        {message ?
          <FormattedMessage {...message} values={error.params} />
        :
          error.message // Unknown therefore not translated error.
        }
      </p>
    );
  }

}
