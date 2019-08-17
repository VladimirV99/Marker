import { SET_ALERT, CLEAR_ALERT } from '../actions/types';

const initialState = {
  message: '',
  type: 'error',
  status: null
};

export default function(state = initialState, action) {
  switch(action.type) {
    case SET_ALERT:
      return {
        message: action.payload.message,
        type: action.payload.type || 'error',
        status: action.payload.status
      };
    case CLEAR_ALERT:
      return {
        message: '',
        type: '',
        status: null
      };
    default:
      return state;
  }
}