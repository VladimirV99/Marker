import {
  FORUMS_LOADING,
  FORUMS_LOADED
} from '../actions/types';

const initialState = {
  forums: [],
  isLoading: false
};

export default function(state = initialState, action) {
  switch(action.type) {
    case FORUMS_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case FORUMS_LOADED:
      return {
        ...state,
        forums: action.payload.forums,
        isLoading: false
      };
    default:
      return state;
  }
}