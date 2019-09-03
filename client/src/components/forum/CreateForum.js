import React, { Component } from 'react';
import { connect } from 'react-redux';

import { clearAlerts } from '../../actions/alertActions';
import { createForum } from '../../actions/forumActions';

class CreateForum extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.clearAlerts();

    const { name } = this.state;
    const { category } = this.props;

    let newForum = {
      name,
      category
    };

    this.props.createForum(newForum);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className='forum-create'>
        <div className='form-group-inline'>
          <input type='text' className='form-control' name='name' onChange={this.handleChange}></input>
          <input type='submit' className='btn btn-primary' value='Create Forum'></input>
        </div>
      </form>
    );
  }
}

const mapDispatchToProps = {
  clearAlerts, createForum
};

export default connect(
  null,
  mapDispatchToProps
)(CreateForum);