import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';

import { addAlert, clearAlerts } from '../../actions/alertActions';
import { createAuthHeaders } from '../../actions/authActions';

import Validation from '../../util/Validation';
import ValidationBlock from '../validation/ValidationBlock';

import '../../Forum.css';

class CreateThread extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      errorLoading: false,
      category: null,
      forum: null,
      thread_subject: '',
      thread_subject_validation: [],
      thread_subject_error: false,
      thread_content: '',
      thread_content_validation: [],
      thread_content_error: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({
      isLoading: true,
      errorLoading: false
    });
    const thread_id = this.props.match.params.id;
    axios.get(`/api/forums/get/${thread_id}`).then(res => {
      this.setState({
        isLoaded: true,
        category: res.data.category,
        forum: res.data.forum        
      });
    }).catch(err => {
      this.setState({
        errorLoading: true
      });
      this.props.addAlert(err.response.data.message, 'error', err.response.status);
    });
  }

  componentWillUnmount() {
    this.props.clearAlerts();
  }

  handleChange(event) {
    let res;
    switch(event.target.name) {
      case 'thread_subject':
        res = Validation.validateThread(event.target.value);
        this.setState({ 
          thread_subject: event.target.value,
          thread_subject_validation: res.validation,
          thread_subject_error: res.error
        });
        break;
      case 'thread_content':
        res = Validation.validatePost(event.target.value);
        this.setState({ 
          thread_content: event.target.value,
          thread_content_validation: res.validation,
          thread_content_error: res.error
        });
        break;
      default:
        this.setState({ [event.target.name]: event.target.value });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.clearAlerts();

    const { thread_subject, thread_content } = this.state;

    let newThread = {
      subject: thread_subject,
      content: thread_content,
      forum: this.props.match.params.id
    };

    axios.post('/api/threads/create', newThread, createAuthHeaders(this.props.auth)).then(res => {
      this.props.history.push(`/thread/${res.data.thread.id}`);
    }).catch(err => {
      this.props.addAlert(err.response.data.message, 'error', err.response.status);
    });
  }

  render() {
    const {
      isLoaded, errorLoading, category, forum,
      thread_subject, thread_subject_validation, thread_subject_error,
      thread_content, thread_content_validation, thread_content_error
    } = this.state;

    const canSubmit = (thread_subject && thread_content) && !(thread_subject_error || thread_content_error);

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
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <label htmlFor='subject'>Subject</label>
            <input type='text' className='form-control' name='thread_subject' onChange={this.handleChange}></input>
            <ValidationBlock validations={thread_subject_validation}></ValidationBlock>
          </div>
          <div className='form-group'>
            <label htmlFor='content'>Content</label>
            <textarea className='form-control post-input-content' name='thread_content' onChange={this.handleChange}></textarea>
            <ValidationBlock validations={thread_content_validation}></ValidationBlock>
          </div>
          <input type='submit' disabled={!canSubmit} className='btn btn-primary btn-block' value='Create Thread'></input>
        </form>
      </main>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = {
  addAlert, clearAlerts
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CreateThread));