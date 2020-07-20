import {
  POSTS_LOADING,
  POSTS_LOADED,
  POSTS_RESET,
  ADD_POST,
  DELETE_POST,
  UPVOTE_POST,
  DOWNVOTE_POST
} from '../actions/types';

const initialState = {
  category: null,
  forum: null,
  thread: null,
  posts: [],
  postCount: 0,
  postsLoading: false,
  isLoaded: false,
  errorLoading: false
};

export default function(state = initialState, action) {
  switch(action.type) {
    case POSTS_LOADING:
      return {
        ...state,
        postsLoading: true
      };
    case POSTS_LOADED:
      return {
        ...state,
        category: action.payload.category,
        forum: action.payload.forum,
        thread: action.payload.thread,
        posts: action.payload.posts,
        postCount: action.payload.total,
        postsLoading: false,
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
        postsLoading: false,
        isLoaded: false,
        errorLoading: true
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
    case UPVOTE_POST:
      return {
        ...state,
        posts: state.posts.map(post => {
          if(post.id===action.payload.id) {
            let votes = [];
            if(action.payload.upvoted)
                votes = [{ id: action.payload.user_id, vote: { type: 1 } }];
            return {
              ...post,
              vote_count: { count: action.payload.count },
              votes
            };
          }
          return post;
        })
      };
    case DOWNVOTE_POST:
      return {
        ...state,
        posts: state.posts.map(post => {
          if(post.id===action.payload.id) {
            let votes = [];
            if(action.payload.downvoted)
                votes = [{ id: action.payload.user_id, vote: { type: -1 } }];
            return {
              ...post,
              vote_count: { count: action.payload.count },
              votes
            };
          }
          return post;
        })
      };
    default:
      return state;
  }
}