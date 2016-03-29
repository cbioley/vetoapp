export const ON_USER = 'ON_USER';
export const SET_VIEWER_IS_ADMIN = 'SET_VIEWER_IS_ADMIN';

export function onUser(userId, user) {
  return {
    type: ON_USER,
    payload: { userId, user }
  };
}

export function setViewerIsAdmin(isAdmin) {
  return {
    type: SET_VIEWER_IS_ADMIN,
    payload: { isAdmin }
  };
}
