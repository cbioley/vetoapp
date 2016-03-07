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
  votes: Map()
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

    case actions.ON_VOTE:
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
