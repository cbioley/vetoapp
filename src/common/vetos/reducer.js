import * as actions from './actions';
import Veto from './veto';
import { Record, Seq } from 'immutable';

const lastVetosPageSize = 4;

const InitialState = Record({
  lastVetos: null,
  lastVetosLimitToLast: lastVetosPageSize,
  suggestVetoFormDisabled: false,
  suggestVetoFormError: null
});
const initialState = new InitialState;

export default function vetosReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState;

  switch (action.type) {

    case actions.MORE_LAST_VETOS: {
      return state.update('lastVetosLimitToLast', lastVetosLimitToLast =>
        lastVetosLimitToLast += lastVetosPageSize
      );
    }

    case actions.SET_LAST_VETOS: {
      const { vetos } = action.payload;
      const list = Seq(vetos)
        .map(json => new Veto(json))
        .sortBy(veto => -veto.createdAt)
        .toList();
      return state.set('lastVetos', list);
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
