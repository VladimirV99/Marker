import React, { Component } from 'react';
import { connect } from 'react-redux';

import { deletePost } from '../actions/forumActions';

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
          {/* <img class='profile-photo' src='' alt='' /> */}
          <div>
            <strong>{this.props.post.user.first_name} {this.props.post.user.last_name}</strong>
            <footer><small>Posted on: {this.props.post.createdAt}</small></footer>
          </div>

        </div>

        <hr className='post-divider' />

        <div className='post-content'>
          {this.props.post.content}
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