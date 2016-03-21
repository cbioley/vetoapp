import './LastVetos.scss';
import * as vetosActions from '../../common/vetos/actions';
import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import VetosTable from './VetosTable.react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import { queryFirebase } from '../../common/lib/redux-firebase';

const messages = defineMessages({
  lastVetos: {
    defaultMessage: 'Last vetos',
    id: 'vetos.page.lastVetos'
  }
});

class LastVetos extends Component {

  static propTypes = {
    lastVetos: PropTypes.object,
    lastVetosLimitToLast: PropTypes.number.isRequired,
    moreLastVetos: PropTypes.func.isRequired
  };

  render() {
    const { lastVetos, lastVetosLimitToLast, moreLastVetos } = this.props;

    return (
      <div className="last-vetos">
        <h2>
          <FormattedMessage {...messages.lastVetos} />
        </h2>
        <VetosTable vetos={lastVetos} />
        {lastVetos &&
          <button
            className="btn btn-link"
            // Disable load more button during loading more vetos.
            disabled={lastVetosLimitToLast !== lastVetos.size}
            onClick={moreLastVetos}
          >more</button>
        }
      </div>
    );
  }

}

LastVetos = queryFirebase(LastVetos, props => ({
  path: 'vetos',
  params: [
    ['orderByChild', 'createdAt'],
    ['limitToLast', props.lastVetosLimitToLast]
  ],
  on: {
    value: snapshot => props.setLastVetos(snapshot.val())
  }
}));

export default connect(state => ({
  lastVetos: state.vetos.lastVetos,
  lastVetosLimitToLast: state.vetos.lastVetosLimitToLast
}), vetosActions)(LastVetos);
