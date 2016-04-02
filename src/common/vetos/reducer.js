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
  usersYesVotes: Map(),
  votes: Map(),
  votesYesTotals: Map()
});
const initialState = new InitialState;

const vetoJsonToVeto = json => json && new Veto(json);
const vetosJsonToMap = json => Seq(json).map(vetoJsonToVeto).toMap();
const vetosJsonToSortedByCreatedAtList = json => vetosJsonToMap(json)
  .sortBy(veto => -veto.createdAt)
  .toList();
const voteJsonToVote = json => json && new Vote(json);

// Don't revive usersVetos and usersYesVotes because user isn't server authed.
const revive = state => initialState.merge({
  lastVetos: vetosJsonToSortedByCreatedAtList(state.lastVetos),
  lastVetosLimitToLast: state.lastVetosLimitToLast,
  map: vetosJsonToMap(state.map),
  votes: Seq(state.votes).map(voteJsonToVote).toMap(),
  votesYesTotals: Seq(state.votesYesTotals).toMap()
});

export default function vetosReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return revive(state);

  switch (action.type) {

    case actions.DELETE_VETO: {
      const { veto } = action.payload;
      return state.deleteIn(['map', veto.id]);
    }

    case actions.MORE_LAST_VETOS: {
      return state.update('lastVetosLimitToLast', lastVetosLimitToLast =>
        lastVetosLimitToLast + lastVetosPageSize);
    }

    case actions.ON_LAST_VETOS: {
      const { vetos } = action.payload;
      const list = vetosJsonToSortedByCreatedAtList(vetos);
      return state
        .mergeIn(['map'], vetosJsonToMap(vetos))
        .set('lastVetos', list);
    }

    case actions.ON_USER_VETOS: {
      const { userId, vetos } = action.payload;
      const list = vetosJsonToSortedByCreatedAtList(vetos);
      return state
        .mergeIn(['map'], vetosJsonToMap(vetos))
        .setIn(['usersVetos', userId], list);
    }

    case actions.ON_USER_YES_VOTES: {
      const { userId, votes } = action.payload;
      const list = votes && Seq(votes)
        .map(voteJsonToVote)
        .sortBy(vote => -vote.createdAt)
        .toList();
      return state.setIn(['usersYesVotes', userId], list);
    }

    case actions.ON_VOTE:
    case actions.SET_VOTE: {
      const { voteId, vote } = action.payload;
      return state.setIn(['votes', voteId], voteJsonToVote(vote));
    }

    case actions.ON_VOTE_YES_TOTAL: {
      const { vetoId, voteTotal } = action.payload;
      return state.setIn(['votesYesTotals', vetoId], voteTotal);
    }

    case actions.ON_VETO: {
      const { id, json } = action.payload;
      const veto = json ? new Veto(json) : null;
      return state.setIn(['map', id], veto);
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
