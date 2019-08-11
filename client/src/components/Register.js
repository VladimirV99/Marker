import React, { Component } from 'react';
import { connect } from 'react-redux';

import { register } from '../actions/authActions';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      first_name: '',
      last_name: '',
      email: '',
      password: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    const { username, first_name, last_name, email, password } = this.state;

    const newUser = {
      username,
      first_name,
      last_name,
      email,
      password
    };

    this.props.register(newUser);
  }

  render() {
    return(
      <div className='container'>
        <form onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <label htmlFor='username'>Username</label>
            <input type='text' className='form-control' name='username' onChange={this.handleChange}></input>
          </div>
          <div>
            <div className='form-group w-50 pr-1'>
              <label htmlFor='username'>First Name</label>
              <input type='text' className='form-control' name='first_name' onChange={this.handleChange}></input>
            </div>
            <div className='form-group w-50 pl-1'>
              <label htmlFor='username'>Last Name</label>
              <input type='text' className='form-control' name='last_name' onChange={this.handleChange}></input>
            </div>
          </div>
          <div className='form-group'>
            <label htmlFor='username'>Email</label>
            <input type='text' className='form-control' name='email' onChange={this.handleChange}></input>
          </div>
          <div className='form-group'>
            <label htmlFor='username'>Password</label>
            <input type='password' className='form-control' name='password' onChange={this.handleChange}></input>
          </div>
          <input type='submit' className='btn btn-blue btn-block' value='Register'></input>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error
});

const mapDispatchToProps = {
  register
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Register);