import axios from 'axios';

import { addAlert } from './alertActions';
import { createAuthHeaders } from './authActions';
import {
  POSTS_LOADING,
  POSTS_LOADED,
  POSTS_RESET,
  ADD_POST,
  DELETE_POST
} from './types';

export const loadPosts = (thread_id, page, history) => dispatch => {
  dispatch({ type: POSTS_LOADING });
  axios.get(`/api/threads/get/${thread_id}/page/${page}/15`).then(res => {
    dispatch({
      type: POSTS_LOADED,
      payload: res.data
    });
  }).catch(err => {
    dispatch({ type: POSTS_RESET });
    if(err.response.status === 404)
      history.push('/');
    dispatch(addAlert(err.response.data.message, 'error', err.response.status));
  });
};

export const createPost = (newPost) => (dispatch, getState) => {
  axios.post('/api/posts/create', newPost, createAuthHeaders(getState())).then(res => {
    dispatch({
      type: ADD_POST,
      payload: res.data
    });
  }).catch(err => {
    dispatch(addAlert(err.response.data.message, 'error', err.response.status));
  });
};

export const deletePost = (id) => (dispatch, getState) => {
  axios.delete(`/api/posts/delete/${id}`, createAuthHeaders(getState())).then(res => {
    dispatch({
      type: DELETE_POST,
      payload: id
    })
  }).catch(err => {
    dispatch(addAlert(err.response.data.message, 'error', err.response.status));
  });
};