import axios from 'axios';

import { createAlert } from './alertActions';
import { createAuthHeaders } from './authActions';
import {
  CATEGORIES_ADD_FORUM
} from './types';

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
    dispatch(createAlert(err.response.data.message, 'error', err.response.status));
  });
};