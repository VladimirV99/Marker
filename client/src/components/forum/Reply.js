import React, { Component } from 'react';
import { connect } from 'react-redux';

import { clearAlerts } from '../../actions/alertActions';

import Validation from '../../util/Validation';
import ValidationBlock from '../validation/ValidationBlock';

import './Reply.css';

class Reply extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post_content: '',
      post_validation: [],
      post_error: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    let res = Validation.validatePost(event.target.value);
    this.setState({
      post_content: event.target.value,
      post_validation: res.validation,
      post_error: res.error
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.clearAlerts();

    const { post_content } = this.state;

    let newPost = {
      content: post_content
    };

    this.props.createPost(newPost);
    this.setState({
      post_content: '',
      post_validation: [],
      post_error: false
    });
  }

  render() {
    const { post_content, post_validation, post_error } = this.state;

    const canSubmit = post_content && !post_error;

    return (
      <div className='reply'>
        <form onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <label htmlFor='content'>Content:</label>
            <textarea className='form-control reply-content' name='post_content' value={this.state.post_content} onChange={this.handleChange}></textarea>
            <ValidationBlock validations={post_validation}></ValidationBlock>
          </div>
          <input type='submit' disabled={!canSubmit} className='btn btn-primary btn-block' value='Reply'></input>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = {
  clearAlerts
};

export default connect(
  null,
  mapDispatchToProps
)(Reply);