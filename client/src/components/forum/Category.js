import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { clearAlerts } from '../../actions/alertActions';
import { loadForums } from '../../actions/forumActions';

import CreateForum from './CreateForum';

class Categories extends Component {
  componentDidMount() {
    this.props.loadForums(this.props.match.params.id);
  }

  componentWillUnmount() {
    this.props.clearAlerts();
  }

  render() {
    const { category, forums, isLoading } = this.props.categoryPage;
    if(!isLoading) {
      return (
        <Fragment>
          <main className='container'>
            <div className='category'>

              <h3 className='category-navigation'>
                <Link to='/'>Home</Link> > {category.name}
              </h3>

              <div className='category-header'>
                <div className='forum-title'>Title</div>
                <div className='forum-threads'>Threads</div>
                <div className='forum-last'>Last Thread</div>
              </div>

              { 
                forums.length>0 ?
                  forums.map(forum => (
                    <div key={forum.id} className='forum'>
                      <div className='forum-title'>
                        <span><img src='/file_icon.svg' className='icon' alt='File Icon' /></span>
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
                          <p className="text-muted"><small>{forum.threads[0].updated_at}</small></p>
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
  categoryPage: state.categoryPage
});

const mapDispatchToProps = {
  clearAlerts, loadForums
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Categories);