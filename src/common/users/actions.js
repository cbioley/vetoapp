export const ON_USERS_LIST = 'ON_USERS_LIST';
export const SET_VIEWER_IS_ADMIN = 'SET_VIEWER_IS_ADMIN';

export function onUsersList(users) {
  return {
    type: ON_USERS_LIST,
    payload: { users }
  };
}

export function setViewerIsAdmin(isAdmin) {
  return {
    type: SET_VIEWER_IS_ADMIN,
    payload: { isAdmin }
  };
}
