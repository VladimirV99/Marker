import {
  FORUMS_LOADING,
  FORUMS_LOADED,
  THREADS_LOADING,
  THREADS_LOADED,
  POSTS_LOADING,
  POSTS_LOADED,
  POST_ADD,
  POST_DELETE
} from '../actions/types';

const initialState = {
  categories: [],
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
        categories: action.payload.categories,
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
    case POST_ADD:
      return {
        ...state,
        posts: [...state.posts, action.payload.post],
        postCount: state.postCount+1
      };
    case POST_DELETE:
      return {
        ...state,
        posts: state.posts.filter(post => post.id!==action.payload),
        postCount: state.postCount-1
      };
    default:
      return state;
  }
}