import axios from 'axios';

import { returnErrors } from './errorActions';
import {
  CATEGORIES_LOADING,
  CATEGORIES_LOADED,
  CATEGORIES_RESET
} from './types';

export const loadCategories = () => dispatch => {
  dispatch({ type: CATEGORIES_LOADING });
  axios.get('/api/forums/all').then(res => {
    dispatch({
      type: CATEGORIES_LOADED,
      payload: res.data
    });
  }).catch(err => {
    dispatch(returnErrors(err.response.data.message, err.response.status));
    dispatch({ type: CATEGORIES_RESET });
  });
};