import {
  FORUMS_LOADING,
  FORUMS_LOADED,
  THREADS_LOADING,
  THREADS_LOADED,
  POSTS_LOADING,
  POSTS_LOADED
} from '../actions/types';

const initialState = {
  forums: [],
  category: '',
  forum: '',
  threads: [],
  threadCount: 0,
  thread: '',
  postCount: 0,
  posts: [],
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
    case POSTS_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case POSTS_LOADED:
      return {
        ...state,
        forum: action.payload.forum,
        thread: action.payload.thread,
        posts: action.payload.posts,
        postCount: action.payload.total,
        isLoading: false
      };
    default:
      return state;
  }
}