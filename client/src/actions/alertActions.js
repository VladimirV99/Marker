import { SET_ALERT, CLEAR_ALERT } from './types';

export const createAlert = (message, type, status) => {
  return {
    type: SET_ALERT,
    payload: { message, type }
  };
};

export const clearAlert = () => {
  return {
    type: CLEAR_ALERT
  };
};