import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { upvotePost, downvotePost } from '../../actions/postActions';

import './Vote.css';

function Vote(props) {
  const { isAuthenticated, user } = props.auth;
  const { id, author_id, balance, vote } = props;

  function upvote(event) {
    event.preventDefault();
    if(isAuthenticated) {
      if(author_id!==user.id)
        props.upvotePost(id);
    } else {
      props.history.push('/login');
    }
  }

  function downvote(event) {
    event.preventDefault();
    if(isAuthenticated) {
      if(author_id!==user.id)
        props.downvotePost(id);
    } else {
      props.history.push('/login');
    }
  }

  let menuClass = 'vote-menu';
  if(isAuthenticated && author_id===user.id)
    menuClass += ' vote-menu-disabled';
  let upvoteClass = 'vote' + (vote===1 ? ' vote-active' : '');
  let downvoteClass = 'vote' + (vote===-1 ? ' vote-active' : '');

  return (
    <div className={menuClass}>
      <span className={upvoteClass} onClick={upvote}><svg aria-hidden="true" width="36" height="36" viewBox="0 0 36 36"><path d="M2 26h32L18 10 2 26z"></path></svg></span>
      {balance}
      <span className={downvoteClass} onClick={downvote}><svg aria-hidden="true" width="36" height="36" viewBox="0 0 36 36"><path d="M2 10h32L18 26 2 10z"></path></svg></span>
    </div>
  );
}

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = {
  upvotePost,
  downvotePost
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Vote));