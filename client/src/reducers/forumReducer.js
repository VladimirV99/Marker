import {
  FORUMS_LOADING,
  FORUMS_LOADED,
  FORUMS_RESET
} from '../actions/types';

const initialState = {
  category: null,
  forums: [],
  isLoading: true
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
        category: action.payload.category,
        forums: action.payload.forums,
        isLoading: false
      };
    case FORUMS_RESET:
      return {
        ...state,
        category: null,
        forums: [],
        isLoading: false
      };
    default:
      return state;
  }
}