import * as actions from './actions';
import Veto from './Veto';
import Vote from './Vote';
import { Map, Record, Seq } from 'immutable';

const lastVetosPageSize = 10;

const InitialState = Record({
  lastVetos: null,
  lastVetosLimitToLast: lastVetosPageSize,
  map: Map(),
  suggestVetoFormDisabled: false,
  suggestVetoFormError: null,
  usersVetos: Map(),
  votes: Map(),
  votesYesTotal: Map()
});
const initialState = new InitialState;

const vetosToSortedByCreatedAtList = vetos => Seq(vetos)
  .map(json => new Veto(json))
  .sortBy(veto => -veto.createdAt)
  .toList();

export default function vetosReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState;

  switch (action.type) {

    case actions.MORE_LAST_VETOS: {
      return state.update('lastVetosLimitToLast', lastVetosLimitToLast =>
        lastVetosLimitToLast + lastVetosPageSize);
    }

    case actions.ON_VOTE: {
      const { voteId, vote } = action.payload;
      // undefined is absence of evidence, null is evidence of absence :-)
      // Because app state servers as data cache, we distinguish null and
      // undefined in UI to show Loading component.
      const value = vote ? new Vote(vote) : null;
      return state.setIn(['votes', voteId], value);
    }

    case actions.ON_VOTE_YES_TOTAL: {
      const { vetoId, total } = action.payload;
      return state.setIn(['votesYesTotal', vetoId], total);
    }

    case actions.SET_LAST_VETOS: {
      const { vetos } = action.payload;
      const list = vetosToSortedByCreatedAtList(vetos);
      return state
        .mergeIn(['map'], Map(vetos).map(json => new Veto(json)))
        .set('lastVetos', list);
    }

    case actions.SET_USER_VETOS: {
      const { userId, vetos } = action.payload;
      const list = vetosToSortedByCreatedAtList(vetos);
      return state
        .mergeIn(['map'], Map(vetos).map(json => new Veto(json)))
        .setIn(['usersVetos', userId], list);
    }

    case actions.SET_VETO: {
      const { id, json } = action.payload;
      const veto = json ? new Veto(json) : null;
      return state.setIn(['map', id], veto);
    }

    case actions.SET_VOTE: {
      const vote = new Vote(action.payload.vote);
      return state.setIn(['votes', vote.id], vote);
    }

    case actions.SUGGEST_VETO_START:
      return state.set('suggestVetoFormDisabled', true);

    case actions.SUGGEST_VETO_ERROR:
      return state.merge({
        suggestVetoFormDisabled: false,
        suggestVetoFormError: action.payload
      });

    case actions.SUGGEST_VETO_SUCCESS:
      return state.merge({
        suggestVetoFormDisabled: false,
        suggestVetoFormError: null
      });

  }

  return state;
}
