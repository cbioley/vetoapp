import './VetosTable.scss';
import Component from 'react-pure-render/component';
import Loading from '../lib/Loading.react';
import React, { PropTypes } from 'react';
import { FormattedRelative } from 'react-intl';
import { Link } from 'react-router';

export default class VetosTable extends Component {

  static propTypes = {
    vetos: PropTypes.object
  };

  render() {
    const { vetos } = this.props;

    return (
      <div className="vetos-table">
        {!vetos ?
          <Loading />
        :
          <table className="table">
            <tbody>
              {vetos.map(({ id, createdAt, name, creatorDisplayName }) =>
                <tr key={id}>
                  <td><Link to={`vetos/${id}`}>{name}</Link></td>
                  <td><FormattedRelative value={createdAt} /></td>
                  <td>{creatorDisplayName}</td>
                </tr>
              )}
            </tbody>
          </table>
        }
      </div>
    );
  }

}
