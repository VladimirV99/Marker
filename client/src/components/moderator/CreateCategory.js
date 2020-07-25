import React, { Component } from 'react';
import { connect } from 'react-redux';

import { clearAlerts } from '../../actions/alertActions';

import Validation from '../../util/Validation';
import ValidationBlock from '../validation/ValidationBlock';

class CreateCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category_name: '',
      category_validation: [],
      category_error: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    let res = Validation.validateCategory(event.target.value);
    this.setState({
      category_name: event.target.value,
      category_validation: res.validation,
      category_error: res.error
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.clearAlerts();

    const { category_name } = this.state;

    let newCategory = {
      name: category_name
    };

    this.props.createCategory(newCategory);
    this.setState({ category_name: '' });
  }

  render() {
    const { category_name, category_validation, category_error } = this.state;
    const canSubmit = category_name && !category_error;

    return (
      <div className='container'>
        <form onSubmit={this.handleSubmit} className='forum-create'>
          <div className='form-group-inline'>
            <input type='text' className='form-control' name='category_name' value={category_name} onChange={this.handleChange}></input>
            <input type='submit' disabled={!canSubmit} className='btn btn-primary' value='Create Category'></input>
            <ValidationBlock validations={category_validation}></ValidationBlock>
          </div>
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
)(CreateCategory);