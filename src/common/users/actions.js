export const SET_USERS_LIST = 'SET_USERS_LIST';
export const SET_VIEWER_IS_ADMIN = 'SET_VIEWER_IS_ADMIN';

export function setUsersList(users) {
  return {
    type: SET_USERS_LIST,
    payload: { users }
  };
}

export function setViewerIsAdmin(isAdmin) {
  return {
    type: SET_VIEWER_IS_ADMIN,
    payload: { isAdmin }
  };
}
