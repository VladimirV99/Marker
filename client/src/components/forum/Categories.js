import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';

import { addAlert, clearAlerts } from '../../actions/alertActions';
import { createAuthHeaders } from '../../actions/authActions';

import CreateCategory from '../moderator/CreateCategory';
import CreateForum from '../moderator/CreateForum';
import ForumListItem from './ForumListItem';
import ModeratorMenu from '../moderator/ModeratorMenu';

class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      errorLoading: false,
      categories: null
    };

    this.createCategory = this.createCategory.bind(this);
    this.renameCategory = this.renameCategory.bind(this);
    this.deleteCategory = this.deleteCategory.bind(this);
    this.createForum = this.createForum.bind(this);
  }

  componentDidMount() {
    this.setState({
      isLoading: true
    });
    axios.get('/api/forums/all').then(res => {
      this.setState({
        isLoaded: true,
        categories: res.data.categories,
      });
    }).catch(err => {
      this.setState({
        errorLoading: true
      });
      this.props.addAlert(err.response.data.message, 'error', err.response.status);
    });
  }

  componentWillUnmount() {
    this.props.clearAlerts();
  }

  createCategory(newCategory) {
    axios.post('/api/categories/create', newCategory, createAuthHeaders(this.props.auth)).then(res => {
      res.data.category.forums = [];
      this.setState({
        categories: [
          ...this.state.categories,
          res.data.category
        ]
      });
    }).catch(err => {
      this.props.addAlert(err.response.data.message, 'error', err.response.status);
    });
  }

  renameCategory(id, newName) {
    axios.post(`/api/categories/rename/${id}`, {newName}, createAuthHeaders(this.props.auth)).then(res => {
      this.setState({
        categories: this.state.categories.map(category => {
          if(category.id===id)
            return { ...category, name: newName };
          return category
        })
      });
    }).catch(err => {
      this.props.addAlert(err.response.data.message, 'error', err.response.status);
    });
  }

  deleteCategory(id) {
    axios.delete(`/api/categories/delete/${id}`, createAuthHeaders(this.props.auth)).then(res => {
      this.setState({
        categories: this.state.categories.filter(category => category.id!==id)
      });
    }).catch(err => {
      this.props.addAlert(err.response.data.message, 'error', err.response.status);
    });
  }

  createForum(newForum) {
    axios.post('/api/forums/create', newForum, createAuthHeaders(this.props.auth)).then(res => {
      this.setState({
        categories: this.state.categories.map(category => {
          if(category.id === newForum.category) {
            return {
              ...category,
              forums: [ ...category.forums, { ...res.data.forum, threads: [] } ]
            };            
          }
          return category;
        })
      });
    }).catch(err => {
      this.props.addAlert(err.response.data.message, 'error', err.response.status);
    });
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;
    const { isLoaded, errorLoading, categories } = this.state;

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
        {isAuthenticated && user.is_moderator? <CreateCategory createCategory={this.createCategory}></CreateCategory> : null}
        <main className='container main'>
          { categories.map(category => (
            <div key={category.id} className='category'>

              <div className='category-navigation'>
                <h3 className='category-name'><Link to={`/category/${category.id}`}>{category.name}</Link></h3>
                <ModeratorMenu type='category' value={category.name} onRename={value => this.renameCategory(category.id, value)} onDelete={() => this.deleteCategory(category.id)}></ModeratorMenu>
              </div>

              <div className='category-header'>
                <div className='forum-title'>Title</div>
                <div className='forum-threads'>Threads</div>
                <div className='forum-last'>Last Thread</div>
              </div>

              { 
                category.forums.length>0 ?
                  category.forums.map(forum => (
                    <ForumListItem key={forum.id} forum={forum}></ForumListItem>
                  )) : <div className='forum'><h3>There are no forums in this category</h3></div>
              }

              {(isAuthenticated && user.is_moderator)? <CreateForum category={category.id} createForum={this.createForum}></CreateForum> : null}

            </div>
          )) }
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
)(Categories);