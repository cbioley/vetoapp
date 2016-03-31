import Veto from '../../common/vetos/Veto';
import Vote from '../../common/vetos/Vote';

export const DELETE_VETO = 'DELETE_VETO';
export const MORE_LAST_VETOS = 'MORE_LAST_VETOS';
export const ON_LAST_VETOS = 'ON_LAST_VETOS';
export const ON_USER_VETOS = 'ON_USER_VETOS';
export const ON_USER_YES_VOTES = 'ON_USER_YES_VOTES';
export const ON_VOTE = 'ON_VOTE';
export const ON_VOTE_YES_TOTAL = 'ON_VOTE_YES_TOTAL';
export const SAVE_VETO = 'SAVE_VETO';
export const SET_VETO = 'SET_VETO';
export const SET_VOTE = 'SET_VOTE';
export const SUGGEST_VETO_ERROR = 'SUGGEST_VETO_ERROR';
export const SUGGEST_VETO_START = 'SUGGEST_VETO_START';
export const SUGGEST_VETO_SUCCESS = 'SUGGEST_VETO_SUCCESS';

// TODO: Localize name and reason.
const validateVeto = (validate, veto) => validate(veto)
  .prop('name').required()
  .prop('reason').required().fewWordsAtLeast()
  .promise;

export function deleteVeto(veto) {
  return ({ firebase }) => {
    // Yes, complex update from the client, but Firebase security rules ensure
    // viewer can change only own data, so it's safe.
    const promise = firebase.update({
      [`vetos/${veto.id}`]: null,
      [`vetos-archived/${veto.id}`]: veto
    });
    return {
      type: DELETE_VETO,
      payload: { promise }
    };
  };
}

export function moreLastVetos() {
  return {
    type: MORE_LAST_VETOS
  };
}

export function onLastVetos(vetos) {
  return {
    type: ON_LAST_VETOS,
    payload: { vetos }
  };
}

export function onUserVetos(userId, vetos) {
  return {
    type: ON_USER_VETOS,
    payload: { userId, vetos }
  };
}

export function onUserYesVotes(userId, votes) {
  return {
    type: ON_USER_YES_VOTES,
    payload: { userId, votes }
  };
}

export function onVote(voteId, vote) {
  return {
    type: ON_VOTE,
    payload: { voteId, vote }
  };
}

export function onVoteYesTotal(vetoId, voteTotal) {
  return {
    type: ON_VOTE_YES_TOTAL,
    payload: { vetoId, voteTotal }
  };
}

export function saveVeto(veto) {
  return ({ firebase, validate }) => {
    veto = { ...veto, updatedAt: firebase.constructor.ServerValue.TIMESTAMP };
    const promise = validateVeto(validate, veto)
      .then(() => firebase.child('vetos').child(veto.id).set(veto));
    return {
      type: SAVE_VETO,
      payload: { promise }
    };
  };
}

export function setVeto(id, json) {
  return {
    type: SET_VETO,
    payload: { id, json }
  };
}

export function setVote(veto, yes) {
  return ({ firebase, getState }) => {
    const { viewer } = getState().users;
    const vote = new Vote({
      createdAt: firebase.constructor.ServerValue.TIMESTAMP,
      userId: viewer.id,
      vetoCountry: veto.country,
      vetoCreatorDisplayName: veto.creatorDisplayName,
      vetoCreatorId: veto.creatorId,
      vetoId: veto.id,
      vetoMunicipality: veto.municipality,
      vetoName: veto.name,
      yes
    });
    const voteId = vote.id;
    const voteJson = vote.toJS();
    // Note we don't use promise, because queue is processed on the server, and
    // we don't want to wait for a response. Instead of that we prefer an
    // optimistic update, which also works well for offline scenarios.
    // TODO: Handle error.
    firebase.child('vetos-votes-queue/tasks').push(voteJson);
    return {
      type: SET_VOTE,
      payload: { voteId, vote: voteJson }
    };
  };
}

export function suggestVeto(fields) {
  return ({ firebase, getState, getUid, validate }) => {
    const { viewer } = getState().users;
    const veto = new Veto().merge({
      ...fields, // name, reason, country
      createdAt: firebase.constructor.ServerValue.TIMESTAMP,
      creatorDisplayName: viewer.displayName || viewer.email,
      creatorId: viewer.id,
      creatorProfileImageURL: viewer.profileImageURL,
      id: getUid(),
      updatedAt: firebase.constructor.ServerValue.TIMESTAMP
    }).toJS();
    const promise = validateVeto(validate, veto)
      .then(() => firebase.child('vetos').child(veto.id).set(veto))
      .then(() => veto);
    return {
      type: 'SUGGEST_VETO',
      payload: { promise }
    };
  };
}
