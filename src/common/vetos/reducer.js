import * as actions from './actions';
import Veto from './Veto';
import Vote from './Vote';
import { List, Map, Record } from 'immutable';
import { onList } from '../lib/redux-firebase';

const lastVetosPageSize = 10;

const InitialState = Record({
  lastVetos: null,
  lastVetosLimitToLast: lastVetosPageSize,
  map: Map(),
  suggestVetoFormDisabled: false,
  suggestVetoFormError: null,
  usersVetos: Map(),
  usersVotes: Map(),
  usersYesVotes: Map(),
  votes: Map(),
  votesYesTotals: Map()
});
const initialState = new InitialState;

const vetoJsonToVeto = json => json && new Veto(json);
const vetosJsonToMap = json => Map(json).map(vetoJsonToVeto);
const vetosJsonToSortedByCreatedAtList = json => vetosJsonToMap(json)
  .sortBy(veto => -veto.createdAt)
  .toList();
const voteJsonToVote = json => json && new Vote(json);

// Don't revive usersVetos and usersYesVotes because user isn't server authed.
// TODO: Revive usersVetos, protože sosal z open, a chci to pro bota, ok.
const revive = state => initialState.merge({
  lastVetos: vetosJsonToSortedByCreatedAtList(state.lastVetos),
  lastVetosLimitToLast: state.lastVetosLimitToLast,
  map: vetosJsonToMap(state.map),
  usersVotes: Map(state.usersVotes).map(array => List(array || [])
    .map(json => voteJsonToVote(json))),
  votes: Map(state.votes).map(voteJsonToVote),
  votesYesTotals: Map(state.votesYesTotals)
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

    case actions.ON_USER_VOTE: {
      const { eventType, key, prevChildKey, props, value } = action.payload;
      const { params: { vetoId } } = props;
      return state.updateIn(['usersVotes', vetoId], (votes = List()) =>
        onList(votes, eventType, key, prevChildKey, value, 'userId', Vote)
          .sortBy(item => -item.createdAt)
      );
    }

    case actions.ON_USER_YES_VOTES: {
      const { userId, votes } = action.payload;
      const list = votes && Map(votes)
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
