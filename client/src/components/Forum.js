import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { clearAlert } from '../actions/alertActions';
import { loadThreads } from '../actions/threadActions';
import Pagination from './Pagination';

import './Forum.css';

class Forum extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1
    };

    this.onPageChange = this.onPageChange.bind(this);
  }

  componentDidMount() {
    this.onPageChange(1);
  }

  componentWillUnmount() {
    this.props.clearAlert();
  }

  onPageChange(page) {
    this.props.loadThreads(this.props.match.params.id, page);
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;
    const { category, forum, threads, threadCount, pageLoading, isLoaded } = this.props.thread;
    const totalPages = Math.ceil(threadCount/5);

    if(!isLoaded || pageLoading) {
      return (
        <h3>Loading</h3>
      );
    }

    return (
      <main className='container'>
        <p>
          {isAuthenticated && user.is_moderator?<Link to={`/forum/${this.props.match.params.id}/add`} className='btn btn-blue'>Create Thread</Link>:''}
        </p>

        <div className='category'>

          <h3 className='category-navigation'>
            <Link to='/'>Home</Link> > <Link to={`/category/${category.id}`}>{category.name}</Link> > {forum.name}
          </h3>

          <div className='category-header'>
            <div className='thread-title'>Thread</div>
            <div className='thread-posts'>Posts</div>
            <div className='thread-last'>Last Post</div>
          </div>
          
          { threads.length>0 ?
            threads.map(thread => (
              <div key={thread.id} className='thread'>
                <div className='thread-title'>
                  <div>
                    <p><Link to={`/thread/${thread.id}`}><strong>{thread.subject}</strong></Link></p>
                    <p className='text-muted'>{thread.subject}</p>
                  </div>
                </div>

                <div className='thread-posts'>
                  <p>{thread.post_count || 0}</p>
                </div>

                <div className="thread-last">
                  { thread.posts && thread.posts[0] ? (
                    <div>
                      <p>by {thread.posts[0].author.username}</p>
                      <p className="text-muted"><small>{thread.posts[0].created_at}</small></p>
                    </div>
                  ) : null }
                </div>
              </div>
            )) :
            <div className='thread'><h3>There are no threads in this forum</h3></div>
          }

          </div>

        {threadCount>0?<Pagination currentPage={this.state.page} totalPages={totalPages} displayPages={5} onPageChange={this.onPageChange}></Pagination>:''}
      </main>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  thread: state.thread
});

const mapDispatchToProps = {
  clearAlert, loadThreads
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Forum);