import {
  FORUMS_LOADING,
  FORUMS_LOADED,
  FORUMS_RESET
} from '../actions/types';

const initialState = {
  category: null,
  forums: [],
  isLoaded: false,
  errorLoading: false
};

export default function(state = initialState, action) {
  switch(action.type) {
    case FORUMS_LOADING:
      return {
        ...state,
        isLoaded: false
      };
    case FORUMS_LOADED:
      return {
        ...state,
        category: action.payload.category,
        forums: action.payload.forums,
        isLoaded: true
      };
    case FORUMS_RESET:
      return {
        ...state,
        category: null,
        forums: [],
        isLoaded: false,
        errorLoading: true
      };
    default:
      return state;
  }
}