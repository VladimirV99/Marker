import axios from 'axios';

import { returnErrors } from './errorActions';
import {
  FORUMS_LOADING,
  FORUMS_LOADED,
  THREADS_LOADING,
  THREADS_LOADED
} from './types';

export const loadForums = () => dispatch => {
  dispatch({ type: FORUMS_LOADING });
  axios.get('/api/forums/all').then(res => {
    dispatch({
      type: FORUMS_LOADED,
      payload: res.data
    });
  }).catch(err => {
    dispatch(returnErrors(err.response.data.message, err.response.status));
    // TODO Add Dispatch To Stop Loading
  });
};

export const loadThreads = (forum_id, page) => dispatch => {
  dispatch({ type: THREADS_LOADING });
  axios.get(`/api/forums/get/${forum_id}/page/${page}/5`).then(res => {
    dispatch({
      type: THREADS_LOADED,
      payload: res.data
    });
  }).catch(err => {
    dispatch(returnErrors(err.response.data.message, err.response.status));
  });
};