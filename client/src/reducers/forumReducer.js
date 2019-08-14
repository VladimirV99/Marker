import {
  FORUMS_LOADING,
  FORUMS_LOADED,
  THREADS_LOADING,
  THREADS_LOADED
} from '../actions/types';

const initialState = {
  forums: [],
  category: '',
  forum: '',
  threads: [],
  threadCount: 0,
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
    case THREADS_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case THREADS_LOADED:
      return {
        ...state,
        category: action.payload.category,
        forum: action.payload.forum,
        threads: action.payload.threads,
        threadCount: action.payload.total,
        isLoading: false
      };
    default:
      return state;
  }
}