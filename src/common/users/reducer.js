import * as actions from './actions';
import User from './user';
import { Record, Seq } from 'immutable';
import { firebaseActions } from '../lib/redux-firebase';
import { mapAuthToUser } from '../lib/redux-firebase';

const InitialState = Record({
  list: undefined,
  viewer: undefined,
  viewerIsAdmin: undefined
});
const initialState = new InitialState;

const revive = ({ viewer }) => initialState.merge({
  // Handle user authenticated on the server.
  viewer: viewer ? new User(viewer) : null
});

export default function usersReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return revive(state);

  switch (action.type) {

    case firebaseActions.REDUX_FIREBASE_ON_AUTH: {
      const { authData } = action.payload;
      // Handle user logout.
      if (!authData) {
        return state.delete('viewer');
      }
      const user = new User(mapAuthToUser(authData));
      return state.set('viewer', user);
    }

    case actions.ON_USERS_LIST: {
      const { users } = action.payload;
      const list = Seq(users)
        .map(json => new User(json))
        .sortBy(user => -user.authenticatedAt)
        .toList();
      return state.set('list', list);
    }

    case actions.SET_VIEWER_IS_ADMIN: {
      const { isAdmin } = action.payload;
      return state.set('viewerIsAdmin', isAdmin);
    }

  }

  return state;
}
