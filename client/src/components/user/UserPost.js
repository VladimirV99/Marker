import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { getReadableDate } from '../../util/TimeHelper';
import { encodePost } from '../../util/Encoder';
import Vote from '../common/Vote';
import DeletePostButton from '../forum/DeletePostButton';

import './UserPost.css';

function UserPost(props) {
  const { post, author, deletePost } = props;

  return (
    <article className='user-post'>

      <div className='user-post-header'>
        Posted to: <strong><Link to={`/thread/${post.thread.id}`}>{post.thread.subject}</Link></strong>
        <footer><small>on: {getReadableDate(post.created_at)}</small></footer>
        <DeletePostButton author_id={author.id} onConfirm={() => deletePost(post.id)} />
      </div>

      <div className='user-post-body'>
        <Vote id={post.id} author_id={author.id} balance={post.votebalance.balance} 
          vote={post.votes.length===1?post.votes[0].vote.type:0} upvote={props.upvotePost} downvote={props.downvotePost}>
        </Vote>
        <p className='user-post-content' dangerouslySetInnerHTML={encodePost(post.content)}></p>
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