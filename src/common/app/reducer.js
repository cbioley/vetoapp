import { combineReducers } from 'redux';
import { reduxFields } from '../lib/redux-fields';
import { routerReducer as routing } from 'react-router-redux';

import auth from '../auth/reducer';
import config from '../config/reducer';
import countries from '../countries/reducer';
import device from '../device/reducer';
import intl from '../intl/reducer';
import users from '../users/reducer';
import vetos from '../vetos/reducer';

export default combineReducers({
  auth,
  config,
  countries,
  device,
  intl,
  reduxFields,
  routing,
  users,
  vetos
});
