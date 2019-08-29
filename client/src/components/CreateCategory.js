import React, { Component } from 'react';
import { connect } from 'react-redux';

import { createCategory } from '../actions/categoryActions';

class CreateCategory extends Component {
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

    let newCategory = {
      name
    };

    this.props.createCategory(newCategory);
  }

  render() {
    return (
      <div className='container'>
        <form onSubmit={this.handleSubmit}>
          <input type='text' className='form-control form-control-inline' name='name' onChange={this.handleChange}></input>
          <input type='submit' className='btn btn-blue btn-inline' value='Create Category'></input>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = {
  createCategory
};

export default connect(
  null,
  mapDispatchToProps
)(CreateCategory);