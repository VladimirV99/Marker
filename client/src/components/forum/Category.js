import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';

import { addAlert, clearAlerts } from '../../actions/alertActions';
import { createAuthHeaders } from '../../actions/authActions';

import CreateForum from '../moderator/CreateForum';
import ForumListItem from './ForumListItem';
import ModeratorMenu from '../moderator/ModeratorMenu';

class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      errorLoading: false,
      category: null,
      forums: []
    };

    this.renameCategory = this.renameCategory.bind(this);
    this.deleteCategory = this.deleteCategory.bind(this);
    this.createForum = this.createForum.bind(this);
  }

  componentDidMount() {
    const category_id = this.props.match.params.id;
    this.setState({
      isLoaded: false
    });
    axios.get(`/api/forums/category/${category_id}`).then(res => {
      this.setState({
        isLoaded: true,
        category: res.data.category,
        forums: res.data.forums
      });
    }).catch(err => {
      this.setState({
        errorLoading: true
      });
      if(err.response.status === 404)
        this.props.history.push('/');
      this.props.addAlert(err.response.data.message, 'error', err.response.status);
    });
  }

  renameCategory(newName) {
    axios.post(`/api/categories/rename/${this.state.category.id}`, {newName}, createAuthHeaders(this.props.auth)).then(res => {
      this.setState({
        category: {
          ...this.state.category,
          name: newName
        }
      });
    }).catch(err => {
      this.props.addAlert(err.response.data.message, 'error', err.response.status);
    });
  }

  deleteCategory() {
    axios.delete(`/api/categories/delete/${this.state.category.id}`, createAuthHeaders(this.props.auth)).then(res => {
      this.props.history.push('/');
    }).catch(err => {
      this.props.addAlert(err.response.data.message, 'error', err.response.status);
    });
  }

  createForum(newForum) {
    axios.post('/api/forums/create', newForum, createAuthHeaders(this.props.auth)).then(res => {
      this.setState({
        forums: [
          ...this.state.forums,
          { ...res.data.forum, threads: [] }
        ]
      });
    }).catch(err => {
      this.props.addAlert(err.response.data.message, 'error', err.response.status);
    });
  }

  componentWillUnmount() {
    this.props.clearAlerts();
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;
    const { isLoaded, errorLoading, category, forums } = this.state;

    if(errorLoading) {
      return null;
    }

    if(!isLoaded) {
      return (
        <h3 className='loading'>Loading</h3>
      );
    }

    return (
      <Fragment>
        <main className='container main'>
          <div className='category'>

            <div className='category-navigation'>
              <h3 className='category-name'><Link to='/'>Home</Link> &gt; {category.name}</h3>
              <ModeratorMenu type='category' value={category.name} onRename={value => this.renameCategory(value)} onDelete={this.deleteCategory}></ModeratorMenu>
            </div>

            <div className='category-header'>
              <div className='forum-title'>Title</div>
              <div className='forum-threads'>Threads</div>
              <div className='forum-last'>Last Thread</div>
            </div>

            { 
              forums.length>0 ?
                forums.map(forum => (
                  <ForumListItem key={forum.id} forum={forum}></ForumListItem>
                )) : <div className='forum'><h3>There are no forums in this category</h3></div>
            }

            {(isAuthenticated && user.is_moderator)? <CreateForum category={category.id} createForum={this.createForum}></CreateForum> : null}

          </div>
        </main>
      </Fragment>
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
)(withRouter(Category));