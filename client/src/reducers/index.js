import { combineReducers } from 'redux';
import alertReducer from './alertReducer';
import authReducer from './authReducer';
import categoriesPageReducer from './categoriesPageReducer';
import categoryPageReducer from './categoryPageReducer';
import forumPageReducer from './forumPageReducer';

export default combineReducers({
  alert: alertReducer,
  auth: authReducer,
  categoriesPage: categoriesPageReducer,
  categoryPage: categoryPageReducer,
  forumPage: forumPageReducer
});