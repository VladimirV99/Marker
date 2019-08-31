import { ALERT_ADD, ALERT_DISMISS, ALERTS_CLEAR } from './types';

export const addAlert = (message, type, status) => {
  return {
    type: ALERT_ADD,
    payload: { message, type, status }
  };
};

export const dismissAlert = id => {
  return {
    type: ALERT_DISMISS,
    payload: id
  }
}

export const clearAlerts = () => {
  return {
    type: ALERTS_CLEAR
  };
};