import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { clearAlert } from '../actions/alertActions';
import { loadCategories } from '../actions/categoryActions';

import './Categories.css';
import CreateCategory from './CreateCategory';
import CreateForum from './CreateForum';

class Categories extends Component {
  componentDidMount() {
    this.props.loadCategories();
  }

  componentWillUnmount() {
    this.props.clearAlert();
  }

  render() {
    const { categories, isLoading } = this.props.category;
    if(!isLoading) {
      return (
        <Fragment>
          <CreateCategory></CreateCategory>
          <main className='container'>
            { categories.map(category => (
              <div key={category.id} className='category'>

                <h3 className='category-name'>{category.name}</h3>

                <div className='category-header'>
                  <div className='forum-title'>Title</div>
                  <div className='forum-threads'>Threads</div>
                  <div className='forum-last'>Last Thread</div>
                </div>

                { 
                  category.forums.length>0 ?
                    category.forums.map(forum => (
                      <div key={forum.id} className='forum'>
                        <div className='forum-title'>
                          <span><img src='file_icon.svg' className='icon' alt='File Icon' /></span>
                          <div>
                            <p><Link to={`/forum/${forum.id}`}><strong>{forum.name}</strong></Link></p>
                            <p className='text-muted'>{forum.name}</p>
                          </div>
                        </div>

                        <div className='forum-threads'>
                          <p>{forum.thread_count || 0}</p>
                        </div>

                        <div className="forum-last">
                          { forum.last_thread ? (
                            <div>
                            <p>{forum.last_thread.subject}</p>
                            <p><small className="text-muted">by {forum.last_thread.author}</small></p>
                            <p className="text-muted"><small>{forum.last_thread.updatedAt}</small></p>
                          </div>
                          ) : (
                            <p>No Threads</p>
                          )}
                          
                        </div>

                      </div>
                    )) : <div className='forum'><h3>There are no forums in this category</h3></div>
                }

                <CreateForum category={category.id}></CreateForum>

              </div>
            )) }
          </main>
        </Fragment>
      );
    } else {
      return (
        <h3>Loading</h3>
      );
    }
  }
}

const mapStateToProps = state => ({
  category: state.category
});

const mapDispatchToProps = {
  clearAlert, loadCategories
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Categories);