import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { itemsPerPage, displayPages } from '../../util/Constants';
import { clearAlerts } from '../../actions/alertActions';
import { loadPosts, deletePost } from '../../actions/postActions';

import Post from './Post';
import Reply from './Reply';
import Pagination from '../pagination/Pagination';

class Thread extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1
    };

    this.onPageChange = this.onPageChange.bind(this);
    this.deletePost = this.deletePost.bind(this);
  }

  componentDidMount() {
    this.onPageChange(1);    
  }

  componentWillUnmount() {
    this.props.clearAlerts();
  }

  onPageChange(page) {
    this.props.clearAlerts();
    this.setState({
      page
    });
    this.props.loadPosts(this.props.match.params.id, page, this.props.history);
  }

  deletePost(id) {
    this.props.deletePost(id);
  }

  render() {
    const { category, forum, thread, posts, postCount, isLoaded, errorLoading } = this.props.threadPage;
    const totalPages = Math.ceil(postCount/itemsPerPage);

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
        <div className='thread-header'>
          <p>
            <Link to='/'>Home</Link> &gt; <Link to={`/category/${category.id}`}>{category.name}</Link> &gt; <Link to={`/forum/${forum.id}`}>{forum.name}</Link>
          </p>
          <h1>{thread.subject}</h1>
          Started by <Link to={`/user/${thread.author.username}`}>{thread.author.first_name} {thread.author.last_name}</Link> on {new Date(thread.created_at).toDateString()}.
        </div>
        {
          posts.map(post => (
            <Post key={post.id} post={post} deletePost={this.deletePost}></Post>
          ))
        }
        <Pagination currentPage={this.state.page} totalPages={totalPages} displayPages={displayPages} onPageChange={this.onPageChange}></Pagination>
        <Reply thread={this.props.match.params.id}></Reply>
      </main>
    );
  }
}

const mapStateToProps = state => ({
  threadPage: state.threadPage
});

const mapDispatchToProps = {
  clearAlerts, loadPosts, deletePost
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Thread));