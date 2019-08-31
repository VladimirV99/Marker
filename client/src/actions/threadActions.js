import axios from 'axios';

import { addAlert } from './alertActions';
import { createAuthHeaders } from './authActions';
import {
  THREADS_LOADING,
  THREADS_LOADED,
  THREADS_RESET
} from './types';

export const loadThreads = (forum_id, page) => dispatch => {
  dispatch({ type: THREADS_LOADING });
  axios.get(`/api/forums/get/${forum_id}/page/${page}/5`).then(res => {
    dispatch({
      type: THREADS_LOADED,
      payload: res.data
    });
  }).catch(err => {
    dispatch(addAlert(err.response.data.message, 'error', err.response.status));
    dispatch({ type: THREADS_RESET });
  });
};

export const createThread = (newThread, history) => (dispatch, getState) => {
  axios.post('/api/threads/create', newThread, createAuthHeaders(getState())).then(res => {
    history.push(`/thread/${res.data.thread.id}`);
  }).catch(err => {
    dispatch(addAlert(err.response.data.message, 'error', err.response.status));
  });
};