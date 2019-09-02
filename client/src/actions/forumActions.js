import axios from 'axios';

import { addAlert } from './alertActions';
import { createAuthHeaders } from './authActions';
import {
  FORUMS_LOADING,
  FORUMS_LOADED,
  FORUMS_RESET,
  CATEGORIES_ADD_FORUM
} from './types';

export const loadForums = (category_id) => dispatch => {
  dispatch({ type: FORUMS_LOADING });
  axios.get(`/api/forums/category/${category_id}`).then(res => {
    dispatch({
      type: FORUMS_LOADED,
      payload: res.data
    });
  }).catch(err => {
    dispatch(addAlert(err.response.data.message, 'error', err.response.status));
    dispatch({ type: FORUMS_RESET });
  });
};

export const createForum = (newForum) => (dispatch, getState) => {
  axios.post('/api/forums/create', newForum, createAuthHeaders(getState())).then(res => {
    dispatch({
      type: CATEGORIES_ADD_FORUM,
      payload: {
        category_id: newForum.category,
        forum: res.data.forum
      }
    });
  }).catch(err => {
    dispatch(addAlert(err.response.data.message, 'error', err.response.status));
  });
};