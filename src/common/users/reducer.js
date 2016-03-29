import * as actions from './actions';
import User from './user';
import { Map, Record, Seq } from 'immutable';
import { firebaseActions } from '../lib/redux-firebase';
import { mapAuthToUser } from '../lib/redux-firebase';

const InitialState = Record({
  map: Map(),
  viewer: undefined,
  viewerIsAdmin: undefined
});
const initialState = new InitialState;

const jsonToUser = json => json && new User(json);

const revive = ({ map }) => initialState.merge({
  map: Seq(map).map(jsonToUser).toMap()
});

export default function usersReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return revive(state);

  switch (action.type) {

    case actions.ON_USER: {
      const { userId, user } = action.payload;
      return state.setIn(['map', userId], jsonToUser(user));
    }

    case actions.SET_VIEWER_IS_ADMIN: {
      const { isAdmin } = action.payload;
      return state.set('viewerIsAdmin', isAdmin);
    }

    case firebaseActions.REDUX_FIREBASE_ON_AUTH: {
      const { authData } = action.payload;
      // Handle user logout.
      if (!authData) {
        return state.delete('viewer');
      }
      const user = new User(mapAuthToUser(authData));
      return state.set('viewer', user);
    }

  }

  return state;
}
