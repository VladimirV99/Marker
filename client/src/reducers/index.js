import { combineReducers } from 'redux';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import forumReducer from './forumReducer';

export default combineReducers({
  error: errorReducer,
  auth: authReducer,
  forum: forumReducer
});