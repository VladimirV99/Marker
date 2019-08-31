import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import { createAlert, clearAlert } from '../actions/alertActions';
import UserPost from './UserPost';
import Pagination from './Pagination';

import './User.css';

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      user: null,
      posts: [],
      totalPosts: 0,
      page: 1
    }

    this.onPageChange = this.onPageChange.bind(this);
  }

  componentDidMount() {
    axios.get(`/api/users/get/${this.props.match.params.username}`).then(res => {
      this.setState({
        isLoading: false,
        user: res.data.user
      });
      this.onPageChange(this.state.page);
    }).catch(err => {
      this.props.createAlert(err.response.data.message, 'error', err.response.status);
    });
  }

  componentWillUnmount() {
    this.props.clearAlert();
  }

  onPageChange(page) {
    this.setState({
      page
    });
    axios.get(`/api/posts/user/${this.state.user.username}/page/${page}/5`).then(res => {
      this.setState({
        posts: res.data.posts,
        totalPosts: res.data.total
      });
    }).catch(err => {
      this.props.createAlert(err.response.data.message, 'error', err.response.status);
    });
  }

  render() {
    const { isLoading, user, posts, totalPosts, page } = this.state;
    const totalPages = Math.ceil(totalPosts/5);

    if(isLoading) {
      return null;
    }

    return (
      <div className='container'>
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
            </tbody>
          </table>
        </div>

        <h2>Posts:</h2>
        {
          posts.map(post => (
            <UserPost key={post.id} post={post}></UserPost>
          ))
        }

        {totalPosts>0?<Pagination currentPage={page} totalPages={totalPages} displayPages={5} onPageChange={this.onPageChange}></Pagination>:''}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = {
  createAlert, clearAlert
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User);