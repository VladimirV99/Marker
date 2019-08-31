import { ALERT_ADD, ALERT_DISMISS, ALERTS_CLEAR } from '../actions/types';

const initialState = {
  list: []
};

export default function(state = initialState, action) {
  switch(action.type) {
    case ALERT_ADD:
      return {
        ...state,
        list: [
          ...state.list,
          { 
            id: state.list.length+1,
            message: action.payload.message || 'Something went wrong',
            type: action.payload.type || 'error',
            status: action.payload.status || 500
          }
        ]
      };
    case ALERT_DISMISS:
      return {
        ...state.list,
        list: state.list.filter(alert => alert.id!==action.payload),
      }
    case ALERTS_CLEAR:
      return {
        ...state,
        list: []
      };
    default:
      return state;
  }
}