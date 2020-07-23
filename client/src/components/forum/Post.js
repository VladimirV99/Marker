import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Vote from '../common/Vote';
import Modal from '../common/Modal';

import './Post.css';

function Post(props) {
  const [showDeletePanel, setDeletePanel] = useState(false);

  const { isAuthenticated, user } = props.auth;
  const { post, deletePost } = props;

  function handleDelete(event) {
    event.preventDefault();
    deletePost(post.id);
  }

  const deleteButton = (isAuthenticated && (post.user_id===user.id || user.is_moderator))?
    <Fragment>
      <span className='post-delete' onClick={() => setDeletePanel(true)}>&times;</span>
      <Modal show={showDeletePanel} title={'Confirm Delete'} onConfirm={handleDelete} onDeny={() => setDeletePanel(false)}>
        Are you sure you want to delete this post
      </Modal>
    </Fragment>
    : null;
  return (
    <article className='post'>
      {deleteButton}

      <div className='post-creator'>
        <img className='profile-photo' src={'/'+post.author.photo} alt={post.author.username} />
        <div>
          <Link to={`/user/${post.author.username}`}><strong>{post.author.first_name} {post.author.last_name}</strong></Link>
          <footer><small>Posted on: {new Date(post.created_at).toLocaleString('en-GB', { timeZone: 'UTC' })}</small></footer>
        </div>
      </div>

      <div className='post-body'>
        <Vote id={post.id} author_id={post.author.id} balance={post.vote_count?post.vote_count.count:0} vote={post.votes.length===1?post.votes[0].vote.type:0}></Vote>
        <p className='post-content'>
          {post.content}
        </p>
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
)(Post);