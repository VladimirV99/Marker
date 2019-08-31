import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { deletePost } from '../actions/postActions';

import './Post.css';

class Post extends Component {
  render() {
    const { isAuthenticated, user } = this.props.auth;
    const { post } = this.props;
    const deleteButton = (isAuthenticated && (post.user_id===user.id || user.is_moderator))?
      <span className='post-delete' onClick={() => this.props.deletePost(post.id)}>&times;</span> 
      : null;
    return (
      <article className='post'>
        {deleteButton}

        <div className='post-creator'>
          <img className='profile-photo' src={'/'+post.author.photo} alt={post.author.username} />
          <div>
            <Link to={`/user/${post.author.username}`}><strong>{post.author.first_name} {post.author.last_name}</strong></Link>
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