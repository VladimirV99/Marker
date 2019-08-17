import axios from 'axios';

import { createAlert } from './alertActions';
import {
  USER_LOADING,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL
} from './types';

export const loadUser = () => (dispatch, getState) => {
  if(getState().auth.token) {
    dispatch({ type: USER_LOADING });

    axios.get('/api/users/profile', createAuthHeaders(getState)).then(res => {
      dispatch({
        type: USER_LOADED,
        payload: res.data
      });
    }).catch(err => {
      dispatch(createAlert(err.response.data.message, 'error', err.response.status));
      dispatch({
        type: AUTH_ERROR
      });
    });
  }
};

export const register = ({ username, first_name, last_name, email, password }) => dispatch => {
  const body = JSON.stringify({ username, first_name, last_name, email, password });
  axios.post('/api/users/register', body, createHeaders()).then(res => {
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
  }).catch(err => {
    dispatch(createAlert(err.response.data.message, 'error', err.response.status));
    dispatch({
      type: REGISTER_FAIL
    });
  });
};

export const login = ({ username, password }) => dispatch => {
  const body = JSON.stringify({ username, password });
  axios.post('/api/users/login', body, createHeaders()).then(res => {
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    })
  }).catch(err => {
    dispatch(createAlert(err.response.data.message, 'error', err.response.status));
    dispatch({
      type: LOGIN_FAIL
    });
  });
};

export const logout = () => {
  return {
    type: LOGOUT_SUCCESS
  };
};

export const createHeaders = () => {
  return {
    headers: {
      'Content-Type': 'application/json'
    }
  };
}

export const createAuthHeaders = getState => {
  const token = getState().auth.token;
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  if(token) {
    config.headers['Authorization'] = token;
  }
  return config;
}