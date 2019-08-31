import axios from 'axios';

import { addAlert } from './alertActions';
import { createAuthHeaders } from './authActions';
import {
  CATEGORIES_LOADING,
  CATEGORIES_LOADED,
  CATEGORIES_RESET,
  CATEGORY_ADD
} from './types';

export const loadCategories = () => dispatch => {
  dispatch({ type: CATEGORIES_LOADING });
  axios.get('/api/forums/all').then(res => {
    dispatch({
      type: CATEGORIES_LOADED,
      payload: res.data
    });
  }).catch(err => {
    dispatch(addAlert(err.response.data.message, 'error', err.response.status));
    dispatch({ type: CATEGORIES_RESET });
  });
};

export const createCategory = (newCategory) => (dispatch, getState) => {
  axios.post('/api/categories/create', newCategory, createAuthHeaders(getState())).then(res => {
    res.data.category.forums = [];
    dispatch({
      type: CATEGORY_ADD,
      payload: res.data.category
    });
  }).catch(err => {
    dispatch(addAlert(err.response.data.message, 'error', err.response.status));
  });
};