import './VetosTable.scss';
import Component from 'react-pure-render/component';
import Loading from '../lib/Loading.react';
import React, { PropTypes } from 'react';
import { FormattedMessage, FormattedRelative, defineMessages } from 'react-intl';
import { Link } from 'react-router';

const messages = defineMessages({
  empty: {
    defaultMessage: 'You did not suggest any veto yet.',
    id: 'vetos.table.empty'
  }
});

export default class VetosTable extends Component {

  static propTypes = {
    hideCreator: PropTypes.bool,
    vetos: PropTypes.object,
  };

  render() {
    const { hideCreator, vetos } = this.props;

    return (
      <div className="vetos-table">
        {!vetos ?
          <Loading />
        : !vetos.size ?
          <p>
            <FormattedMessage {...messages.empty} />
          </p>
        :
          <table className="table">
            <tbody>
              {vetos.map(({ id, createdAt, name, creatorDisplayName }) =>
                <tr key={id}>
                  <td className="name">
                    <Link to={`vetos/${id}`}>{name}</Link>
                  </td>
                  {!hideCreator &&
                    <td>{creatorDisplayName}</td>
                  }
                  <td>
                    <FormattedRelative value={createdAt} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        }
      </div>
    );
  }

}
