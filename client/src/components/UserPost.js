import React, { Component } from 'react';
import { connect } from 'react-redux';

import { deletePost } from '../actions/postActions';

import './UserPost.css';

class UserPost extends Component {
  render() {
    const { post } = this.props;
    const deleteButton = !post.is_main?
      <span className='user-post-delete' onClick={() => this.props.deletePost(post.id)}>&times;</span> 
      : null;
    return (
      <article className='user-post'>
        {deleteButton}

        <div className='user-post-header'>
          Posted to: <strong>{post.thread.subject}</strong>
          <footer><small>on: {post.created_at}</small></footer>
        </div>

        <div className='user-post-content'>
          {post.content}
        </div>
      </article>
    );
  }
}

const mapDispatchToProps = {
  deletePost
};

export default connect(
  null,
  mapDispatchToProps
)(UserPost);