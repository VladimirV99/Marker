import {
  THREADS_LOADING,
  THREADS_LOADED,
  THREADS_RESET
} from '../actions/types';

const initialState = {
  category: null,
  forum: null,
  threads: [],
  threadCount: 0,
  pageLoading: false,
  isLoaded: false
};

export default function(state = initialState, action) {
  switch(action.type) {
    case THREADS_LOADING:
      return {
        ...state,
        pageLoading: true
      };
    case THREADS_LOADED:
      return {
        ...state,
        category: action.payload.category,
        forum: action.payload.forum,
        threads: action.payload.threads,
        threadCount: action.payload.total,
        pageLoading: false,
        isLoaded: true
      };
    case THREADS_RESET:
      return {
        ...state,
        category: null,
        forum: null,
        threads: [],
        threadCount: 0,
        pageLoading: false,
        isLoaded: false
      }
    default:
      return state;
  }
}