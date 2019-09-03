import {
  CATEGORIES_LOADING,
  CATEGORIES_LOADED,
  CATEGORIES_RESET,
  CATEGORY_ADD,
  CATEGORIES_ADD_FORUM
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
    case CATEGORY_ADD:
      return {
        ...state,
        categories: [
          ...state.categories,
          action.payload
        ]
      };
    case CATEGORIES_ADD_FORUM:
      return {
        ...state,
        categories: state.categories.map(category => {
          if(category.id === action.payload.category_id) {
            category.forums.push(action.payload.forum);
          }
          return category;
        })
      };
    default:
      return state;
  }
}