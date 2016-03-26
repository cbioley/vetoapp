import * as actions from './actions';
import VoteTotal from '../vetos/VoteTotal';
import { Map, Record, Seq } from 'immutable';

const InitialState = Record({
  totalVotesPerCountry: Map()
});
const initialState = new InitialState;

// const revive = ({ totalVotesPerCountry }) => initialState.merge({
//   // TODO: Revive state.totalVotesPerCountry.
//   // totalVotesPerCountry: Map(totalVotesPerCountry)
// });

export default function usersReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState; // revive(state);

  switch (action.type) {

    case actions.ON_TOTAL_VOTES: {
      const { country, totalVotes } = action.payload;
      const list = Seq(totalVotes)
        .map(json => new VoteTotal(json))
        .sortBy(voteTotal => voteTotal.total)
        .reverse()
        .toList();
      return state.setIn(['totalVotesPerCountry', country], list);
    }

  }

  return state;
}
