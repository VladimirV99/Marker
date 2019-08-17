import { combineReducers } from 'redux';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import categoryReducer from './categoryReducer';
import forumReducer from './forumReducer';
import threadReducer from './threadReducer';
import postReducer from './postReducer';

export default combineReducers({
  error: errorReducer,
  auth: authReducer,
  category: categoryReducer,
  forum: forumReducer,
  thread: threadReducer,
  post: postReducer
});