import React, { Component } from 'react';
import { connect } from 'react-redux';

import { clearAlerts } from '../../actions/alertActions';

class CreateCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category_name: ''
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

    const { category_name } = this.state;

    let newCategory = {
      name: category_name
    };

    this.props.createCategory(newCategory);
    this.setState({ category_name: '' });
  }

  render() {
    return (
      <div className='container'>
        <form onSubmit={this.handleSubmit} className='forum-create'>
          <div className='form-group-inline'>
            <input type='text' className='form-control' name='category_name' value={this.state.category_name} onChange={this.handleChange}></input>
            <input type='submit' className='btn btn-primary' value='Create Category'></input>
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