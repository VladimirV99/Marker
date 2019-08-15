import React, { Component } from 'react';
import { connect } from 'react-redux';

import { loadPosts } from '../actions/forumActions';
import Post from './Post';
import Reply from './Reply';
import Pagination from './Pagination';

import './Thread.css';

class Thread extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1
    };

    this.onPageChange = this.onPageChange.bind(this);
  }

  componentDidMount() {
    this.onPageChange(1);    
  }

  onPageChange(page) {
    this.setState({
      page
    });
    this.props.loadPosts(this.props.match.params.id, page);
  }

  render() {
    // Add category and forum to navigation when actions and reducers are split
    const { posts, category, forum, thread, isLoading, postCount } = this.props.forum;
    const totalPages = Math.ceil(postCount/5);

    if(isLoading || !thread) {
      return (
        <h3>Loading</h3>
      );
    }

    return (
      <main className='container'>
        <div className='thread-header'>
          <h1>{thread.subject}</h1>
          Started by {thread.user.first_name} {thread.user.last_name} on {thread.createdAt}.
        </div>
        {
          posts.map(post => (
            <Post key={post.id} post={post}></Post>
          ))
        }
        {postCount>0?<Pagination currentPage={this.state.page} totalPages={totalPages} displayPages={5} onPageChange={this.onPageChange}></Pagination>:''}
        <Reply thread={this.props.match.params.id}></Reply>
      </main>
    );
  }
}

const mapStateToProps = state => ({
  forum: state.forum
});

const mapDispatchToProps = {
  loadPosts
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Thread);