import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { clearAlert } from '../actions/alertActions';
import { loadCategories } from '../actions/categoryActions';

import './Categories.css';

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
        <main className='container'>
          { categories.map(category => (
            <div key={category.id} className='category'>

              <h3 className='category-name'>{category.name}</h3>

              <div className='category-header'>
                <div className='forum-title'>Title</div>
                <div className='forum-threads'>Threads</div>
                <div className='forum-last'>Last Post</div>
              </div>

              { category.forums.map(forum => (
                <div key={forum.id} className='forum'>
                  <div className='forum-title'>
                    <span><img src='file_icon.svg' className='icon' alt='File Icon' /></span>
                    <div>
                      <p><Link to={`/forum/${forum.id}`}><strong>{forum.name}</strong></Link></p>
                      <p className='text-muted'>{forum.name}</p>
                    </div>
                  </div>

                  <div className='forum-threads'>
                    <p>{forum.threads || 0}</p>
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
              )) }
              

            </div>
          )) }
        </main>
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