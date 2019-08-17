import {
  FORUMS_LOADING,
  FORUMS_LOADED,
  FORUMS_RESET
} from '../actions/types';

const initialState = {
  category: null,
  forums: [],
  isLoading: false
};

export default function(state = initialState, action) {
  switch(action.type) {
    default:
      return state;
  }
}