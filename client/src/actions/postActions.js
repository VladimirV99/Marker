import axios from 'axios';

import { createAlert } from './alertActions';
import { createAuthHeaders } from './authActions';
import {
  POSTS_LOADING,
  POSTS_LOADED,
  POSTS_RESET,
  ADD_POST,
  DELETE_POST
} from './types';

export const loadPosts = (thread_id, page) => dispatch => {
  dispatch({ type: POSTS_LOADING });
  axios.get(`/api/threads/get/${thread_id}/page/${page}/15`).then(res => {
    dispatch({
      type: POSTS_LOADED,
      payload: res.data
    });
  }).catch(err => {
    dispatch(createAlert(err.response.data.message, 'error', err.response.status));
    dispatch({ type: POSTS_RESET });
  });
};

export const createPost = (newPost) => (dispatch, getState) => {
  axios.post('/api/posts/create', newPost, createAuthHeaders(getState)).then(res => {
    dispatch({
      type: ADD_POST,
      payload: res.data
    });
  }).catch(err => {
    dispatch(createAlert(err.response.data.message, 'error', err.response.status));
  });
};

export const deletePost = (id) => (dispatch, getState) => {
  axios.delete(`/api/posts/delete/${id}`, createAuthHeaders(getState)).then(res => {
    dispatch({
      type: DELETE_POST,
      payload: id
    })
  }).catch(err => {
    dispatch(createAlert(err.response.data.message, 'error', err.response.status));
  });
};