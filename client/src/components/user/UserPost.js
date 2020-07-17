import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { deletePost } from '../../actions/postActions';

import './UserPost.css';

function UserPost(props) {
  const { post } = props;

  function handleDelete(event) {
    event.preventDefault();
    props.deletePost(post.id);
  }

  const deleteButton = !post.is_main?
    <span className='user-post-delete' onClick={handleDelete}>&times;</span> 
    : null;
  return (
    <article className='user-post'>
      {deleteButton}

      <div className='user-post-header'>
        Posted to: <strong><Link to={`/thread/${post.thread.id}`}>{post.thread.subject}</Link></strong>
        <footer><small>on: {new Date(post.created_at).toLocaleString('en-GB', { timeZone: 'UTC' })}</small></footer>
      </div>

      <div className='user-post-content'>
        {post.content}
      </div>
    </article>
  );
}

const mapDispatchToProps = {
  deletePost
};

export default connect(
  null,
  mapDispatchToProps
)(UserPost);