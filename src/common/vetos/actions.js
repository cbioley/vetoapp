import Veto from '../../common/vetos/veto';

export const MORE_LAST_VETOS = 'MORE_LAST_VETOS';
export const SET_LAST_VETOS = 'SET_LAST_VETOS';
export const SUGGEST_VETO_ERROR = 'SUGGEST_VETO_ERROR';
export const SUGGEST_VETO_START = 'SUGGEST_VETO_START';
export const SUGGEST_VETO_SUCCESS = 'SUGGEST_VETO_SUCCESS';

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
    const promise = validate(veto)
      .prop('name').required()
      .prop('reason').required()
      .promise
      .then(() => firebase.child('vetos').child(veto.id).set(veto));
    return {
      type: 'SUGGEST_VETO',
      payload: { promise }
    };
  };
}
