import React, { Component } from 'react';
import { connect } from 'react-redux';

import { createPost } from '../actions/postActions';

import './Reply.css';

class Reply extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    const { content } = this.state;

    let newPost = {
      content,
      thread: this.props.thread
    };

    this.props.createPost(newPost);
  }

  render() {
    return (
      <div className='reply'>
        <form onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <label htmlFor='content'>Content</label>
            <textarea className='form-control' name='content' onChange={this.handleChange}></textarea>
          </div>
          <input type='submit' className='btn btn-blue btn-block' value='Reply'></input>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = {
  createPost
};

export default connect(
  null,
  mapDispatchToProps
)(Reply);