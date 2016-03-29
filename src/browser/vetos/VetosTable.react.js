import Component from 'react-pure-render/component';
import Loading from '../lib/Loading.react';
import React, { PropTypes } from 'react';
import { FormattedMessage, FormattedRelative, defineMessages } from 'react-intl';
import { Link } from 'react-router';

const messages = defineMessages({
  empty: {
    defaultMessage: 'Empty.',
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
        {!vetos ? // TODO: Use loading HOC.
          <Loading />
        : !vetos.size ?
          <p>
            <FormattedMessage {...messages.empty} />
          </p>
        :
          <table className="table table-sm">
            <tbody>
              {vetos.map(veto =>
                <tr key={veto.id}>
                  <td>
                    <Link to={`/vetos/${veto.id}`}>{veto.name}</Link>
                  </td>
                  {!hideCreator &&
                    <td>
                      <Link to={`/users/${veto.creatorId}`}>
                        {veto.creatorDisplayName}
                      </Link>
                    </td>
                  }
                  <td>
                    <FormattedRelative value={veto.createdAt} />
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
