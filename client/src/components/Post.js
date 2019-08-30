import React, { Component } from 'react';
import { connect } from 'react-redux';

import { deletePost } from '../actions/postActions';

import './Post.css';

class Post extends Component {
  render() {
    const { isAuthenticated, user } = this.props.auth;
    const { post } = this.props;
    const deleteButton = (isAuthenticated && (post.userId===user.id || user.is_moderator))?
      <span className='post-delete' onClick={() => this.props.deletePost(post.id)}>&times;</span> 
      : null;
    return (
      <article className='post'>
        {deleteButton}

        <div className='post-creator'>
          <img className='profile-photo' src={'http://localhost:5000/'+post.author.photo} alt={post.author.username} />
          <div>
            <strong>{post.author.first_name} {post.author.last_name}</strong>
            <footer><small>Posted on: {post.created_at}</small></footer>
          </div>

        </div>

        <div className='post-content'>
          {post.content}
        </div>
      </article>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = {
  deletePost
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Post);