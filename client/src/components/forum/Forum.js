import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getReadableTimeDifference } from '../../util/TimeHelper';

import { clearAlerts } from '../../actions/alertActions';
import { loadThreads } from '../../actions/threadActions';
import Pagination from '../pagination/Pagination';

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
    this.props.clearAlerts();
  }

  onPageChange(page) {
    this.props.loadThreads(this.props.match.params.id, page, this.props.history);
  }

  render() {
    const { isAuthenticated } = this.props.auth;
    const { category, forum, threads, threadCount, isLoaded, errorLoading } = this.props.forumPage;
    const totalPages = Math.ceil(threadCount/5);

    if(errorLoading) {
      return null;
    }

    if(!isLoaded) {
      return (
        <h3 className='loading'>Loading</h3>
      );
    }

    return (
      <main className='container'>
        {isAuthenticated? <p><Link to={`/forum/${this.props.match.params.id}/add`} className='btn btn-primary'>Create Thread</Link></p> : ''}

        <div className='category'>

          <h3 className='category-navigation'>
            <Link to='/'>Home</Link> &gt; <Link to={`/category/${category.id}`}>{category.name}</Link> &gt; {forum.name}
          </h3>

          <div className='category-header'>
            <div className='thread-title'>Thread</div>
            <div className='thread-posts'>Posts</div>
            <div className='thread-last'>Last Post</div>
          </div>
          
          { 
            threadCount>0 ? (
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
                        <p>by <Link to={`/user/${thread.posts[0].author.username}`}>{thread.posts[0].author.username}</Link></p>
                        <p className="text-muted"><small>{getReadableTimeDifference(new Date(thread.posts[0].created_at))}</small></p>
                      </div>
                    ) : null }
                  </div>
                </div>
              )) 
            ) : (
              <div className='thread'><h3>There are no threads in this forum</h3></div>
            )
          }

        </div>

        <Pagination currentPage={this.state.page} totalPages={totalPages} displayPages={5} onPageChange={this.onPageChange}></Pagination>
      </main>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  forumPage: state.forumPage
});

const mapDispatchToProps = {
  clearAlerts, loadThreads
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Forum));