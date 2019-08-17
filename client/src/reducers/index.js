import { combineReducers } from 'redux';
import alertReducer from './alertReducer';
import authReducer from './authReducer';
import categoryReducer from './categoryReducer';
import forumReducer from './forumReducer';
import threadReducer from './threadReducer';
import postReducer from './postReducer';

export default combineReducers({
  alert: alertReducer,
  auth: authReducer,
  category: categoryReducer,
  forum: forumReducer,
  thread: threadReducer,
  post: postReducer
});