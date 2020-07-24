import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import { addAlert, clearAlerts } from '../../actions/alertActions';
import { createAuthHeaders } from '../../actions/authActions';

class CreateThread extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subject: '',
      content: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillUnmount() {
    this.props.clearAlerts();
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.clearAlerts();

    const { subject, content } = this.state;

    let newThread = {
      subject,
      content,
      forum: this.props.match.params.id
    };

    axios.post('/api/threads/create', newThread, createAuthHeaders(this.props.auth)).then(res => {
      this.props.history.push(`/thread/${res.data.thread.id}`);
    }).catch(err => {
      this.props.addAlert(err.response.data.message, 'error', err.response.status);
    });
  }

  render() {
    return (
      <main className='container'>
        <form onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <label htmlFor='subject'>Subject</label>
            <input type='text' className='form-control' name='subject' onChange={this.handleChange}></input>
          </div>
          <div className='form-group'>
            <label htmlFor='content'>Content</label>
            <textarea className='form-control' name='content' onChange={this.handleChange}></textarea>
          </div>
          <input type='submit' className='btn btn-primary btn-block' value='Create Thread'></input>
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