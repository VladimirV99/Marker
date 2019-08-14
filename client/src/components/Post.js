import React, { Component } from 'react';

import './Post.css';

class Post extends Component {
  render() {
    return (
      <article className='post'>
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

export default Post;