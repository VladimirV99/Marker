import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';

import { getReadableTimeDifference } from '../../util/TimeHelper';
import { itemsPerPage, displayPages } from '../../util/Constants';
import { addAlert, clearAlerts } from '../../actions/alertActions';
import { createAuthHeaders } from '../../actions/authActions';

import DeleteButton from '../common/DeleteButton';
import Pagination from '../pagination/Pagination';

class Forum extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      errorLoading: false,
      category: null,
      forum: null,
      threads: [],
      threadCount: 0,
      page: 1
    };

    this.onPageChange = this.onPageChange.bind(this);
    this.deleteForum = this.deleteForum.bind(this);
  }

  componentDidMount() {
    this.onPageChange(1);
  }

  componentWillUnmount() {
    this.props.clearAlerts();
  }

  onPageChange(page) {
    const forum_id = this.props.match.params.id;
    axios.get(`/api/forums/get/${forum_id}/page/${page}/${itemsPerPage}`).then(res => {
      this.setState({
        isLoaded: true,
        errorLoading: false,
        category: res.data.category,
        forum: res.data.forum,
        threads: res.data.threads,
        threadCount: res.data.total
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

  deleteForum() {
    console.log(this.state.forum);
    axios.delete(`/api/forums/delete/${this.state.forum.id}`, createAuthHeaders(this.props.auth)).then(res => {
      this.props.history.push(`/category/${this.state.category.id}`);
    }).catch(err => {
      this.props.addAlert(err.response.data.message, 'error', err.response.status);
    });
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;
    const { isLoaded, errorLoading, category, forum, threads, threadCount } = this.state;
    const totalPages = Math.ceil(threadCount/itemsPerPage);

    if(errorLoading) {
      return null;
    }

    if(!isLoaded) {
      return (
        <h3 className='loading'>Loading</h3>
      );
    }

    return (
      <main className='container main'>
        {isAuthenticated? <p><Link to={`/forum/${this.props.match.params.id}/add`} className='btn btn-primary'>Create Thread</Link></p> : ''}

        <div className='category'>

          <div className='category-navigation'>
            <h3 className='category-name'>
              <Link to='/'>Home</Link> &gt; <Link to={`/category/${category.id}`}>{category.name}</Link> &gt; {forum.name}
            </h3>

            {(isAuthenticated && user.is_moderator)?
            <DeleteButton title='Confirm Delete' content='Are you sure you want to delete this forum?' onConfirm={this.deleteForum} />
            : null}
          </div>

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

        <Pagination currentPage={this.state.page} totalPages={totalPages} displayPages={displayPages} onPageChange={this.onPageChange}></Pagination>
      </main>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  forumPage: state.forumPage
});

const mapDispatchToProps = {
  addAlert, clearAlerts
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Forum));