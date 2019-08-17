import {
  CATEGORIES_LOADING,
  CATEGORIES_LOADED,
  CATEGORIES_RESET
} from '../actions/types';

const initialState = {
  categories: [],
  isLoading: false
};

export default function(state = initialState, action) {
  switch(action.type) {
    case CATEGORIES_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case CATEGORIES_LOADED:
      return {
        ...state,
        categories: action.payload.categories,
        isLoading: false
      };
    case CATEGORIES_RESET:
      return {
        ...state,
        categories: [],
        isLoading: false
      }
    default:
      return state;
  }
}