import { SET_ALERT, CLEAR_ALERT } from './types';

export const createAlert = (message, type, status) => {
  return {
    type: SET_ALERT,
    payload: { message, type }
  };
};

export const clearErrors = () => {
  return {
    type: CLEAR_ALERT
  };
};