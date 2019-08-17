import {
  POSTS_LOADING,
  POSTS_LOADED,
  POSTS_RESET,
  ADD_POST,
  DELETE_POST
} from '../actions/types';

const initialState = {
  category: null,
  forum: null,
  thread: null,
  posts: [],
  postCount: 0,
  pageLoading: false,
  isLoaded: false
};

export default function(state = initialState, action) {
  switch(action.type) {
    case POSTS_LOADING:
      return {
        ...state,
        pageLoading: true
      };
    case POSTS_LOADED:
      return {
        ...state,
        category: action.payload.category,
        forum: action.payload.forum,
        thread: action.payload.thread,
        posts: action.payload.posts,
        postCount: action.payload.total,
        pageLoading: false,
        isLoaded: true
      };
    case POSTS_RESET:
      return {
        ...state,
        category: null,
        forum: null,
        thread: null,
        posts: [],
        postCount: 0,
        pageLoading: false,
        isLoaded: false
      }
    case ADD_POST:
      return {
        ...state,
        posts: [...state.posts, action.payload.post],
        postCount: state.postCount+1
      };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post.id!==action.payload),
        postCount: state.postCount-1
      };
    default:
      return state;
  }
}