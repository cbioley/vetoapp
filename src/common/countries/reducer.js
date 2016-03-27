import * as actions from './actions';
import VoteTotal from '../vetos/VoteTotal';
import { Map, Record, Seq } from 'immutable';

const InitialState = Record({
  totalVotesPerCountry: Map()
});
const initialState = new InitialState;

const totalVotesToList = totalVotes => Seq(totalVotes)
  .map(json => new VoteTotal(json))
  .sortBy(voteTotal => -voteTotal.total)
  .toList();

const revive = ({ totalVotesPerCountry }) => initialState.merge({
  totalVotesPerCountry: Map(totalVotesPerCountry)
    .map(totalVotes => totalVotesToList(totalVotes))
});

export default function usersReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return revive(state);

  switch (action.type) {

    case actions.ON_TOTAL_VOTES: {
      const { country, totalVotes } = action.payload;
      const list = totalVotesToList(totalVotes);
      return state.setIn(['totalVotesPerCountry', country], list);
    }

  }

  return state;
}
