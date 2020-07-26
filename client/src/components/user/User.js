import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';

import { itemsPerPage, displayPages } from '../../util/Constants';
import { addAlert, clearAlerts } from '../../actions/alertActions';
import { createAuthHeaders } from '../../actions/authActions';

import UserPost from './UserPost';
import Pagination from '../pagination/Pagination';
import ConfirmModal from '../modal/ConfirmModal';

import './User.css';

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      errorLoading: false,
      user: null,
      posts: [],
      postCount: 0,
      page: 1,
      pageLoading: true,
      pageLoadingError: false,
      showModeratorPanel: false
    }

    this.onPageChange = this.onPageChange.bind(this);
    this.handleAddModerator = this.handleAddModerator.bind(this);
    this.handleRemoveModerator = this.handleRemoveModerator.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.upvotePost = this.upvotePost.bind(this);
    this.downvotePost = this.downvotePost.bind(this);
    this.deletePost = this.deletePost.bind(this);
  }

  componentDidMount() {
    axios.get(`/api/users/get/${this.props.match.params.username}`).then(res => {
      this.setState({
        isLoaded: true,
        user: res.data.user
      });
      this.onPageChange(this.state.page);
    }).catch(err => {
      this.setState({
        errorLoading: true
      });
      if(err.response.status === 404)
        this.props.history.push('/');
      this.props.addAlert(err.response.data.message, 'error', err.response.status);
    });
  }

  componentWillUnmount() {
    this.props.clearAlerts();
  }

  onPageChange(page) {
    this.props.clearAlerts();
    const totalPages = Math.ceil(this.state.postCount/itemsPerPage);
    if(!this.state.pageLoading && page>totalPages)
      page = totalPages;
    this.setState({
      page,
      pageLoading: true,
      pageLoadingError: false
    });
    axios.get(`/api/posts/user/${this.state.user.username}/page/${page}/${itemsPerPage}`, createAuthHeaders(this.props.auth)).then(res => {
      if(res.data.posts.length===0 && res.data.total!==0) {
        this.setState({
          postCount: res.data.total
        });
        this.onPageChange(Math.min(page, Math.ceil(this.state.postCount/itemsPerPage)));
      } else {
        this.setState({
          posts: res.data.posts,
          postCount: res.data.total,
          pageLoading: false
        });
      }
    }).catch(err => {
      this.setState({
        pageLoadingError: true
      });
      this.props.addAlert(err.response.data.message, 'error', err.response.status);
    });
  }

  handleAddModerator() {
    axios.post(`/api/users/addModerator/${this.state.user.username}`, {}, createAuthHeaders({auth: this.props.auth})).then(res => {
      this.setState({
        user: {
          ...this.state.user,
          is_moderator: true
        },
        showModeratorPanel: false
      });
      this.props.addAlert(res.data.message, 'success', res.status);
    }).catch(err => {
      this.props.addAlert(err.response.data.message, 'error', err.response.status);
    });
  }

  handleRemoveModerator() {
    axios.post(`/api/users/removeModerator/${this.state.user.username}`, {}, createAuthHeaders({auth: this.props.auth})).then(res => {
      this.setState({
        user: {
          ...this.state.user,
          is_moderator: false
        },
        showModeratorPanel: false
      });
      this.props.addAlert(res.data.message, 'success', res.status);
    }).catch(err => {
      this.props.addAlert(err.response.data.message, 'error', err.response.status);
    });
  }

  openModal() {
    this.setState({ showModeratorPanel: true });
  }

  closeModal() {
    this.setState({ showModeratorPanel: false });
  }

  upvotePost(id) {
    axios.post(`/api/posts/upvote/${id}`, {}, createAuthHeaders(this.props.auth)).then(res => {
      this.setState({
        posts: this.state.posts.map(post => {
          if(post.id===res.data.id) {
            let votes = [];
            if(res.data.upvoted)
                votes = [{ id: res.data.user_id, vote: { type: 1 } }];
            return {
              ...post,
              votebalance: { balance: res.data.balance },
              votes
            };
          }
          return post;
        })
      });
    }).catch(err => {
      this.props.addAlert(err.response.data.message, 'error', err.response.status);
    });
  };

  downvotePost(id) {
    axios.post(`/api/posts/downvote/${id}`, {}, createAuthHeaders(this.props.auth)).then(res => {
      this.setState({
        posts: this.state.posts.map(post => {
          if(post.id===res.data.id) {
            let votes = [];
            if(res.data.downvoted)
                votes = [{ id: res.data.user_id, vote: { type: -1 } }];
            return {
              ...post,
              votebalance: { balance: res.data.balance },
              votes
            };
          }
          return post;
        })
      });
    }).catch(err => {
      this.props.addAlert(err.response.data.message, 'error', err.response.status);
    });
  }

  deletePost(id) {
    axios.delete(`/api/posts/delete/${id}`, createAuthHeaders(this.props.auth)).then(res => {
      this.setState({ postCount: this.state.postCount-1 });
      this.onPageChange(this.state.page);
    }).catch(err => {
      this.props.addAlert(err.response.data.message, 'error', err.response.status);
    });
  }

  render() {
    const { isLoaded, errorLoading, user, posts, postCount, page, pageLoading, pageLoadingError } = this.state;
    const totalPages = Math.ceil(postCount/itemsPerPage);

    if(errorLoading) {
      return null;
    }

    if(!isLoaded) {
      return (
        <h3 className='loading'>Loading</h3>
      );
    }

    return (
      <div className='container main'>
        <div className='user-data'>
          <img src={'/' + user.photo} alt={user.username} className='user-photo-large' />

          <table className='user-info'>
            <tbody>
              <tr>
                <td colSpan='2'><h3>{user.first_name} {user.last_name}</h3></td>
              </tr>
              <tr>
                <th>username:</th>
                <td>{user.username}</td>
              </tr>
              <tr>
                <th>email:</th>
                <td>{user.email}</td>
              </tr>
              <tr>
                <th>member since:</th>
                <td>{new Date(user.created_at).toDateString()}</td>
              </tr>
              <tr>
                {
                  this.props.auth.isAuthenticated && this.props.auth.user.is_moderator && this.props.auth.user.username!==user.username ? (
                    user.is_moderator ? (
                      <td colSpan='2'>
                        <button className='btn btn-primary btn-block mv-025' onClick={this.openModal}>Remove Moderator</button>
                        <ConfirmModal show={this.state.showModeratorPanel} title={'Confirm Moderator'} onConfirm={this.handleRemoveModerator} onDeny={this.closeModal}>
                          Are you sure you want to remove {user.first_name} {user.last_name} as a moderator
                        </ConfirmModal>
                      </td>
                    ) : (
                      <td colSpan='2'>
                        <button className='btn btn-primary btn-block mv-025' onClick={this.openModal}>Add Moderator</button>
                        <ConfirmModal show={this.state.showModeratorPanel} title={'Confirm Moderator'} onConfirm={this.handleAddModerator} onDeny={this.closeModal}>
                          Are you sure you want to add {user.first_name} {user.last_name} as a moderator
                        </ConfirmModal>
                      </td>
                    )
                  ) : null
                }
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Posts:</h2>
        {
          pageLoadingError ? (
            <h3 className='loading'>Error Loading Posts</h3>
          ) : (
            pageLoading ? (
              <h3 className='loading'>Loading</h3>
            ) : (
              postCount>0 ? (
                <Fragment>
                  {posts.map(post => (
                    <UserPost key={post.id} author={user} post={post} deletePost={this.deletePost} upvotePost={this.upvotePost} downvotePost={this.downvotePost}></UserPost>
                    ))}
                  <Pagination currentPage={page} totalPages={totalPages} displayPages={displayPages} onPageChange={this.onPageChange}></Pagination>
                </Fragment>
              ) : (
              <h3 className='text-center'>This user has no posts</h3>
              )
            )
          )
        }
            
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = {
  addAlert, clearAlerts
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(User));