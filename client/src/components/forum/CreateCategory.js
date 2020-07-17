import React, { Component } from 'react';
import { connect } from 'react-redux';

import { clearAlerts } from '../../actions/alertActions';
import { createCategory } from '../../actions/categoryActions';

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
    this.props.clearAlerts();

    const { name } = this.state;

    let newCategory = {
      name
    };

    this.props.createCategory(newCategory);
  }

  render() {
    return (
      <div className='container'>
        <form onSubmit={this.handleSubmit} className='forum-create'>
          <div className='form-group-inline'>
            <input type='text' className='form-control' name='name' onChange={this.handleChange}></input>
            <input type='submit' className='btn btn-primary' value='Create Category'></input>
          </div>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = {
  clearAlerts, createCategory
};

export default connect(
  null,
  mapDispatchToProps
)(CreateCategory);