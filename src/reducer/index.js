import { combineReducers } from 'redux';
import { auth } from './auth';

const OMS_APP = combineReducers({
  auth
});

export default OMS_APP;