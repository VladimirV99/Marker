import axios from 'axios';

import { addAlert } from './alertActions';
import { createAuthHeaders } from './authActions';
import {
  THREADS_LOADING,
  THREADS_LOADED,
  THREADS_RESET
} from './types';
import { itemsPerPage } from '../util/Constants';

export const loadThreads = (forum_id, page, history) => dispatch => {
  dispatch({ type: THREADS_LOADING });
  axios.get(`/api/forums/get/${forum_id}/page/${page}/${itemsPerPage}`).then(res => {
    dispatch({
      type: THREADS_LOADED,
      payload: res.data
    });
  }).catch(err => {
    dispatch({ type: THREADS_RESET });
    if(err.response.status === 404)
      history.push('/');
    dispatch(addAlert(err.response.data.message, 'error', err.response.status));
  });
};

export const createThread = (newThread, history) => (dispatch, getState) => {
  axios.post('/api/threads/create', newThread, createAuthHeaders(getState())).then(res => {
    history.push(`/thread/${res.data.thread.id}`);
  }).catch(err => {
    dispatch(addAlert(err.response.data.message, 'error', err.response.status));
  });
};