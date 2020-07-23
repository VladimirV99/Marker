import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';

import { itemsPerPage, displayPages } from '../../util/Constants';
import { addAlert, clearAlerts } from '../../actions/alertActions';
import { createAuthHeaders } from '../../actions/authActions';

import Post from './Post';
import Reply from './Reply';
import Pagination from '../pagination/Pagination';

class Thread extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      errorLoading: false,
      category: null,
      forum: null,
      thread: null,
      posts: [],
      postCount: 0,
      page: 1
    }

    this.onPageChange = this.onPageChange.bind(this);
    this.createPost = this.createPost.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.upvotePost = this.upvotePost.bind(this);
    this.downvotePost = this.downvotePost.bind(this);
  }

  componentDidMount() {
    this.onPageChange(1);    
  }

  componentWillUnmount() {
    this.props.clearAlerts();
  }

  onPageChange(page) {
    this.props.clearAlerts();
    const totalPages = Math.ceil(this.state.postCount/itemsPerPage);
    if(this.state.isLoaded && page>totalPages)
      page = totalPages;
    this.setState({
      page,
      isLoading: true,
      errorLoading: false
    });
    const thread_id = this.props.match.params.id;
    axios.get(`/api/threads/get/${thread_id}/page/${page}/${itemsPerPage}`, createAuthHeaders(this.props.auth)).then(res => {
      if(res.data.posts.length===0 && res.data.total!==0) {
        this.setState({
          postCount: res.data.total
        });
        this.onPageChange(Math.min(page, Math.ceil(this.state.postCount/itemsPerPage)));
      } else {
        this.setState({
          category: res.data.category,
          forum: res.data.forum,
          thread: res.data.thread,
          posts: res.data.posts,
          postCount: res.data.total,
          postsLoading: false,
          isLoaded: true
        });
      }
    }).catch(err => {
      this.setState({
        errorLoading: true
      });
      this.props.addAlert(err.response.data.message, 'error', err.response.status);
    });
  }

  createPost(newPost) {
    newPost.thread = this.state.thread.id;
    axios.post('/api/posts/create', newPost, createAuthHeaders(this.props.auth)).then(res => {
      this.setState({
        postCount: this.state.postCount+1
      });
      const pageCount = Math.ceil(this.state.postCount/itemsPerPage);
      if(this.state.page!==pageCount) {
        this.onPageChange(pageCount);
      } else {
        this.setState({
          posts: [...this.state.posts, { ...res.data.post, created_at: Date.now(), vote_count: { count: 0 }, votes: [] }],
        });
      }
    }).catch(err => {
      this.props.addAlert(err.response.data.message, 'error', err.response.status);
    });
  }

  deletePost(post) {
    axios.delete(`/api/posts/delete/${post.id}`, createAuthHeaders(this.props.auth)).then(res => {
      this.setState({ postCount: this.state.postCount-1 });
      if(post.is_main)
        this.props.history.push(`/forums/${this.state.forum.id}`);
      else
        this.onPageChange(this.state.page);
    }).catch(err => {
      this.props.addAlert(err.response.data.message, 'error', err.response.status);
    });
  }

  upvotePost(id) {
    axios.post(`/api/posts/upvote/${id}`, {}, createAuthHeaders(this.props.auth)).then(res => {
      this.setState({
        posts: this.state.posts.map(post => {
          if(post.id===res.data.id) {
            let votes = [];
            if(res.data.upvoted)
                votes = [{ id: res.data.user_id, vote: { type: 1 } }];
            return {
              ...post,
              vote_count: { count: res.data.count },
              votes
            };
          }
          return post;
        })
      });
    }).catch(err => {
      this.props.addAlert(err.response.data.message, 'error', err.response.status);
    });
  };

  downvotePost(id) {
    axios.post(`/api/posts/downvote/${id}`, {}, createAuthHeaders(this.props.auth)).then(res => {
      this.setState({
        posts: this.state.posts.map(post => {
          if(post.id===res.data.id) {
            let votes = [];
            if(res.data.downvoted)
                votes = [{ id: res.data.user_id, vote: { type: -1 } }];
            return {
              ...post,
              vote_count: { count: res.data.count },
              votes
            };
          }
          return post;
        })
      });
    }).catch(err => {
      this.props.addAlert(err.response.data.message, 'error', err.response.status);
    });
  }

  render() {
    const { isLoaded, errorLoading, category, forum, thread, posts, postCount  } = this.state;
    const totalPages = Math.ceil(postCount/itemsPerPage);

    if(errorLoading) {
      return null;
    }

    if(!isLoaded) {
      return (
        <h3 className='loading'>Loading</h3>
      );
    }

    return (
      <main className='container main'>
        <div className='thread-header'>
          <p>
            <Link to='/'>Home</Link> &gt; <Link to={`/category/${category.id}`}>{category.name}</Link> &gt; <Link to={`/forum/${forum.id}`}>{forum.name}</Link>
          </p>
          <h1>{thread.subject}</h1>
          Started by <Link to={`/user/${thread.author.username}`}>{thread.author.first_name} {thread.author.last_name}</Link> on {new Date(thread.created_at).toDateString()}.
        </div>
        {
          posts.map(post => (
            <Post key={post.id} post={post} deletePost={this.deletePost} upvotePost={this.upvotePost} downvotePost={this.downvotePost}></Post>
          ))
        }
        <Pagination currentPage={this.state.page} totalPages={totalPages} displayPages={displayPages} onPageChange={this.onPageChange}></Pagination>
        <Reply createPost={this.createPost}></Reply>
      </main>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = {
  addAlert, clearAlerts
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Thread));