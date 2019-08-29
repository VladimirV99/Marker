import React, { Component } from 'react';
import { connect } from 'react-redux';

import { createForum } from '../actions/forumActions';

import './CreateForum.css';

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
      <form onSubmit={this.handleSubmit} id='create-forum'>
        <input type='text' className='form-control form-control-inline' name='name' onChange={this.handleChange}></input>
        <input type='submit' className='btn btn-blue btn-inline' value='Create Forum'></input>
      </form>
    );
  }
}

const mapDispatchToProps = {
  createForum
};

export default connect(
  null,
  mapDispatchToProps
)(CreateForum);