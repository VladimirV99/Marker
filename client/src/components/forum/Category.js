import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { clearAlerts } from '../../actions/alertActions';
import { loadForums } from '../../actions/forumActions';

import CreateForum from './CreateForum';
import ForumListItem from './ForumListItem';

class Category extends Component {
  componentDidMount() {
    this.props.loadForums(this.props.match.params.id, this.props.history);
  }

  componentWillUnmount() {
    this.props.clearAlerts();
  }

  render() {
    const { category, forums, isLoaded, errorLoading } = this.props.categoryPage;

    if(errorLoading) {
      return null;
    }

    if(!isLoaded) {
      return (
        <h3 className='loading'>Loading</h3>
      );
    }

    return (
      <Fragment>
        <main className='container main'>
          <div className='category'>

            <h3 className='category-navigation'>
              <Link to='/'>Home</Link> &gt; {category.name}
            </h3>

            <div className='category-header'>
              <div className='forum-title'>Title</div>
              <div className='forum-threads'>Threads</div>
              <div className='forum-last'>Last Thread</div>
            </div>

            { 
              forums.length>0 ?
                forums.map(forum => (
                  <ForumListItem key={forum.id} forum={forum}></ForumListItem>
                )) : <div className='forum'><h3>There are no forums in this category</h3></div>
            }

            <CreateForum category={category.id}></CreateForum>

          </div>
        </main>
      </Fragment>
    );
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
)(withRouter(Category));