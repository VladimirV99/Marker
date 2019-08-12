import axios from 'axios';

import { returnErrors } from './errorActions';
import {
  FORUMS_LOADING,
  FORUMS_LOADED
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