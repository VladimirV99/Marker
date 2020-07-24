import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Vote from '../common/Vote';
import DeleteButton from '../common/DeleteButton';

import './UserPost.css';

function UserPost(props) {
  const { isAuthenticated, user } = props.auth;
  const { post, author, deletePost } = props;
  
  const deleteButton = (isAuthenticated && (author.id===user.id || user.is_moderator))?
    <DeleteButton title='Confirm Delete' content='Are you sure you want to delete this post?' onConfirm={() => deletePost(post.id)} />
    : null;
  return (
    <article className='user-post'>

      <div className='user-post-header'>
        {deleteButton}
        Posted to: <strong><Link to={`/thread/${post.thread.id}`}>{post.thread.subject}</Link></strong>
        <footer><small>on: {new Date(post.created_at).toLocaleString('en-GB', { timeZone: 'UTC' })}</small></footer>
      </div>

      <div className='user-post-body'>
        <Vote id={post.id} author_id={author.id} balance={post.vote_count?post.vote_count.count:0} vote={post.votes.length===1?post.votes[0].vote.type:0}></Vote>
        <p className='user-post-content'>{post.content}</p>
      </div>
    </article>
  );
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  null
)(UserPost);