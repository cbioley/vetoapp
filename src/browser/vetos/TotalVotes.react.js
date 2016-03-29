import './TotalVotes.scss';
import * as countriesActions from '../../common/countries/actions';
import Component from 'react-pure-render/component';
import Flag from '../countries/Flag.react';
import Loading from '../lib/Loading.react';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { queryFirebase } from '../../common/lib/redux-firebase';

export const messages = defineMessages({
  h2: {
    defaultMessage: 'The most vetoed laws',
    id: 'vetos.totalVotes.h2'
  }
});

class TotalVotes extends Component {

  static propTypes = {
    country: PropTypes.string.isRequired,
    totalVotes: PropTypes.object
  };

  render() {
    const { country, totalVotes } = this.props;

    return (
      <div className="total-votes">
        <h2>
          <FormattedMessage {...messages.h2} />
          {' '}
          <Flag country={country} />
        </h2>
        {!totalVotes ?
          <Loading />
        :
          <table className="table table-sm">
            <tbody>
              {totalVotes.map(({ total, vetoId, vetoName }) =>
                <tr key={vetoId}>
                  <td><Link to={`/vetos/${vetoId}`}>{vetoName}</Link></td>
                  <td>{total}</td>
                </tr>
              )}
            </tbody>
          </table>
        }
      </div>
    );
  }

}

TotalVotes = queryFirebase(TotalVotes, ({ country, onTotalVotes }) => ({
  path: `vetos-votes-yes-total/${country}`,
  params: [
    ['orderByChild', 'total'],
    ['limitToLast', 10]
  ],
  on: {
    value: snapshot => onTotalVotes(country, snapshot.val())
  }
}));

export default connect(({ countries }, { country }) => ({
  totalVotes: countries.totalVotesPerCountry.get(country)
}), countriesActions)(TotalVotes);
