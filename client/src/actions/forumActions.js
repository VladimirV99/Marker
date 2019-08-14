import axios from 'axios';

import { returnErrors } from './errorActions';
import { createAuthHeaders } from './authActions';
import {
  FORUMS_LOADING,
  FORUMS_LOADED,
  THREADS_LOADING,
  THREADS_LOADED,
  POSTS_LOADING,
  POSTS_LOADED
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
    // TODO Add Dispatch To Stop Loading and Reset state
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

export const createThread = (newThread, history) => (dispatch, getState) => {
  axios.post('/api/threads/create', newThread, createAuthHeaders(getState)).then(res => {
    history.push(`/thread/${res.data.thread.id}`);
  }).catch(err => {
    dispatch(returnErrors(err.response.data.message, err.response.status));
  });
};

export const loadPosts = (thread_id, page) => dispatch => {
  dispatch({ type: POSTS_LOADING });
  axios.get(`/api/threads/get/${thread_id}/page/${page}/15`).then(res => {
    dispatch({
      type: POSTS_LOADED,
      payload: res.data
    });
  }).catch(err => {
    dispatch(returnErrors(err.response.data.message, err.response.status));
  });
};