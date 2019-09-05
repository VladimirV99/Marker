import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getReadableTimeDifference } from '../../util/TimeHelper';

import { clearAlerts } from '../../actions/alertActions';
import { loadCategories } from '../../actions/categoryActions';

import CreateCategory from './CreateCategory';
import CreateForum from './CreateForum';
import FileIcon from '../common/FileIcon';

class Categories extends Component {
  componentDidMount() {
    this.props.loadCategories();
  }

  componentWillUnmount() {
    this.props.clearAlerts();
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;
    const { categories, isLoading } = this.props.categoriesPage;

    if(!isLoading) {
      return (
        <Fragment>
          {isAuthenticated && user.is_moderator? <CreateCategory></CreateCategory> : null}
          <main className='container'>
            { categories.map(category => (
              <div key={category.id} className='category'>

                <h3 className='category-navigation'><Link to={`/category/${category.id}`}>{category.name}</Link></h3>

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
                          <FileIcon></FileIcon>
                          <div>
                            <p><Link to={`/forum/${forum.id}`}><strong>{forum.name}</strong></Link></p>
                            <p className='text-muted'>{forum.name}</p>
                          </div>
                        </div>

                        <div className='forum-threads'>
                          <p>{forum.thread_count || 0}</p>
                        </div>

                        <div className="forum-last">
                          { forum.threads[0] ? (
                            <div>
                            <p><Link to={`/thread/${forum.threads[0].id}`}>{forum.threads[0].subject}</Link></p>
                            <p><small className="text-muted">by <Link to={`/user/${forum.threads[0].author.username}`}>{forum.threads[0].author.username}</Link></small></p>
                            <p className="text-muted"><small>{getReadableTimeDifference(new Date(forum.threads[0].updated_at))}</small></p>
                          </div>
                          ) : (
                            <p>No Threads</p>
                          )}
                          
                        </div>

                      </div>
                    )) : <div className='forum'><h3>There are no forums in this category</h3></div>
                }

                {isAuthenticated && user.is_moderator? <CreateForum category={category.id}></CreateForum> : null}

              </div>
            )) }
          </main>
        </Fragment>
      );
    } else {
      return (
        <h3 className='loading'>Loading</h3>
      );
    }
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  categoriesPage: state.categoriesPage
});

const mapDispatchToProps = {
  clearAlerts, loadCategories
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Categories);