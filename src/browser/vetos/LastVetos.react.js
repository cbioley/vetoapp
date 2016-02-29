import './LastVetos.scss';
import * as vetosActions from '../../common/vetos/actions';
import Component from 'react-pure-render/component';
import Loading from '../lib/Loading.react';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { queryFirebase } from '../../common/lib/redux-firebase';

class LastVetos extends Component {

  static propTypes = {
    lastVetos: PropTypes.object,
    lastVetosLimitToLast: PropTypes.number.isRequired,
    moreLastVetos: PropTypes.func.isRequired
  };

  render() {
    const { lastVetos, lastVetosLimitToLast, moreLastVetos } = this.props;

    if (!lastVetos) {
      return <div className="last-vetos"><Loading /></div>;
    }

    return (
      <div className="last-vetos">
        <h2>Poslední navržená veta</h2>
        <table className="table table-sm">
          <tbody>
            {lastVetos.map(({ id, name, creatorDisplayName }) =>
              <tr key={id}>
                <td>{name}</td>
                <td>{creatorDisplayName}</td>
              </tr>
            )}
            <tr>
              <td>
                <button
                  className="btn btn-link"
                  // Disable load more button during loading more vetos.
                  disabled={lastVetosLimitToLast !== lastVetos.size}
                  onClick={moreLastVetos}
                >more</button>
              </td>
            </tr>
          </tbody>
        </table>
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
