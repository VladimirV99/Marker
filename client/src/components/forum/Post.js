import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { getReadableDate } from '../../util/TimeHelper';
import { encodePost } from '../../util/Encoder';
import Vote from '../common/Vote';
import DeletePostButton from './DeletePostButton';

import './Post.css';

function Post(props) {
  const { post, deletePost } = props;

  return (
    <article className='post'>
      <div className='post-creator'>
        <img className='profile-photo' src={'/'+post.author.photo} alt={post.author.username} />
        <div>
          <Link to={`/user/${post.author.username}`}><strong>{post.author.first_name} {post.author.last_name}</strong></Link>
          <footer><small>Posted on: {getReadableDate(post.created_at)}</small></footer>
        </div>
      </div>

      <div className='post-body'>
        <Vote id={post.id} author_id={post.author.id} balance={post.votebalance.balance} 
          vote={post.votes.length===1?post.votes[0].vote.type:0} upvote={props.upvotePost} downvote={props.downvotePost}>
        </Vote>
        <p className='post-content' dangerouslySetInnerHTML={encodePost(post.content)}></p>
      </div>

      <DeletePostButton author_id={post.author.id} onConfirm={() => deletePost(post)} />
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