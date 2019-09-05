import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { clearAlerts } from '../../actions/alertActions';
import { loadPosts } from '../../actions/postActions';
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
    this.props.loadPosts(this.props.match.params.id, page);
  }

  render() {
    const { category, forum, thread, posts, postCount, isLoaded } = this.props.threadPage;
    const totalPages = Math.ceil(postCount/5);

    if(!isLoaded) {
      return (
        <h3 className='loading'>Loading</h3>
      );
    }

    return (
      <main className='container'>
        <div className='thread-header'>
          <p>
            <Link to='/'>Home</Link> > <Link to={`/category/${category.id}`}>{category.name}</Link> > <Link to={`/forum/${forum.id}`}>{forum.name}</Link>
          </p>
          <h1>{thread.subject}</h1>
          Started by <Link to={`/user/${thread.author.username}`}>{thread.author.first_name} {thread.author.last_name}</Link> on {new Date(thread.created_at).toDateString()}.
        </div>
        {
          posts.map(post => (
            <Post key={post.id} post={post}></Post>
          ))
        }
        <Pagination currentPage={this.state.page} totalPages={totalPages} displayPages={5} onPageChange={this.onPageChange}></Pagination>
        <Reply thread={this.props.match.params.id}></Reply>
      </main>
    );
  }
}

const mapStateToProps = state => ({
  threadPage: state.threadPage
});

const mapDispatchToProps = {
  clearAlerts, loadPosts
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Thread);