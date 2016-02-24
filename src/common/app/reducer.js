import { combineReducers } from 'redux';
import { reduxFields } from '../lib/redux-fields';
import { routerReducer as routing } from 'react-router-redux';

import auth from '../auth/reducer';
import device from '../device/reducer';
import intl from '../intl/reducer';
import users from '../users/reducer';

const appReducer = combineReducers({
  auth,
  device,
  intl,
  reduxFields,
  routing,
  users
});

export default appReducer;
