import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { loadThreads } from '../actions/forumActions';
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

  onPageChange(page) {
    this.props.loadThreads(this.props.match.params.id, page);
  }

  render() {
    const { category, forum, threads, threadCount, isLoading } = this.props.forum;
    const totalPages = Math.ceil(threadCount/5);

    if(isLoading) {
      return (
        <h3>Loading</h3>
      );
    }

    return (
      <main className='container'>
        {this.props.isAuthenticated?<Link to={`/forum/${this.props.match.params.id}/add`} className='btn'>Create Thread</Link>:''}

        <div className='category'>

          <h3 className='category-name'>{category} > {forum}</h3>

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
                  <p>{thread.posts || 0}</p>
                </div>

                <div className="thread-last">
                  <div>
                    {/* <p>by {thread.last_post.author}</p>
                    <p className="text-muted"><small>{thread.last_post.created_at}</small></p> */}
                  </div>
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
  isAuthenticated: state.auth.isAuthenticated,
  forum: state.forum
});

const mapDispatchToProps = {
  loadThreads
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Forum);