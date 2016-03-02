import Veto from '../../common/vetos/veto';

// Note there is no Firebase or whatever implementation leak in consts.
export const DELETE_VETO = 'DELETE_VETO';
export const MORE_LAST_VETOS = 'MORE_LAST_VETOS';
export const SET_LAST_VETOS = 'SET_LAST_VETOS';
export const SET_USER_VETOS = 'SET_USER_VETOS';
export const SET_VETO = 'SET_VETO';
export const SUGGEST_VETO_ERROR = 'SUGGEST_VETO_ERROR';
export const SUGGEST_VETO_START = 'SUGGEST_VETO_START';
export const SUGGEST_VETO_SUCCESS = 'SUGGEST_VETO_SUCCESS';

export function deleteVeto(vetoId) {
  return ({ firebase }) => {
    // TODO: Move to vetos-archived via deep update.
    const promise = firebase.child('vetos').child(vetoId).remove();
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

export function setLastVetos(vetos) {
  return {
    type: SET_LAST_VETOS,
    payload: { vetos }
  };
}

export function setUserVetos(userId, vetos) {
  return {
    type: SET_USER_VETOS,
    payload: { userId, vetos }
  };
}

export function setVeto(id, json) {
  return {
    type: SET_VETO,
    payload: { id, json }
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
    // TODO: Localize name and reason.
    const promise =
      validate(veto)
        .prop('name').required()
        .prop('reason').required().fewWordsAtLeast()
        .promise
      .then(() => firebase.child('vetos').child(veto.id).set(veto))
      .then(() => veto);
    return {
      type: 'SUGGEST_VETO',
      payload: { promise }
    };
  };
}
