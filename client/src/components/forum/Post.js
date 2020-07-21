import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { deletePost } from '../../actions/postActions';
import Vote from '../common/Vote';

import './Post.css';

function Post(props) {
  const { isAuthenticated, user } = props.auth;
  const { post } = props;

  function handleDelete(event) {
    event.preventDefault();
    props.deletePost(post.id);
  }

  const deleteButton = (!post.is_main && isAuthenticated && (post.user_id===user.id || user.is_moderator))?
    <span className='post-delete' onClick={handleDelete}>&times;</span> 
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
        <Vote id={post.id} balance={post.vote_count?post.vote_count.count:0} vote={post.votes.length===1?post.votes[0].vote.type:0}></Vote>
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

const mapDispatchToProps = {
  deletePost
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Post);